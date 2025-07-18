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

let openedSessions = []; // Object structure: { ip: "192.0.0.0", username: "alice", email: "alice@example.com"}

app.post("/register", async (req, res) => {
    const ip = req.ip
    const { username, email, password } = req.body; // unpacking
    if (!username || !email || !password) {
        return res.status(400).send("Bad request: empty username, email or password");
    }

    if (username.length < 3 || username.length > 32) {
        return res.status(400).send("Username length should be between 4 and 31 symbols including both");
    }

    if (password.length < 8 || password.length > 32) {
        return res.status(400).send("Password length should be between 7 and 31 symbols including both");
    }
    // Email: simple check
    if (
        email.length < 6 ||
        email.length > 64 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.indexOf("@") === 0 ||
        email.lastIndexOf(".") < email.indexOf("@")
    ) {
        // Invalid email
        return res.status(400).send("Email must be valid");
    }
    try {
        // Check if user exists
        const existingUser = await connection.query(
            `SELECT * FROM users WHERE username = $1 AND email = $2`,
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).send("User already exists");
        }
        // Create user
        await connection.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
            [username, email, password]
        );

        console.log(`New user ${username}, ${email} has been successfully created!`);
        // Open session
        openSession(ip, username, email);
        return res.status(201).send("User created");

    } catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
});


app.post("/login", async (req, res) => {
    const ip = req.ip
    const { username, email, password } = req.body; // Unpacking
    if (!username || !email || !password) {
        return res.status(400).send("Bad request: empty username, email or password");
    }

    if (username.length < 3 || username.length > 32) {
        return res.status(400).send("Username length should be between 4 and 31 symbols including both");
    }

    if (password.length < 8 || password.length > 32) {
        return res.status(400).send("Password length should be between 7 and 31 symbols including both");
    }
    // Email: simple check
    if (
        email.length < 6 ||
        email.length > 64 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.indexOf("@") === 0 ||
        email.lastIndexOf(".") < email.indexOf("@") // There must be "." after "@" sign
    ) {
        // Invalid email
        return res.status(400).send("Email must be valid");
    }
    try {
        // Check if user exists
        const existingUser = await connection.query(
            `SELECT * FROM users WHERE username = $1 AND email = $2`,
            [username, email]
        );
        // User exists
        if (existingUser.rowCount === 1) {
            // Check if passwords match
            if (existingUser.rows[0].password === password) {
                // Open session
                openSession(ip, username, email);
                return res.status(200).send("User logined");
            }
            // Passwords doesn't match
            else {
                return res.status(401).send("Passwords doesn't match!")
            }

        }
        // User doesn't exist
        else {
            return res.status(404).send("Such account doesn't exist!")
        }

    } catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
})

app.get("/session", async (req, res) => {
    const ip = req.ip;

    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            console.log(`User ip ${ip}, saved ip ${user.ip}`);
            return res.status(200).json({ username: user.username, email: user.email });
        }
    }
    // User is not found
    return res.status(204).send("Such account doesn't exist.");
});


function openSession(ip, username, email) {
    openedSessions.push({ ip: ip, username: username, email: email })
    console.log(`New session ${username}, ${email} from ${ip} has been succesfully opened!`)
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
