const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const nodemailer = require('nodemailer');
const fast2sms = require('fast-two-sms')
const mongoose = require('mongoose');
const Report = require('./models/report');
const Newsletter = require('./models/newsletter');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.enable('trust proxy')


//DB Config
const db = require('./config/keys').MongoURI;
const { response } = require('express');


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
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(ip != process.env.badIP){
        axios.get(`https://graph.instagram.com/me/media?fields=id&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`)
    .then( async (response) => {
        const ids = response.data.data;
        for(i=0; i < 7; i++){
            await axios.get(`https://graph.instagram.com/${ids[i].id}?fields=media_url,permalink&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`)
            .then((response)=>{
                images.push(response.data.media_url);
                links.push(response.data.permalink);
            }).catch(err => console.log(err));
        }
        res.render('home', {
            images : images,
            links : links
        });
        console.log(ip)
    })
    .catch(err => {
         res.render('home',{
             images: null,
             links: null,
         })
         console.log(ip) 
        });
    } 
});

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

    if(fileinfo.length != 0){
        try {
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
                })
                .catch(function (error) {
                    console.log(error.response.status);
                });
            }   
        } catch (error) {
            console.log(error);
        }
    }

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
        setTimeout(() => {
            if(images.length != fileinfo.length){
                res.render('error')
            }
            
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
                const id = report.id;
                Report.findById(id, (err,docs)=>{
                    if(err){
                        console.log(err);
                    }
                    const dbName = docs.name;
                    const dbReportType = docs.reportType;
                    const dbPhone = docs.phone;
                    const dbTypeOfUser = docs.typeOfUser;
                    const dbMessage = docs.message;
                    const dbImages = docs.images;
                    const dbSecrecy = docs.secrecy;
                    const dbip = docs.ip;
        
                    axios.get(`${process.env.SCRIPT_URL}/?rt=${dbReportType}&name=${dbName}&ut=${dbTypeOfUser}&ph=${dbPhone}&msg=${dbMessage}&img=${dbImages}&sec=${dbSecrecy}&auth=${process.env.AUTH_TOKEN}`
                    ).then(response => {
                        console.log(response.data)

                        var mailOptions = {
                            from: 'cybercongressaisg46@gmail.com',
                            to: 'cybercongressaisg46@gmail.com',
                            subject: `Report Type: ${dbReportType}`,
                            html: `<p>
                            <strong>User Type: </strong>${dbTypeOfUser} 
                            <br>
                            <strong>Name: </strong>${dbName}
                            <br>
                            <strong>Phone Number: </strong>${dbPhone}
                            <br>
                            <strong>Message: </strong>${dbMessage}
                            <br>
                            <strong>Images: </strong>${dbImages}
                            <br>
                            <strong>Maintain Secrecy: </strong>${dbSecrecy}
                            <br>
                            <strong>IP Address: </strong>${dbip}
                        </p>`
                        };
    
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                                if(dbPhone != 'Anonymous'){
                                    var options = {authorization : process.env.FAST_SMS_API_KEY , message : 'Cyber Congress of AIS-46 has received your report. Kindly wait for us to get in touch with you.' ,  numbers : [parseInt(dbPhone)]} 
                                    fast2sms.sendMessage(options) 
                                    .then(()=>{
                                        console.log('SMS sent')
                                        res.render('submit')
                                    }).catch((err)=>{
                                        console.log(err)
                                        res.render('error')
                                    })
                                }else{
                                    res.render('submit')
                                }
                            }
                        });
                        }).catch(err=>{
                            console.log(err);
                            res.render('error');
                        });
                })
            })
            .catch((err)=>{
                console.log(err);
                res.render('error');
            });
        }, 9000);
    }
});
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
                    res.redirect('/');
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


app.listen(PORT, console.log(`Server started on port ${PORT}`))
