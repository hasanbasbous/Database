
   
const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    model: '',
    database: process.env.DATABASE
})

var tID;
var r, c;

exports.feedback = (req, res) => {
    tID = req.body.feedback;
    console.log("tripID: " + tID)
    res.redirect("/feedback")

}

exports.sendfeedback = (req, res) => {
    r = req.body.rating;
    c = req.body.comment;
    db.query("SELECT * FROM feedback WHERE userID = '" + req.session.userId + "' AND tripID='" + tID + "'", (error, results) => {
        if (error) {
            console.log(error)
        } else {
            if (results.length > 0) {
                res.render('feedback', {
                    message: "Feedback already sent"
                });

            } else {
                db.query("SELECT * FROM trip WHERE id ='" + tID + "' AND DATE = CURRENT_DATE", (error, results) => {
                    if (error) {
                        console.log(error)
                    } else {
                        if (results.length > 0) {
                            db.query("INSERT INTO feedback SET?", {
                                userID: req.session.userId, rating: r, comments: c,
                                tripID: tID
                            }, (error, results) => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log(results)
                                    res.redirect("/trips")
                                }

                            });
                        } else {
                            res.render('feedback', {
                                message: "Trip is not today"
                            });
                        }

                    }

                });

            }
        }

    });
}