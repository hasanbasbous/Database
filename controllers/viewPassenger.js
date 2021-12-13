const mysql = require('mysql');

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: '',
	multipleStatements: true,
	database: process.env.DATABASE,
});

exports.displayPassengers = (req, res) => {
    console.log(req.body)
    db.query("SELECT U.*, B.* FROM trip T, seat S, user U, booking B WHERE " +
                    "T.id = S.rideID  AND S.id = B.seatID AND S.status = 'reserved' AND B.userID = U.id AND T.driverId = '"
                     + req.session.userId + "' AND T.id = '" + req.body.view + "'", (error, results) => {
                        if(error)
                            console.log(error)

                        res.render('viewPassengers', {
                           results
                        });
    })
}