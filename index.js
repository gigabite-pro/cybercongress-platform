const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const Report = require('./models/report');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: false}))

//DB Config
const db = require('./config/keys').MongoURI;

//Connect DB
mongoose.connect(db, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('db connected...'))
.catch(err => console.log(err))

app.get('/', (req,res)=>{
    res.render('home');
});

app.post('/postReport', (req,res)=>{
    let name = req.body.name
    const message = req.body.message.trim()

    if(name == ""){
        name = "Anonymous"
    }

    newReport = new Report({
        'name': name,
        'message' : message,
    });

    newReport.save()
    .then(report => console.log('added to db'))
    .catch((err)=> console.log(err));

    res.send('Added to db')
});


app.listen(PORT, console.log(`Server started on port ${PORT}`))