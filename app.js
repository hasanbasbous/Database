const express = require('express');
var session = require('express-session');
const path = require('path');
const mysql = require('mysql'); //import mysql
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
var hbs = require('hbs');


dotenv.config({ path: './.env' }); // ./ current dir

const app = express();

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: '',
	database: process.env.DATABASE,
});


const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//https://www.npmjs.com/package/handlebars-dateformat
//https://docs.celigo.com/hc/en-us/articles/360045564992-Handlebar-expressions-for-date-and-time-format-codes
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
app.set('view engine', 'hbs');


db.connect((error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('MySQL Connected...');
	}
});

//Define Routes
app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/login');
});

app.get('/', (req, res) => {
	if (req.session.loggedin) {
		db.query(
			'Select fname, lname FROM users WHERE email = ?',
			[req.session.email],
			async (error, results) => {
				if (error) console.log(error);
				else {
					console.log(results);
					res.render('index', results);
				}
			}
		);
	} else {
		res.render('login');
	}
});


app.listen(5000, () => {
	console.log('Server started on Port 5000');
});
