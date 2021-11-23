const express = require("express");
var session = require('express-session');
const path = require('path');
const mysql = require("mysql"); //import mysql
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs');
var expressHbs =  require('express-handlebars');
// const tripsController = require('../controllers/trips')
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

var hbs = expressHbs.create({});

hbs.handlebars.registerHelper('eq', function(a, b) {
    return a !== b;
  })

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

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

app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
  });

app.get('/', (req, res) => {
    if(req.session.loggedin){
        // console.log(req.session.loggedin)
        db.query('Select fname, lname FROM users WHERE email = ?', [req.session.email], async(error, results) => {
            if(error)
                console.log(error);
            else {
                console.log(results);
                res.render('index', results);
            }
        })
    } else {
        res.render("login")
    }
});

// app.post('/auth', function(request, response) {
// 	var email = request.body.email;
// 	var password = request.body.password;
// 	if (email && password) {
// 		db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], async(error, results) =>  {
// 			if(error){
//                 console.log(error);
//             }
//             else if (results.length > 0) {
// 				request.session.loggedin = true;
// 				request.session.email = email;
// 				response.redirect('/');
// 			} else {
// 				response.render('login');
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Please enter Email and Password!');
// 		response.end();
// 	}
// });



// router.get('/trips', tripsController)

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