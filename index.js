const express = require('express');
const app = express();
const axios = require('axios');
const nodemailer = require('nodemailer');

const multer = require('multer');
const mongoose = require('mongoose');
// const path = require("path")
// const fs = require("fs")

const Report = require('./models/report');
const Newsletter = require('./models/newsletter');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const scriptURL = process.env.SCRIPT_URL
const emailID = process.env.EMAIL

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.set('views', (__dirname + '/views'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//DB Config
const db = require('./config/keys').MongoURI;


//Connect DB
mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

//Mail Config
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASS}`
    }
});



app.get('/', (req,res)=>{
    const members = require("./data/members.json")
    const teachers = require("./data/teachers.json")
    const alumni = require("./data/alumni.json")
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
            links : links,
            members, teachers, alumni
        });
    })
    .catch(err => {
        res.render('home',{
            images: null,
            links: null,
            members, teachers, alumni
        })
    });
     
});

// Firebase and Multer setup
    var admin = require("firebase-admin");

    var serviceAccount = require('./creds.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://cybercongress-9b71a.appspot.com'
    });

    // const firebaseConfig = {
    //     apiKey: "AIzaSyCP1b1HBROs62kBDLObcs4YNJzVuEk_zag",
    //     authDomain: "cybercongress-9b71a.firebaseapp.com",
    //     projectId: "cybercongress-9b71a",
    //     storageBucket: "cybercongress-9b71a.appspot.com",
    //     messagingSenderId: "277282535896",
    //     appId: "1:277282535896:web:fd9366fe394f32d453daad",
    //     measurementId: "G-QZPTPD1DLC"
    //   };

    const storage = admin.storage();
    const bucket = storage.bucket();

    const storageMulter = multer.memoryStorage();
    const uploadMulter = multer({ storage: storageMulter });

app.post('/postReport', uploadMulter.array('files', 7), (req,res)=>{
    const reportType = req.body.reportType;
    var name = req.body.name;
    var typeOfUser = req.body.typeOfUser;
    var phone = req.body.phone;
    const message = req.body.message.trim();
    var secrecy = req.body.maintainSecrecy;
    // Getting form data
    var ip = req.ip;

    var uploadedFiles = req.files;
    var downloadURLs = [];

    if(uploadedFiles.length > 7){
        res.render('error')
    }
    // If 8 files, show error page

    async function getImages(){
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        // Upload files to Firebase Storage and get download URLs
        for (const file of uploadedFiles) {
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            const fileUpload = bucket.file(uniqueFileName);
    
            await fileUpload.save(file.buffer, {
            contentType: file.mimetype
            });
    
            const downloadUrl = await fileUpload.getSignedUrl({
            action: 'read',
            expires: expirationDate.setFullYear(expirationDate.getFullYear() + 5)
            });
    
            downloadURLs.push(downloadUrl);
        }
        allRequests();
    }

    const shortURLs = [];

    async function allRequests(){
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
                if(downloadURLs.length == 0){
                    downloadURLs = ["Not Provided"]
                }
        
                newReport = new Report({
                    'reportType': reportType,
                    'name': name,
                    'typeOfUser': typeOfUser,
                    'phone' : phone.toString(),
                    'message' : message,
                    'images': downloadURLs,
                    'secrecy': secrecy,
                    'ip': ip,
                });
    
                newReport.save()
                .then(()=>{
                    console.log('added to db');
                    }).catch(err=>{
                        console.log(err);
                    });

                    for(link in downloadURLs){
                        axios.post(`https://api.tinyurl.com/create?api_token=${process.env.TINYURL_APIKEY}`, {
                            "url": downloadURLs[link][0],
                          }).then(response => {
                            console.log(response.data.data.tiny_url)
                            shortURLs.push(response.data.data.tiny_url)
                            // if (shortURLs.length == downloadURLs.length){
                            //     sheetAndMail();
                            // }
                        })
                          .catch(error => {
                            console.error('Error:', error);
                          });
                    }

                    setTimeout(() => {
                        sheetAndMail();
                    }, 2000);

                    function sheetAndMail(){
                        var imagesString = shortURLs.join(', ');
                        const url = `${scriptURL}/?rt=${reportType}&name=${name}&ut=${typeOfUser}&ph=${phone.toString()}&msg=${message}&img=${imagesString}&sec=${secrecy}&auth=${process.env.AUTH_TOKEN}`
        
                        const encodedUrl = encodeURI(url);
            
                        axios.get(encodedUrl).then((response)=>{
                            console.log(response.data);
                        }).catch(err=> console.log(err))
        
                        
                        var mailOptions = {
                            from: `${emailID}`,
                            to: `${emailID}`,
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
                    }
    
                    if(phone != 'Anonymous'){
                        // const message = 'Cyber Congress of AIS-46 has received your report. Kindly wait for us to get in touch with you.'
                        // axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST_SMS_API_KEY}&sender_id=TXTIND&message=${message}&route=v3&numbers=${phone.toString()}`)
                        // .then(response =>{
                        //     if(response.data.return == true){
                        //         console.log(`SMS sent to ${phone.toString()}`)
                        //         res.render('submit')

                        //     }
                        // }).catch(err => {
                        //     console.log(err)
                        //     res.render('submit')
                        // })
                        res.render('submit')
                    }else{
                        res.render('submit')
                    }
        }
    }
    getImages()
})

app.post('/newsletter', (req,res)=>{
    const email = req.body.email;
            const newNewsletter = new Newsletter({
                "email": email
            });
            newNewsletter.save()
            .then(()=>{
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
