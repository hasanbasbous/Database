// const session = require("express-session");
const mysql = require("mysql");
const express = require("express");
const e = require("express");

// app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    multipleStatements: true,
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
    var reservedSeat;

    db.query("SELECT id FROM seat WHERE status = 'available' AND rideID = '" + req.body.tripId + "'  LIMIT 1" ,(error, results) => {
        if(error){
            console.log(error);
            return res.render('trips', {
                message: 'Trip not Booked' // shouldn't be trip booked
            });
        } else {
            var q =JSON.parse(JSON.stringify(results))
            console.log(q)
            reservedSeat = q[0].id;
            console.log(tripId);
            console.log("Results: "+results)
            console.log("Reserved Seat Results: "+reservedSeat)
           // res.redirect('/trips')
            db.query("UPDATE seat SET status = 'reserved' WHERE id = '"+ reservedSeat + "'" ,(error, results) => {
                if(error){
                    console.log(error);
                    return res.render('trips', {
                        message: 'Trip not Booked'
                    });
                } else {
                    console.log("Results: "+results)
                    console.log("Reserved Seat Results: "+reservedSeat)
                    //res.redirect('/trips')

                  
                    //double query to get the stopIds
                    var trip_src; 
                    var direction;
                    db.query("SELECT source, direction FROM trip WHERE id = '" + req.body.tripId + "'", (error, results) => {
                        if(error)
                            console.log(error)
                        q = JSON.parse(JSON.stringify(results))
                        trip_src = q[0].source
                        direction = q[0].direction
                        console.log("trip source requested: " + trip_src)
                    
                    var estTime;
                    
                    db.query("SELECT stopID FROM STOP WHERE address = '" + trip_src + "'; SELECT stopID FROM STOP WHERE address = '" + req.session.src + "'", (error, results) => {
                        if(error) 
                            console.log(error)
                        else {
                            console.log("results for stopID retreival" + results)
                            q =JSON.parse(JSON.stringify(results))
                            var src_stopID_driver = q[0][0].stopID
                            var src_stopID_rider = q[1][0].stopID
                            
                            if(src_stopID_driver != src_stopID_rider)
                            {
                                if(direction == 1){
                                    db.query("SELECT SUM(estTime0) AS estTime FROM STOP WHERE stopID > '" + src_stopID_driver +"' AND stopID <= '" + 
                                        src_stopID_rider + "'", (error, results) => {
                                            if(error)
                                                console.log(error)
                                            q = JSON.parse(JSON.stringify(results))
                                            estTime = q[0].estTime
                                            console.log(estTime)
                                            db.query("INSERT INTO booking SET ?",{userID: req.session.userId, estTime: estTime, stop: req.session.src, seatID:reservedSeat }, (error, results) => {
                                                if(error){
                                                    console.log("userId " + userId)
                                                    console.log(error);
                                                } else {
                                                    console.log(results);
                                                    res.redirect('/trips');
                                                }
                                                })
                                        })
                                } else {
                                    db.query("SELECT SUM(estTime1) AS estTime FROM STOP WHERE stopID < '" + src_stopID_driver +"' AND stopID >= '" + 
                                        src_stopID_rider + "'", (error, results) => {
                                            if(error)
                                                console.log(error)
                                            q = JSON.parse(JSON.stringify(results))
                                            estTime = q[0].estTime
                                            console.log(estTime)
                                            db.query("INSERT INTO booking SET ?",{userID: req.session.userId, estTime: estTime, stop: req.session.src, seatID:reservedSeat }, (error, results) => {
                                                if(error){
                                                    console.log("userId " + userId)
                                                    console.log(error);
                                                } else {
                                                    console.log(results);
                                                    res.redirect('/trips');
                                                }
                                                })
                                        })
                                }
                             } else {
                                db.query("INSERT INTO booking SET ?",{userID: req.session.userId, estTime: 2, stop: req.session.src, seatID:reservedSeat }, (error, results) => {
                                    if(error){
                                        console.log("userId " + userId)
                                        console.log(error);
                                    } else {
                                        console.log(results);
                                        res.redirect('/trips');
                                    }
                                    })
                             }
                           
                            
                        }
                    })
                })
                    
                }
            })
            
         }
    })


    // db.query("SELECT * FROM requests WHERE userId = ? AND tripID = ?", [req.session.userId, req.body.tripId], (error, results) => {
    //     if(error){
    //         console.log(error);
    //     }
         
    //     if(results.length > 0){
    //         return res.render('search', {
    //             message: 'Trip already booked'
    //         });
    //     }
        // else {

    // let query = "SELECT * FROM Trips WHERE userId = '" + req.session.userId + "'";
    // const {tripId} = req.body;
    // const {tripId, source, destination} = req.body;
    //console.log("userId " + userId)

    // db.query("INSERT INTO requests SET ?",{userId: req.session.userId, tripId: req.body.tripId}, (error, results) => {
    //     if(error){
    //         console.log("userId " + userId)
    //         console.log(error);
    //     } else {
    //         console.log(results);
    //         res.redirect('/trips');
    //     }
    // })
    //}
// })
}

exports.bookingcancel = (req,res) => {
    console.log("hello")
    const cancelled = req.body.cancel;
    console.log("cancelled: "+cancelled)
    db.query("UPDATE seat SET status = 'available' WHERE id = '"+cancelled+"'" ,(error, results) => {
        if(error){
            console.log(error);
            return res.render('/trips', {
                message: 'Trip not Cancelled'
            });
        }else {
            db.query("DELETE FROM booking WHERE seatID = '"+cancelled+"'",(error, results) => {
                if(error){
                    console.log(error);
                    return res.render('/trips', {
                    message: 'Trip not Cancelled'
                });
                }else{
                    console.log(results);
                    res.redirect('/trips');
                }
            }) 
        }
    })    
}

exports.tripcancel = (req,res) => {
    const cancelledtrip = req.body.cancel;
    console.log(cancelledtrip)
    db.query("DELETE FROM trip WHERE id = '"+cancelledtrip+"'",(error,results) => {
        if(error){
            console.log(error)
        }
        else{
            console.log(results)
            res.redirect('/trips')
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