const session = require("express-session");
const mysql = require("mysql");
const express = require("express");

app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

exports.display = (req, res) => {
    console.log(req.body);
    console.log(req.tripId);
    console.log(req.session.userId)

    // let query = "SELECT * FROM Trips WHERE userId = '" + req.session.userId + "'";
    // const {tripId} = req.body;
    db.query("UPDATE users SET ? WHERE Id= '" + req.session.userId + "'",{tripId: 8}, (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results);
            res.redirect('/trips');
        }
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