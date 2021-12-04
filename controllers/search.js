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
    console.log(req.session.list[0].email);
    const {src, dst, date, time} = req.body;
    let query;
    if(date.length === 0)
        
        query = "SELECT * FROM trip WHERE source= '" + src + "' AND destination = '"+ dst + "' AND driverId != '" + req.session.userId + "'";
    else 
        query = "SELECT * FROM trip WHERE source= '" + src + "' AND destination = '"+ dst + "' AND date='" + date + "'";
    // console.log(typeof(from))
    // console.log(to)

    // const source = src;
    
    db.query(query, (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results);
            if(results.length > 0)
                return res.render('search', {
                    results
            });
            else
                return res.render('search', {
                    message: "No trips found"
                })
        
        }
    })
}