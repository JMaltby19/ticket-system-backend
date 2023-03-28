const express = require("express");
const app = express.Router();
const sqlQueries = require("../mysql/queriesNotes");
const asyncMySQL = require("../mysql/connection");

const getTicketNotes = app.get("/:id/notes", async (req, res) => {
	const result = await req.asyncMySQL(sqlQueries.selectNotes(), [
		req.params.id,
		req.user_id,
	]);

	if (result.length) {
		res.send({ status: 1, payload: result });
	} else {
		res.send({ status: 0, error: "Note not available" });
	}
});

const createNote = app.post("/:id/notes", async (req, res) => {
	const { note } = req.body;

	const results = await req.asyncMySQL(sqlQueries.insertNote(), [
		req.params.id,
		req.user_id,
		note,
	]);

	console.log(results);

	res.send({ payload: results });
});

module.exports = { getTicketNotes, createNote };
