const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose')
const Report = require('./models/report');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

//DB Config
const db = require('./config/keys').MongoURI;
const { report } = require('process');

//Connect DB
mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('db connected...'))
.catch(err => console.log(err))

app.get('/', (req,res)=>{
    res.render('home');
});

app.post('/postReport', (req,res)=>{
    const reportType = req.body.reportType;
    let name = req.body.name;
    let typeOfUser = req.body.typeOfUser;
    const message = req.body.message.trim();
    let images = [];
    let secrecy = req.body.maintainSecrecy;

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
    })
    .catch((err)=> console.log(err));

    res.send('Added to db')
});


app.listen(PORT, console.log(`Server started on port ${PORT}`))