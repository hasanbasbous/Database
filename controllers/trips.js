const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
})

exports.display = (req, res) => {
    console.log(req.body);
    console.log('Hasan')
    const{id} = req.body;
    let query = "SELECT * FROM Trips WHERE userId = id";
    db.query(query, (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results);
            res.render('trips', {
                results
            });
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