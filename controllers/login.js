const mysql = require("mysql");
var session = require('express-session');
const express = require("express");

app = express()

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

exports.login = 
    (request, response) =>  {
	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], async(error, results) =>  {
			if(error){
                console.log(error);
            }
            else if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				response.redirect('/');
			} else {
				response.render('login', {message: 'Wrong email or password'});
			}			
			
		});
	} else {
		response.render('login', {message: 'Please enter Email and Password!'});
		
	}
}
