const express = require("express");
const app = express.Router();
const {
	getUserTickets,
	createTicket,
	getUserTicket,
	deleteTicket,
	closeTicket,
} = require("../controllers/ticketController");
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

const noteRoute = require("./notes");
app.use("/", noteRoute);

app.get("/:id", authenticate, getUserTicket);
app.get("/", authenticate, getUserTickets);
app.post("/", authenticate, createTicket);
app.delete("/:id", authenticate, deleteTicket);
app.patch("/:id", authenticate, closeTicket);

module.exports = app;
