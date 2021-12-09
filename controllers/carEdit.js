const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { car } = require("./car");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    model: '',
    database: process.env.DATABASE
})

exports.carEdit = (req, res) => {
    console.log(req.body);
    const { plateNum } = req.body
    console.log(plateNum)
    db.query("SELECT * FROM car WHERE plateNumber = ?", [plateNum], async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            var r = JSON.parse(JSON.stringify(results))
            console.log(">> r: ", r)
            console.log(">> Car Color: ", r[0].carColor)
            res.render('carEdit', { plateNum: r[0].plateNumber, carBrand: r[0].carBrand, year: r[0].year, carColor: r[0].carColor, status: r[0].status })
        }
    });
    // res.json("Form submitted");
}

exports.carEdit2 = (req, res) => {
    const { plateNum, carBrand, year, carColor, status } = req.body
    var currentYear = (new Date()).getFullYear();
    var message = "";
    if (year.length == 0) {
        message = 'Car Year can not be empty'
        return res.render('carEdit', {
            message: message, plateNum, carBrand, year, carColor, status
        });
    } else if ((year < 1950) | (year > currentYear)) {
        message = 'Car Year is not in range of 1950 and ' + currentYear
        return res.render('carEdit', {
            message: message, plateNum, carBrand, year, carColor, status
        })

    }

    if(status == 'on') {
        var set = 1;
    } else {
        set = 0;
    }
    db.query("UPDATE car SET status=" + set + ", carBrand='" + carBrand + "', year=" + year + ", carColor='" + carColor +
        "' WHERE userId =" + req.session.userId + " AND plateNumber='" + plateNum + "'", (error, results) => {
            if (error) {
                console.log(error)
            } else {
                console.log(">>Car update: ", results)
                console.log(">>Status:", status)
                if (status == 'on') {
                    db.query("Update car SET status = 0 WHERE userId =" + req.session.userId + " AND plateNumber !='" + plateNum + "'", (error, results => {
                        res.redirect("/")
                    }))
                } else {
                    console.log("UPDATE car SET carBrand='" + carBrand + "', year=" + year + ", carColor='" + carColor +
                        "' WHERE userId =" + req.session.userId + " AND plateNumber='" + plateNum + "'")
                    res.redirect("/")
                }
            }
        })
    }