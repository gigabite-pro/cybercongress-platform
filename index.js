const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const axios = require('axios');
const mongoose = require('mongoose')
const Report = require('./models/report');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//DB Config
const db = require('./config/keys').MongoURI;

//Connect DB
mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('db connected...'))
.catch(err => console.log(err))

app.get('/', (req,res)=>{
    res.render('home');
});

var upload = multer();

app.post('/postReport', upload.array('files'), (req,res,next)=>{
    const reportType = req.body.reportType;
    var name = req.body.name;
    var typeOfUser = req.body.typeOfUser;
    const message = req.body.message.trim();
    var images = [];
    var secrecy = req.body.maintainSecrecy;

    var fileinfo = req.files;
    console.log(fileinfo);
    try {
        for(let i=0; i < fileinfo.length; i++){
            const buffer = Buffer.from(fileinfo[i].buffer);
            const base64String = buffer.toString('base64');
    
            const config = {
                method: 'post',
                url: 'https://api.imgur.com/3/image',
                headers: { 
                    'Authorization': `Client-ID ${process.env.Client_ID}`, 
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
        console.log(error)
        res.render('error');
    }

    if(!name){
        name = "Anonymous"
    }

    if(!typeOfUser){
        typeOfUser = "Anonymous"
    }

    if(secrecy == 'yes'){
        secrecy = "True";
    }else{
        secrecy = "False";
    }

    setTimeout(() => {
        if(images.length == 0){
            images = ["Not Provided"]
        }


        newReport = new Report({
            'reportType': reportType,
            'name': name,
            'typeOfUser': typeOfUser,
            'message' : message,
            'images': images,
            'secrecy': secrecy,
        });
    
        newReport.save()
        .then((report)=>{
            const id = report.id;
            Report.findById(id, (err,docs)=>{
                if(err){
                    console.log(err)
                }
                const dbName = docs.name;
                const dbReportType = docs.reportType;
                const dbTypeOfUser = docs.typeOfUser;
                const dbMessage = docs.message;
                const dbImages = docs.images;
                const dbSecrecy = docs.secrecy;
    
                axios.get(`https://cyber-congress-gsheet-db-api.herokuapp.com/?rt=${dbReportType}&name=${dbName}&ut=${dbTypeOfUser}&msg=${dbMessage}&img=${dbImages}&sec=${dbSecrecy}`
                ).then(response => {
                console.log(response.data)
                });
            })
            res.render('submit');
        })
        .catch((err)=>{
            console.log(err);
            res.render('error');
        });
    }, fileinfo.length*2500);
});


app.listen(PORT, console.log(`Server started on port ${PORT}`))