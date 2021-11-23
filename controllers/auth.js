const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    console.log(req.body);

    const { fname, lname, email,  password, passwordConfirm, phoneNumber, driversLicenseId, gender} = req.body;

    db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const namePattern = /^[A-Za-z]+$/;
        const licensePattern = /^[0-9]{9}$/;
        const phonePattern = /^(03|7[016-9]|81)[0-9]{6}$/;

        if(fname.length == 0){
            return res.render('register', {
                message: 'First name can not be blank'
            });
        // }else if(!namePattern.test(fname)){
        //     return res.render('register', {
        //         message: 'First name should be all alphabets'
        //     });
        } else if (lname.length == 0){
            return res.render('register', {
                message: 'Last name can not be blank'
            });
        } else if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if(!re.test(email)){
            return res.render('register', {
                message: 'Email has an invalid form'
            });
        } else if(password.length == 0){
            return res.render('register', {
                message: 'Password can not be blank'
            });
        }
        else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match'
            });
        } else if(!phonePattern.test(phoneNumber)){
            return res.render('register', {
                message: 'Phone number should be 8 digtis'
            });
        }
        else if (driversLicenseId.length !== 0){
            if(!licensePattern.test(driversLicenseId)){
                return res.render('register', {
                    message: 'License should be nine digits'
                });
            }
            
        } else if (gender !== 'male' && gender !== 'female'){
            return res.render('register', {
                message: 'You must choose a gender'
            });
        }
        
        // let hashedPassword = await bcrypt.hash(password, 8);
        // console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {fname: fname, lname: lname, Email: email, password: password, phoneNumber: phoneNumber, license: driversLicenseId, 
        gender: gender}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('login', {
                    message: 'User registered'
                });
            }
        })
    });



    // res.json("Form submitted");
}