const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var fn;
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

exports.userEdit = (req, res) => {
    console.log(req.body);
    const { fname, lname, email,  password, passwordConfirm, phoneNumber, driversLicenseId, gender} = req.body;

    if (gender == 'male'){
            var statusM = "checked"
            var statusF = "unchecked"
        }else{
            var statusM = "unchecked"
            var statusF = "checked"
        }
    db.query(`SELECT email FROM users WHERE id != ${req.session.userId} AND email = ?`, [email] , async(error, results) => {
        if(error){
            console.log(error);
        }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const licensePattern = /^[0-9]{9}$/;
        const phonePattern = /^(03|7[016-9]|81)[0-9]{6}$/;

        if(fname.length == 0){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'First name can not be blank'
            });
        } else if (lname.length == 0){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'Last name can not be blank'
            });
        } else if(results.length > 0){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'That email is already in use'
            });
        } else if(!re.test(email)){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'Email has an invalid form'
            });
        } else if(password.length == 0){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'Password can not be blank'
            });
        }
        else if(password !== passwordConfirm){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'Passwords do not match'
            });
        } else if(!phonePattern.test(phoneNumber)){
            return res.render('userEdit', {fname, lname, email, password,
                phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                message: 'Phone number should be 8 digtis'
            });
        }
        else if (driversLicenseId.length !== 0){
            if(!licensePattern.test(driversLicenseId)){
                return res.render('userEdit', { fname, lname, email, password,
                     phoneNumber, driversLicenseId, statusF : statusF, statusM: statusM,
                     message: 'License should be nine digits'
                });
            }
            
        }
        console.log()
        console.log(">>Results", JSON.stringify(results));
        // let hashedPassword = await bcrypt.hash(password, 8);
        // console.log(hashedPassword);
        if (req.session.email != email) {
            req.session.email = email;
        }
        db.query("UPDATE users SET fname='" + fname + "', lname='" + lname + "', Email='" + email + "', password='" + password +
         "', phoneNumber='" + phoneNumber + "', license=" + driversLicenseId + " ,gender='" + gender + "' WHERE id = " + req.session.userId, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return  (
                    res.render('index', {fname, lname, email,
                        phoneNumber, driversLicenseId, gender: gender.toUpperCase()
                    })
                    
                )
            }
        })
        db.query(`SELECT email FROM users WHERE id != ${req.session.userId} AND email = ?`, [email], (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return  (
                    res.redirect('/')
                    
                )
            }
        })
    });
    



    // res.json("Form submitted");
}