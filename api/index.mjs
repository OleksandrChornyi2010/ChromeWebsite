import express from "express";
import cors from "cors";
import { Client } from "pg";
import bodyParser from "body-parser";
import morgan from "morgan";

const connection = new Client({
    user: "Your PostgreSQL username",
    host: "localhost",
    database: "Your database name",
    password: "Your password",
    port: 5432,
});

await connection.connect(); // works only with Node 16+ using ESM or top-level await

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.json());

app.post("/accounts", async (req, res) => {
    const { username, email, password } = req.body; // unpacking
    if (!username || !email || !password) {
        return res.status(400).send("Bad request: empty username, email or password");
    }

    if (username.length < 3 || username.length > 32) {
        return res.status(400).send("Username length should be between 3 and 32");
    }

    if (password.length < 8 || password.length > 32) {
        return res.status(400).send("Password length should be between 8 and 32");
    }
    try {
        const existingUser = await connection.query(
            `SELECT * FROM users WHERE username = $1 AND email = $2`,
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).send("User already exists");
        }

        await connection.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
            [username, email, password]
        );

        console.log(`New user ${username}, ${email} has been successfully created!`);
        return res.status(201).send("User created");

    } catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
