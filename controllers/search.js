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
    console.log(req.body);
    const {src, dst, date} = req.body;
    console.log(src)
    let query = "SELECT * FROM Trips WHERE source= '" + src + "' AND destination = '"+ dst + "' AND date='" + date + "'";
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