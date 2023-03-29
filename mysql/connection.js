const mysql = require("mysql2");

const connection = mysql.createConnection({
	// database: "ticket-system",
	// user: "root",
	// password: "root",
	// host: "localhost",
	// port: 8889,
	database: process.env.MYSQLDATABASE,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPASSWORD,
	host: process.env.MYSQLHOST,
	port: process.env.MYSQLPORT,
});

connection.connect();

function asyncMySQL(query, params) {
	return new Promise((resolve, reject) => {
		connection.query(query, params, (error, results) => {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
}

module.exports = asyncMySQL;
