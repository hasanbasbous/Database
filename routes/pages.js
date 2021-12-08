const express = require('express');
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

const router = express.Router();

router.get('/', (req, res) => {
    if(req.session.loggedin){
        console.log(req.session.loggedin)
        console.log(req.session.email)
        db.query('Select * FROM users WHERE email = ?', [req.session.email], async(error, results) => {
            if(error)
                console.log(error);
            else {
                console.log('>> results: ',results);
                var string = JSON.stringify(results);
                console.log('>>string: ', string)
                var json = JSON.parse(string);
                console.log('>>json: ', json);
                console.log('>> user.name: ', json[0].fname);
                req.session.list = json;
                req.session.userId = json[0].id;
                console.log(req.session.userId);
                res.render('index', {fname: req.session.list[0].fname, lname: req.session.list[0].lname, 
                    email: req.session.list[0].email, password: req.session.list[0].password,
                    phoneNumber: req.session.list[0].phoneNumber, driversLicenseId: req.session.list[0].license, gender: req.session.list[0].gender.toUpperCase()});

            }
        })
    } else {
        res.render("login")
    }
});

router.get('/car', (req, res) => {
    if(req.session.loggedin)
        res.render('car');
    else
        res.render('login');
});

router.get('/userEdit', (req, res) => {
    if(req.session.loggedin){
        if(req.session.list[0].gender == 'male'){
            var statusM = "checked"
            var statusF = "unchecked"
        }else{
            var statusM = "unchecked"
            var statusF = "checked"
        }
        res.render('userEdit', {fname: req.session.list[0].fname, lname: req.session.list[0].lname, 
                                email: req.session.list[0].email, password: req.session.list[0].password,
                                phoneNumber: req.session.list[0].phoneNumber, driversLicenseId: req.session.list[0].license, statusM: statusM, statusF: statusF});
    }else
        res.render('login');
})

router.get('/register', (req, res) => {
    if(req.session.loggedin)
        res.render('index');
    else
        res.render('register');
});

router.get('/login', (req, res) => {
    if(req.session.loggedin)
     res.render('index');
     else
     res.render('login')
});

router.get('/search', (req, res) => {
    if(req.session.loggedin){
     res.render('search');
    }else 
     res.render('login')
})


router.get('/trips', (req, res) => {
   if(req.session.loggedin) {
    console.log(req.session.userId);
    console.log(req.session.list[0].fname);
    const{id} = req.body;
    let query = "SELECT * FROM trips WHERE driverId='" + req.session.userId + "'";
    db.query(query, (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results);
            res.render('trips', {
                results
            });
        }
    })}
    else 
        res.render('login')
})


module.exports = router;