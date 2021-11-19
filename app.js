const express = require("express");
const path = require('path');
const mysql = require("mysql"); //import mysql
const dotenv = require("dotenv");

// const bodyParser = require('body-parser');
// const {check, validationResult} = require('express-validator')

dotenv.config({ path: './.env'}) // ./ current dir

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded( { extended: false}));
app.use(express.json());

app.set('view engine', 'hbs');

// const urlencodedParser = bodyParser.urlencoded({extended: false})

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL Connected...")
    }
} )

//Define Routes
app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));

// app.use('/search', require('./routes/pages'));

// app.get("/", (req, res) => {
//     // res.send("<h1>Home Page</h1>")
//     res.render("index")
// })
// app.get('/register', (req, res) => {
//     res.render('register')
// })

// app.post('/register', urlencodedParser, [
//     check('register-first-name', 'This name must me 3+ characters long')
//         .exists()
//         .matches(/^[A-Za-z]+$/)
//         .isLength({ min: 3 }),
//     check('register-email', 'Email is not valid')
//         .isEmail()
//         .normalizeEmail()
// ], (req, res)=> {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         // return res.status(422).jsonp(errors.array())
//         const alert = errors.array()
//         res.render('register', {
//             alert
//         })
//     }
// })

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})