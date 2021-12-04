// const session = require("express-session");
const mysql = require("mysql");
const express = require("express");

// app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));

exports.display = (req, res) => {
    console.log("Trip post")
    console.log(req.body);
    console.log(req.body.tripId);
    console.log(req.session.userId)
    const userId = req.session.userId;
    const tripId = req.session.tripId;

    db.query("SELECT * FROM requests WHERE userId = ? AND tripID = ?", [req.session.userId, req.body.tripId], (error, results) => {
        if(error){
            console.log(error);
        }
         
        if(results.length > 0){
            return res.render('search', {
                message: 'Trip already booked'
            });
        }
        // else {

    // let query = "SELECT * FROM Trips WHERE userId = '" + req.session.userId + "'";
    // const {tripId} = req.body;
    // const {tripId, source, destination} = req.body;
    //console.log("userId " + userId)

    db.query("INSERT INTO requests SET ?",{userId: req.session.userId, tripId: req.body.tripId}, (error, results) => {
        if(error){
            console.log("userId " + userId)
            console.log(error);
        } else {
            console.log(results);
            res.redirect('/trips');
        }
    })
    //}
})
}


// db.query(query, (error, results) => {
//     if(error){   
//         console.log(error);
//     } else {
//         console.log(results);
//         if(results.length > 0)
//             return res.render('search', {
//                 results
//         });
//         else
//             return res.render('search', {
//                 message: "No trips found"
//             })
    
//     }
// })