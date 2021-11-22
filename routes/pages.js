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
        console.log('logged in')
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

// router.get('/', (req, res) => {
//     res.render('index')
// })

router.get('/register', (req, res) => {
    if(req.session.email)
        res.render('index');
    else
        res.render('register');
});

router.get('/login', (req, res) => {
    if(req.session.email)
     res.render('index');
     else
     res.render('login')
});

router.get('/search', (req, res) => {
    res.render('search');
})

router.get('/trips', (req, res) => {
    console.log(req.body);
    console.log(req.user);
    const{id} = req.body;
    let query = "SELECT * FROM Trips WHERE userId = id";
    db.query(query, (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results);
            res.render('trips', {
                results
            });
        }
    })
})


module.exports = router;