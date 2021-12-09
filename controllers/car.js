const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    model: '',
    database: process.env.DATABASE
})

exports.car = (req, res) => {
    console.log(req.body);

    const { plateNum, carBrand, year, carColor} = req.body;

    db.query("SELECT plateNumber FROM car WHERE plateNumber = ?", [plateNum], async (error, results) => {
        if(error){
            console.log(error);
        }
        const platePattern = /^[A|B|G|K|M|N|O|S|T|Y|Z][0-9]{3,7}$/;
        var currentYear = (new Date()).getFullYear();
        if(plateNum.length == 0){
            return res.render('car', {
                message: 'Plate Number can not be empty'
            })
        } else if(!platePattern.test(plateNum)){
            return res.render('car', {
                message: 'Plate Number has an invalid form'
            });
        } else if(results.length > 0){
            return res.render('car', {
                message: 'That plate number is already in use'
            });
        } else if(carBrand == 'None'){
            return res.render('car', {
                message: 'Car Brand is not chosen'
            });
        } else if(year.length == 0){
            return res.render('car', {
                message: 'Car Year can not be empty'
            });
        } else if((year < 1950)| (year > currentYear)){
            return res.render('car', {
                message: 'Car Year is not in range of 1950 and ' + currentYear 
            });
        } else if(carColor == 'None'){
            return res.render('car', {
                message: 'Car Color is not chosen'
            });
       }
       
       db.query("UPDATE car SET status = 0 WHERE userId = ?", [req.session.userId],  (error, results) => {
            if(error){
                console.log(error)
            } else {
                console.log(JSON.parse(JSON.stringify(results)))
            }
       })

        // let hashedmodel = await bcrypt.hash(model, 8);
        // console.log(hashedmodel);

        db.query('INSERT INTO car SET ?', {plateNumber: plateNum, carBrand: carBrand, year: year, carColor: carColor, status: 1, userId: req.session.userId}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.redirect('/');
            }
        })
    });



    // res.json("Form submitted");
}