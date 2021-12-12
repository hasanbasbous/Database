const mysql = require('mysql');

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: '',
	multipleStatements: true,
	database: process.env.DATABASE,
});

exports.share = (req, res) => {
	console.log(req.body);
	const { from, to, date, time, length, spots } = req.body;
	var tripId;
	var s, d;

	db.query(
		"SELECT * FROM car WHERE userId = '" +
			req.session.userId +
			"'; SELECT * FROM user WHERE id = '" +
			req.session.userId +
			"'",
		(error, results) => {
			if (error) {
				console.log(error);
            } else if (results[0].length > 0 && results[1].length > 0) {
				db.query(
					'INSERT INTO trip SET ?',
					{
						source: from,
						destination: to,
						date: date,
						time: time,
						length: length,
						nbSeats: spots,
						driverId: req.session.userId,
					},
					(error, results) => {
						if (error) {
							console.log(error);
						} else {
							tripId = results.insertId;
							console.log(tripId);

							for (let x = spots; x > 0; x--) {
								db.query(
									'INSERT INTO seat SET ?',
									{ status: 'available', rideID: tripId },
									(error, results) => {
										if (error) {
											console.log(error);
										} else {
											console.log(results);
										}
									}
								);
							}

							db.query(
								'SELECT stopID FROM stop WHERE address =  "' + from + '"',
								(error, results) => {
									if (error) {
										console.log(error);
									} else {
										var q = JSON.parse(JSON.stringify(results));
										console.log(q);
										s = q[0].stopID;
										// s = parseInt(q[0].stopID, 10)
										console.log(s);
									}
								}
							);
							db.query(
								'SELECT stopID FROM stop WHERE address = "' + to + '"',
								(error, results) => {
									if (error) {
										console.log(error);
									} else {
										var q = JSON.parse(JSON.stringify(results));
										console.log(q);
										d = q[0].stopID;
										// d = parseInt(q[0].stopID, 10)
										console.log(typeof d);

										// if(d > s)
										//     console.log("entered condition")
										//         if(d > s)
										//             console.log("entered condition")
										// console.log('entered')

										if (s > d) {
											while (s >= d) {
												console.log('entered');
												db.query(
													"INSERT INTO passingthrough SET ?; UPDATE trip SET direction = 0 WHERE id = '" +
														tripId +
														"'",
													{ stopID: s, rideID: tripId },
													(error, results) => {
														if (error) {
															console.log(error);
														} else {
															console.log(results);
														}
													}
												);
												s--;
											}
										} else if (s < d) {
											while (s <= d) {
												console.log('entered');
												db.query(
													'INSERT INTO passingthrough SET ?; UPDATE trip SET direction = 1 WHERE id = ?',
													[{ stopID: s, rideID: tripId }, tripId],
													(error, results) => {
														if (error) {
															console.log(error);
														} else {
															console.log(results);
														}
													}
												);
												s++;
											}
										}
									}
								}
							);

							res.redirect('/trips');
						}
					}
				);
			} else {
				res.render('share', {
					message: "You can't create a trip without having a car and license",
				});
			}
		}
	);
};
