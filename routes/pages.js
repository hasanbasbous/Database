const express = require('express');
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    multipleStatements: true,
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
                req.session.userId = json[0].Id;
                console.log(req.session.userId);
                res.render('index', {fname: req.session.list[0].fname, lname: req.session.list[0].lname});
            }
        })
    } else {
        res.render("login")
    }
});

// router.get('/', (req, res) => {
//     res.render('index')
// })

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
    if(req.session.loggedin)
     res.render('search');
    else 
     res.render('login')
})

router.get('/share', (req, res) => {
    if(req.session.loggedin)
     res.render('share');
    else 
     res.render('login')
})

router.get('/trips', (req, res) => {
   if(req.session.loggedin) {
    console.log(req.session.userId);
    console.log(req.session.list[0].fname);
    const{id} = req.body;
    let query = "SELECT * FROM trips WHERE driverId = '" + req.session.userId + "'";
    let query1 = "SELECT * FROM users WHERE Id = '" + req.session.userId + "'";
    db.query("SELECT * FROM trips WHERE driverId = '" + req.session.userId + "'; SELECT * FROM trips, requests WHERE id = tripId AND userId = '" + req.session.userId + "'", (error, results) => {
        if(error){
            console.log(error);
        } else {
            // console.log(results[0]);
            console.log(results[0]);
            console.log("Results 1")
            console.log(results[1]);
            res.render('trips', {
                result0: results[0], result1: results[1]
            });
        }
    })}
    else 
        res.render('login')
})


module.exports = router;