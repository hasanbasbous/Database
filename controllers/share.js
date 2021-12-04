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
    var  tripId;
    var  s, d;
    
    db.query("INSERT INTO trip SET ?", {source: from, destination: to, date: date, time: time, length: length, nbSeats: spots, driverId: req.session.userId}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                tripId = results.insertId;
                console.log(tripId);

                for(let x = spots; x > 0; x--){
                    db.query ( "INSERT INTO seat SET ?", {status: 'available' ,rideID: tripId},  
                        (error, results) => {
                            if(error){
                                console.log(error);
                            } else {
                                console.log(results);
                            };
                        })
                    }
                
                db.query('SELECT stopID FROM stop WHERE address =  "'+ from + '"' ,(error, results) =>  {
                    if(error){
                        console.log(error);
                    } else {
                        var q =JSON.parse(JSON.stringify(results))
                        console.log(q)
                        s = q[0].stopID;
                        // s = parseInt(q[0].stopID, 10)
                        console.log(s)
                    }			    
                });
                db.query('SELECT stopID FROM stop WHERE address = "' + to + '"' ,(error, results) =>  {
                    if(error){
                        console.log(error);
                    } else {
                        var q =JSON.parse(JSON.stringify(results))
                        console.log(q)
                        d = q[0].stopID;
                        // d = parseInt(q[0].stopID, 10)
                        console.log(typeof(d))

                        // if(d > s)
                        //     console.log("entered condition")
                //         if(d > s)
                //             console.log("entered condition")
                // console.log('entered')

                        if (s > d){
                            while(s >= d){
                                console.log('entered')
                                db.query ( "INSERT INTO passingthrough SET ?", {stopID: s ,rideID: tripId},  
                                (error, results) => {
                                    if(error){
                                        console.log(error);
                                    } else {
                                        console.log(results);
                                    };
                                })
                                s--;
                            }
                        }    
                        else if(s<d){   
                            while(s<=d){
                                console.log('entered')
                                db.query ( "INSERT INTO passingthrough SET ?", {stopID: s ,rideID: tripId},  
                                (error, results) => {
                                    if(error){
                                        console.log(error);
                                    } else {
                                        console.log(results);
                                    };
                                })
                                s++;
                        }
                        }
                    }			    
                });
                
                res.redirect('/trips')
             }
        })
    }