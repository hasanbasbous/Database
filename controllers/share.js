const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const express = require('express');
const session = require('express-session');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})


exports.share = (req, res) => {
    const {from, to, date, time, length, spots} = req.body;
        
        db.query("INSERT INTO trips SET ?", {source: from, destination: to, date: date, time: time, length: length, nbSeats: spots, driverId: req.session.userId,
            role: 'driver'}, async(error, results) => {
                    if(error){
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.redirect('/trips');
                    }
                });
               

        db.query('SELECT MAX(id) AS max FROM trips'  ,async(error, results) =>  {
            if(error){
                console.log(error);
            }
             else {
                console.log(results)
                console.log()
                var w =JSON.parse(JSON.stringify(results))
                var y = parseInt(w[0].max, 10)
                console.log(y)
                for (let x=spots; x>0 ;x--){
                    db.query ( "INSERT INTO seat SET ?", {status: 'available' ,rideID: y},  
                    (error, results) => {
                        if(error){
                            console.log(error);
                        } else {
                            console.log(results);
                        };
                    }
                    )}
            }			    
        });
    }