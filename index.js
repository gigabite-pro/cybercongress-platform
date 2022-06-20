const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const request = require('request');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const session = require('express-session');
const Report = require('./models/report');
const Newsletter = require('./models/newsletter');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'yoyo-honeysingh',
    resave: false,
    saveUninitialized: false,
    name: 'reCaptcha',
}))
app.enable('trust proxy');


//DB Config
const db = require('./config/keys').MongoURI;


//Connect DB
mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('db connected...'))
.catch(err => console.log(err))

//Mail Config
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cybercongressaisg46@gmail.com',
      pass: `${process.env.EMAIL_PASS}`
    }
  });
  

app.get('/', (req,res)=>{
    const images = []
    const links = []
    axios.get(`https://graph.instagram.com/me/media?fields=id&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`)
    .then( async (response) => {
        const ids = response.data.data;
        for(i=0; i < 8; i++){
            await axios.get(`https://graph.instagram.com/${ids[i].id}?fields=media_url,permalink,media_type&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`)
            .then((response)=>{
                if(response.data.media_type != 'VIDEO'){
                    images.push(response.data.media_url);
                    links.push(response.data.permalink);
                }
            }).catch(err => console.log(err));
        }
        res.render('home', {
            images : images,
            links : links
        });
    })
    .catch(err => {
        res.render('home',{
            images: null,
            links: null,
        })
    });
     
});

// app.post('/reCaptcha', (req,res)=>{
//     if(
//         req.body.captcha === undefined ||
//         req.body.captcha === '' ||
//         req.body.captcha === null
//       ){
//           res.json({
//               body : {
//                   'success': false,
//               }
//           });
//       }

//       const secretKey = process.env.CAPTCHA_SECRET_KEY;

//       const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

//       request(verifyUrl, (err, response, body)=>{
//         body = JSON.parse(body);
//         if(body.success !== undefined && !body.success){
//             res.json(body)
//         }else{
//             req.session.reCaptcha = true;
//             res.json(body)
//         }

//       })
// });

var upload = multer();

app.post('/postReport', upload.array('files'), (req,res)=>{
    const reportType = req.body.reportType;
    var name = req.body.name;
    var typeOfUser = req.body.typeOfUser;
    var phone = req.body.phone;
    const message = req.body.message.trim();
    var images = [];
    var secrecy = req.body.maintainSecrecy;
    // Getting form data
    var ip = req.ip;

    var fileinfo = req.files;
    if(fileinfo.length > 7){
        res.render('error')
    }
    // If 8 files, show error page

    function getImages(){
        if(fileinfo.length != 0){
                for(let i=0; i < fileinfo.length; i++){
                    const buffer = Buffer.from(fileinfo[i].buffer);
                    const base64String = buffer.toString('base64');
            
                    const config = {
                        method: 'post',
                        url: 'https://api.imgur.com/3/image',
                        headers: { 
                            'Authorization': `Client-ID ${process.env.CLIENT_ID}`, 
                             Accept: 'application/json',
                        },
                        data : {'image':base64String},
                        mimeType: 'multipart/form-data',
                    };
            
                    axios(config)
                    .then(function (response) {
                        images.push(response.data.data.link);
                        if (images.length === fileinfo.length) {
                            allRequests()
                          }
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });
                }  
        }else{
            allRequests()
        }
    }

    function allRequests(){
        if(!name){
            name = "Anonymous"
        }
    
        if(!phone){
            phone = "Anonymous"
        }
    
        if(!typeOfUser){
            typeOfUser = "Anonymous"
        }
    
        if(secrecy == 'yes'){
            secrecy = "True";
        }else{
            secrecy = "False";
        }
    
        if(phone.toString().length > 10){
            res.render('error');
        }
    
        else{  
                
                if(images.length == 0){
                    images = ["Not Provided"]
                }
        
                newReport = new Report({
                    'reportType': reportType,
                    'name': name,
                    'typeOfUser': typeOfUser,
                    'phone' : phone.toString(),
                    'message' : message,
                    'images': images,
                    'secrecy': secrecy,
                    'ip': ip,
                });
    
                newReport.save()
                .then((report)=>{
                    console.log('added to db');
                    }).catch(err=>{
                        console.log(err);
                    })

                    var imagesString = images.join(', ');
    
                    const url = `${process.env.SCRIPT_URL}/?rt=${reportType}&name=${name}&ut=${typeOfUser}&ph=${phone.toString()}&msg=${message}&img=${imagesString}&sec=${secrecy}&auth=${process.env.AUTH_TOKEN}`
    
                    const encodedUrl = encodeURI(url);
        
                    axios.get(encodedUrl).then((response)=>{
                        console.log(response.data);
                    }).catch(err=> console.log(err))
    
                    
                    var mailOptions = {
                        from: 'cybercongressaisg46@gmail.com',
                        to: 'cybercongressaisg46@gmail.com',
                        subject: `Report Type: ${reportType}`,
                        html: `<p>
                        <strong>User Type: </strong>${typeOfUser} 
                        <br>
                        <strong>Name: </strong>${name}
                        <br>
                        <strong>Phone Number: </strong>${phone.toString()}
                        <br>
                        <strong>Message: </strong>${message}
                        <br>
                        <strong>Images: </strong>${imagesString}
                        <br>
                        <strong>Maintain Secrecy: </strong>${secrecy}
                        <br>
                        <strong>IP Address: </strong>${ip}
                    </p>`
                    };
    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    })
    
                    if(phone != 'Anonymous'){
                        const message = 'Cyber Congress of AIS-46 has received your report. Kindly wait for us to get in touch with you.'
                        axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST_SMS_API_KEY}&sender_id=TXTIND&message=${message}&route=v3&numbers=${phone.toString()}`)
                        .then(response =>{
                            if(response.data.return == true){
                                console.log(`SMS sent to ${phone.toString()}`)
                                res.render('submit')
                            }
                        }).catch(err => {
                            console.log(err)
                            res.render('submit')
                        })
                        // var options = {authorization : process.env.FAST_SMS_API_KEY ,sender_id : 'CYBERCONG', message : 'Cyber Congress of AIS-46 has received your report. Kindly wait for us to get in touch with you.' ,  numbers : [parseInt(phone.toString())]} 
                        // fast2sms.sendMessage(options) 
                        // .then(()=>{
                        //     console.log('SMS sent')
                        //     res.render('submit')
                        // }).catch((err)=>{
                        //     console.log(err)
                        //     res.render('error')
                        // })
                    }else{
                        res.render('submit')
                    }
        }
    }
    getImages()
})

app.post('/newsletter', (req,res)=>{
    const email = req.body.email;
            newNewsletter = new Newsletter({
                "email": email
            });
            newNewsletter.save()
            .then((newsletter)=>{
                console.log('New SignUp');
                axios.get(`${process.env.DOC_API}?email=${email}`).then(response => {
                    console.log('email added');
                    res.render('submit');
                }).catch(err => {
                    console.log(err)
                    res.render("error");
                });
            })
            .catch((err)=>{
                console.log(err);
                res.render('error');
            }); 
    
});

app.use((req, res, next) => {
    res.status(404).render('error');
})


app.listen(PORT, console.log(`Server started on port ${PORT}`))
