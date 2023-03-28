const express = require("express");
const { getTicketNotes, createNote } = require("../controllers/noteController");
const app = express.Router({ mergeParams: true });
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

app.get("/:id/notes", authenticate, getTicketNotes);
app.post("/:id/notes", authenticate, createNote);

module.exports = app;
