const express = require("express");
const app = express.Router();
const sqlQueries = require("../mysql/queriesTickets");
const sha256 = require("sha256");
const utils = require("../utils");
const asyncMySQL = require("../mysql/connection");

const getUserTickets = app.get("/", async (req, res) => {
	const result = await req.asyncMySQL(sqlQueries.selectTickets(), [
		req.user_id,
	]);

	if (result.length) {
		res.send({ status: 1, payload: result });
	} else {
		res.send({ status: 0, error: "user not authorised" });
	}
});

const getUserTicket = app.get("/:id", async (req, res) => {
	const result = await req.asyncMySQL(sqlQueries.selectTicket(), [
		req.params.id,
		req.user_id,
	]);

	if (result.length) {
		res.status(200).json({ payload: result });
	} else {
		res.status(401).json({ error: "ticket does not exist" });
	}

	// console.log(result.length, req.params, req.user_id);
});

const createTicket = app.post("/", async (req, res) => {
	const { product, description } = req.body;

	// const results = await req.asyncMySQL(
	// 	sqlQueries.selectUserIdForTickets(user_id)
	// );
	if (!product || !description) {
		res.send({ status: 0, message: "Please include product and description" });
	} else {
		const results = await req.asyncMySQL(sqlQueries.insertTicket(), [
			req.user_id,
			product,
			description,
		]);

		res.send({ payload: results });
	}
});

const deleteTicket = app.delete("/:id", async (req, res) => {
	await req.asyncMySQL(sqlQueries.deleteTicket(), [req.params.id, req.user_id]);

	res.send({ status: 1 });
});

const closeTicket = app.patch("/:id", async (req, res) => {
	await req.asyncMySQL(sqlQueries.updateTicket(), [req.params.id, req.user_id]);

	res.send({ status: 1 });
	// console.log({ payload: result });
});

module.exports = {
	getUserTickets,
	getUserTicket,
	createTicket,
	deleteTicket,
	closeTicket,
};
