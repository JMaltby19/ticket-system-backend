const express = require("express");
const app = express.Router();
const {
	registerUser,
	loginUser,
	getUser,
	logoutUser,
} = require("../controllers/userController");
const asyncMySQL = require("../mysql/connection");
const sqlQueries = require("../mysql/queriesUser");

// check that the token exists for that particular user
async function authenticate(req, res, next) {
	const { token } = req.headers;

	const results = await asyncMySQL(sqlQueries.selectIdFromToken(token));

	if (results.length === 0) {
		res.send({ status: 0, error: "Wrong token!" });
	} else {
		req.user_id = results[0].user_id;
		next();
	}
}

app.post("/", registerUser);
app.post("/login", loginUser);
app.get("/me", authenticate, getUser);
app.delete("/logout", authenticate, logoutUser);

module.exports = app;
