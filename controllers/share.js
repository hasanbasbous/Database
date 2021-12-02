const mysql = require("mysql");
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

exports.share = (req, res) => {
    console.log(req.body);
    const {from, to, date, time, length, spots} = req.body;
    
    db.query("INSERT INTO trips SET ?", {source: from, destination: to, date: date, time: time, length: length, nbSeats: spots, driverId: req.session.userId,
    role: 'driver'}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.redirect('/trips');
            }
        })
    }