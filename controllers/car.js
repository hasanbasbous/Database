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

    const { plateNum, email,  model, modelConfirm, phoneNumber, driversLicenseId, gender} = req.body;

    db.query("SELECT plateNum FROM car WHERE plateNumber = ?", [plateNum], async (error, results) => {
        if(error){
            console.log(error);
        }
        const namePattern = /^[A-Za-z]+$/;
        const licensePattern = /^[0-9]{9}$/;
        const platePattern = /^[A|B|G|K|M|N|O|S|T|Y|Z][0-9]{3,7}$/;

        if(plateNum.length == 0){
            return res.render('car', {
                message: 'First name can not be blank'
            });
        } else if(!platePattern.test(plateNum)){
            return res.render('car', {
                message: 'Plate Number has an invalid form'
            });
        } else if(results.length > 0){
            return res.render('car', {
                message: 'That plate number is already in use'
            });
        } else if(model){
            return res.render('car', {
                message: 'Email has an invalid form'
            });
        } else if(model.length == 0){
            return res.render('car', {
                message: 'model can not be blank'
            });
        }
        else if(model !== modelConfirm){
            return res.render('car', {
                message: 'models do not match'
            });
        } else if(!phonePattern.test(phoneNumber)){
            return res.render('car', {
                message: 'Phone number should be 8 digtis'
            });
        }
        else if (driversLicenseId.length !== 0){
            if(!licensePattern.test(driversLicenseId)){
                return res.render('car', {
                    message: 'License should be nine digits'
                });
            }
            
        } else if (gender !== 'male' && gender !== 'female'){
            return res.render('car', {
                message: 'You must choose a gender'
            });
        }
        
        // let hashedmodel = await bcrypt.hash(model, 8);
        // console.log(hashedmodel);

        db.query('INSERT INTO users SET ?', {plateNum: plateNum, lname: lname, Email: email, model: model, phoneNumber: phoneNumber, license: driversLicenseId, 
        gender: gender}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.redirect('/car', {
                });
            }
        })
    });



    // res.json("Form submitted");
}