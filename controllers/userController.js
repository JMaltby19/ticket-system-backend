const express = require("express");
const app = express.Router();
const sqlQueries = require("../mysql/queriesUser");
const sha256 = require("sha256");
const utils = require("../utils");
const asyncMySQL = require("../mysql/connection");

const registerUser = app.post("/", async (req, res) => {
	const { email, user_name, password } = req.body;

	const results = await req.asyncMySQL(sqlQueries.selectUserCount(), [email]);

	console.log(results);

	const { count } = results[0];

	if (count) {
		res.status(400).json({ message: "user already exists" });
	} else {
		const result = await req.asyncMySQL(sqlQueries.insertUser(), [
			email,
			user_name,
		]);
		console.log(result);

		// hashed password
		const hashedPassword = sha256(process.env.PASSWORD_SALT + password);

		await req.asyncMySQL(sqlQueries.insertUserPassword(), [
			result.insertId,
			hashedPassword,
		]);

		const results = await req.asyncMySQL(
			sqlQueries.selectUserIdFromEmailPassword(),
			[email, hashedPassword]
		);

		const token = utils.getUniqueId(64);

		await req.asyncMySQL(sqlQueries.insertNewtoken(), [
			results[0].user_id,
			token,
		]);

		res.send({ status: 1, payload: { email, user_name }, token });
	}
});

const loginUser = app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const hashedPassword = sha256(process.env.PASSWORD_SALT + password);

	const result = await req.asyncMySQL(
		sqlQueries.selectUserIdFromEmailPassword(),
		[email, hashedPassword]
	);

	if (result.length === 0) {
		res.status(400).json({ message: "Incorrect login details" });
	} else {
		const token = utils.getUniqueId(64);

		await req.asyncMySQL(sqlQueries.insertNewtoken(), [
			result[0].user_id,
			token,
		]);

		const loginProfile = await req.asyncMySQL(sqlQueries.selectUserProfile(), [
			result[0].user_id,
		]);

		res.send({ status: 1, token, payload: loginProfile });
	}
});

const getUser = app.get("/me", async (req, res) => {
	const result = await req.asyncMySQL(sqlQueries.selectUserProfile(), [
		req.user_id,
	]);

	if (result.length) {
		res.send({ status: 1, payload: result });
	} else {
		res.send({ status: 0, error: "user does not exist" });
	}
});

const logoutUser = app.delete("/", async (req, res) => {
	await req.asyncMySQL(sqlQueries.deleteAllTokens(), [req.user_id]);

	res.send({ status: 1 });
});

module.exports = { registerUser, loginUser, getUser, logoutUser };
