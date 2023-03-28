const express = require("express");
const cors = require("cors");
const colors = require("colors");
const PORT = process.env.PORT || 8001;
const asyncMySQL = require("./mysql/connection");
const sqlQueries = require("./mysql/queriesUser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("Hello there");
});

app.use((req, res, next) => {
	req.asyncMySQL = asyncMySQL;
	next();
});

app.use("/api/users", require("./routes/user"));
app.use("/api/tickets", require("./routes/tickets"));

app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
});
