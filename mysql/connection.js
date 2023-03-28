const mysql = require("mysql");

const connection = mysql.createConnection({
	database: "ticket-system",
	user: "root",
	password: "root",
	host: "localhost",
	port: 8889,
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
