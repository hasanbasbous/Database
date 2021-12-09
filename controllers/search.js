const mysql = require("mysql");
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

exports.search = (req, res) => {
    // console.log(req.session.list[0].email);
    const {src, dst, date, time} = req.body;
    
    
    // let query;
    // if(date.length === 0)
        
    //     query = "SELECT * FROM trip WHERE source= '" + src + "' AND destination = '"+ dst + "' AND driverId != '" + req.session.userId + "'";
    // else 
    //     query = "SELECT * FROM trip WHERE source= '" + src + "' AND destination = '"+ dst + "' AND date='" + date + "'AND driverId != '" + req.session.userId + "'";
    // // console.log(typeof(from))
    // // console.log(to)

    // // const source = src;
    
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

    var  s, d,dir;
    let query;
    db.query('SELECT stopID FROM stop WHERE address =  "'+ src + '"' ,(error, results) =>  {
        if(error){
            console.log(error);
        } else {
            var q =JSON.parse(JSON.stringify(results))
            console.log(q)
            s = q[0].stopID;
            s = parseInt(q[0].stopID, 10)
            console.log("source: "+s+ " type of s:" +typeof(s))
        }			    
    });
    db.query('SELECT stopID FROM stop WHERE address = "' + dst + '"' ,(error, results) =>  {
        if(error){
            console.log(error);
        } else {
            var q =JSON.parse(JSON.stringify(results))
            console.log(q)
            d = q[0].stopID;
            // d = parseInt(q[0].stopID, 10)
            console.log("source: "+d+ " type of s:" +typeof(d))

            if(s>d){
                dir=0
                console.log("Entered s > d")
            }else {
                dir=1
                console.log("Entered s < d") 
            }   
        
            if(date.length === 0){
                if(time.length === 0){
                    console.log("query 1")
                    query = "SELECT S.rideID AS id,source, destination, date, time, COUNT(DISTINCT(S.id)) AS NBofSeatsAV FROM trip T, seat S  WHERE S.rideID = T.id AND driverId != '" 
                    + req.session.userId + "'AND S.status = 'available' AND direction = '" 
                    + dir + "' AND T.date >= CURRENT_DATE AND S.rideID IN  (SELECT rideID FROM passingthrough WHERE stopID='" 
                    + d + "' INTERSECT (SELECT rideID FROM passingthrough WHERE stopID='" + s + "')) GROUP BY S.rideID"


                }
                else{
                    console.log("query 2")
                    query = "SELECT S.rideID AS id,source, destination, date, time, COUNT(DISTINCT(S.id)) AS NBofSeatsAV FROM trip T, seat S  WHERE S.rideID = T.id AND driverId != '" 
                    + req.session.userId + "'AND S.status = 'available' AND direction = '" 
                    + dir + "' AND T.date >= CURRENT_DATE AND T.time = '" + time + "' AND S.rideID IN  (SELECT rideID FROM passingthrough WHERE stopID='"
                    + d + "' INTERSECT (SELECT rideID FROM passingthrough WHERE stopID='" + s + "')) GROUP BY S.rideID"
                }
            }
            else{
                if(time.length === 0){
                    console.log("query 3")
                    query = "SELECT S.rideID AS id,source, destination, date, time, COUNT(DISTINCT(S.id)) AS NBofSeatsAV FROM trip T, seat S  WHERE S.rideID = T.id AND driverId != '" 
                    + req.session.userId + "'AND S.status = 'available' AND direction = '" 
                    + dir + "' AND T.date = '" + date +"' AND S.rideID IN  (SELECT rideID FROM passingthrough WHERE stopID='" 
                    + d + "' INTERSECT (SELECT rideID FROM passingthrough WHERE stopID='" + s + "')) GROUP BY S.rideID"
                }
                else{
                    console.log("query 4")
                    query = "SELECT S.rideID AS id,source, destination, date, time, COUNT(DISTINCT(S.id)) AS NBofSeatsAV FROM trip T, seat S  WHERE S.rideID = T.id AND driverId != '" 
                    + req.session.userId + "'AND S.status = 'available' AND direction = '" 
                    + dir + "' AND T.date = '" + date +"' AND T.time = '" + time + "' AND S.rideID IN  (SELECT rideID FROM passingthrough WHERE stopID='" 
                    + d + "' INTERSECT (SELECT rideID FROM passingthrough WHERE stopID='" + s + "')) GROUP BY S.rideID"
                }
            }

            db.query(query, async(error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    if(results.length > 0) {
                        req.session.dst = dst;
                        req.session.src = src;
                        console.log("save dst into session: " + req.session.dst)
                        return res.render('search', {
                            results
                    });}
                    else
                        return res.render('search', {
                            message: "No trips found"
                        })
                
                }
            })

        }    
    });
    
    
}