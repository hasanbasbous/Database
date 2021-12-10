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
        db.query('Select * FROM user WHERE email = ?', [req.session.email], async(error, results) => {
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
                console.log(">> USER ID: "+req.session.userId);
                db.query('Select * From car WHERE userId = ' + [req.session.userId]+ " ORDER BY status DESC, year DESC", (error, resultsTwo) => {
                    if(error)
                        console.log(error);
                    else {
                        console.log(">> results two: ", JSON.parse(JSON.stringify(resultsTwo)))
                        res.render('index', {resultsTwo, fname: req.session.list[0].fname, lname: req.session.list[0].lname, 
                            email: req.session.list[0].email, password: req.session.list[0].password,
                            phoneNumber: req.session.list[0].phoneNumber, driversLicenseId: req.session.list[0].license, gender: req.session.list[0].gender.toUpperCase()});
                    }
                })
                

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
        res.render('userEdit', {
            fname: req.session.list[0].fname, 
            lname: req.session.list[0].lname, 
            email: req.session.list[0].email,
            password: req.session.list[0].password,
            phoneNumber: req.session.list[0].phoneNumber, 
            driversLicenseId: req.session.list[0].license, 
            statusM: statusM, 
            statusF: statusF
        });
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

router.get('/feedback', (req, res) => {
    if(req.session.loggedin)
     res.render('feedback');
    else 
     res.redirect('/login');
})


router.get('/trips', (req, res) => {
    if(req.session.loggedin) {
     console.log(req.session.userId);
     console.log(req.session.list[0].fname);
     const{id} = req.body;
     let query = "SELECT * FROM trip WHERE driverId='" + req.session.userId + "'";
     db.query(query, (error, resultsOne) => {
        if(error){
            console.log(error);
        }else {
            console.log(resultsOne);
            let query2 = "SELECT source,destination,time, date,S.id AS stID,T.id AS trID, B.estTime, B.stop AS riderLoc FROM seat S, booking B, trip T WHERE S.id = B.seatID AND T.id=S.rideID AND date>=CURRENT_DATE AND B.userID='"+req.session.userId+"' ORDER BY trID";
            db.query(query2, (error, resultsTwo) => {
                if(error){
                    console.log(error);
                }else {
                    console.log(">> Number" + resultsTwo);
                    res.render('trips', {
                        resultsTwo,resultsOne
                    });
                }
            })
        }
    })
    }
    else 
        res.render('login')
 })

 router.get('/carEdit', (req, res) => {
    if(req.session.loggedin)
        res.render('carEdit');
    else
        res.render('login');
});


module.exports = router;