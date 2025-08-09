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
let openedSessions = []; // Object structure: { ip: "192.0.0.0", username: "alice", email: "alice@example.com", rememberMe: false}
let sessionTimeout = 1 * 60 * 1000 // 10 minutes

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.json());


app.post("/register", async (req, res) => {
    const ip = req.ip
    const { username, email, password, rememberMe } = req.body; // unpacking
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
        openSession(ip, username, email, rememberMe);
        return res.status(201).send("User created");

    } catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
});


app.post("/login", async (req, res) => {
    const ip = req.ip
    const { username, email, password, rememberMe } = req.body; // Unpacking
    // Check session
    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            return res.status(409).send("You are already logged in.");
        }
    }
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
                openSession(ip, username, email, rememberMe);
                return res.status(200).send("User logined");
            }
            // Passwords don't match!
            else {
                return res.status(401).send("Passwords don't match!")
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

app.get("/get-session", async (req, res) => {
    const ip = req.ip;

    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            //console.log(`User ip ${ip}, saved ip ${user.ip}`);
            return res.status(200).json({ username: user.username, email: user.email });
        }
    }
    // User is not found
    return res.status(204).send("No opened session at your ip address.");
});
app.post("/close-session", async (req, res) => {
    const ip = req.ip;
    const email = req.body.email;
    if (closeSession(ip, email)) {
        clearSessionTimer(ip, email)
        res.status(200).send("Your session has been succesfully closed.");
    }
    else {
        res.status(204).send("Your session is already closed!");
    }
});

app.post("/submit-question", async (req, res) => {
    const ip = req.ip
    const { firstName, lastName, language, question } = req.body; // Unpacking
    let userSession
    // Check session
    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            userSession = user;
            break;
        }
    }
    if (!userSession) {
        return res.status(204).send("No opened session at your IP address.");
    }
    // First name: 3-31 characters
    if (firstName.length < 2 || firstName.length > 32) {
        return res.status(400).send("First name must be between 3 and 31 characters including both.")
    }

    // Last name: 9-31 characters
    if (lastName.length < 2 || lastName.length > 32) {
        return res.status(400).send("Last name must be between 3 and 31 characters including both.")
    }
    // Language must be not 0:
    if (language === 0) {
        return res.status(400).send("Select valid language.")
    }
    // Question: 6-350 characters
    if (question.length < 7 || question.length > 351) {
        return res.status(400).send("Question must be between 6 and 350 characters including both.")
    }
    try {
        await connection.query(
            `INSERT INTO questions (username, email, first_name, last_name, language, question) VALUES ($1, $2, $3, $4, $5, $6)`,
            [userSession.username, userSession.email, firstName, lastName, language, question]
        );
    } catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
    return res.status(200).send("Question has been received successfully")
})

app.post("/change-password", async (req, res) => {
    const ip = req.ip;
    const newPassword = req.body.newPassword;
    let userSession;
    // Check session
    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            userSession = user;
            break;
        }
    }
    if (!userSession) {
        return res.status(204).send("No opened session at your IP address.");
    }
    if (!newPassword) {
        return res.status(400).send("Bad request: empty password");
    }
    if (newPassword.length < 8 || newPassword.length > 32) {
        return res.status(400).send("Password length should be between 7 and 31 symbols including both");
    }
    try {
        await connection.query("UPDATE users SET password = $1 WHERE username = $2 AND email = $3", [newPassword, userSession.username, userSession.email]);
        closeAllSessions(userSession.email);
        clearAllSessionTimers(userSession.email);

    }
    catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
    return res.status(200).send("Your password has been updated.")
})

app.get("/get-all-questions", async (req, res) => {
    const ip = req.ip;
    let userSession;
    // Check session
    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            userSession = user;
            break;
        }
    }
    if (!userSession) {
        return res.status(204).send("No opened session at your IP address.");
    }
    try {
        const result = await connection.query(
            "SELECT * FROM questions WHERE username = $1 AND email = $2",
            [userSession.username, userSession.email]
        );
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
})

app.get("/get-question", async (req, res) => {
    const ip = req.ip;
    const id = req.query.id
    let userSession;
    // Check session
    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            userSession = user;
            break;
        }
    }
    if (!userSession) {
        return res.status(204).send("No opened session at your IP address.");
    }
    try {
        const result = await connection.query(
            "SELECT * FROM questions WHERE id = $1 AND username = $2 AND email = $3",
            [id, userSession.username, userSession.email]
        );
        return res.status(200).json(result.rows);
    }
    catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
})

app.delete("/delete-question", async (req, res) => {
    const ip = req.ip;
    const id = req.query.id;
    let userSession;
    // Check session
    for (const user of openedSessions) {
        if (user.ip === ip) {
            // User found
            userSession = user;
            break;
        }
    }
    if (!userSession) {
        return res.status(204).send("No opened session at your IP address.");
    }
    try {
        const result = await connection.query(
            "DELETE FROM questions WHERE id = $1 AND username = $2 AND email = $3",
            [id, userSession.username, userSession.email]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Question not found");
        }

        return res.status(200).send("Question has been deleted succesfully.")
    }
    catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
})
app.post("/newsletter", async (req, res) => {
    const email = req.body.email;
    try {
        const result = await connection.query(
            "SELECT * FROM newsletter_subscriptions WHERE email = $1",
            [email]
        );
        if (result.rowCount) {
            return res.status(409).send("This email is already subscribed.")
        }
    }
    catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
    try {
        await connection.query(
            `INSERT INTO newsletter_subscriptions (email) VALUES ($1)`,
            [email]
        );
    } catch (err) {
        console.error("Database error:", err.stack);
        return res.status(500).send("Internal server error");
    }
    return res.status(200).send("You have successfully subscribed!")
})

function openSession(ip, username, email, rememberMe) {
    const session = { ip, username, email };

    if (!rememberMe) {
        console.log("Started session timer");
        const timeoutId = setTimeout(() => {
            console.log(`Session timeout for ${ip} and ${email}. Closing session`);
            closeSession(ip, email);
        }, sessionTimeout);

        session.timeoutId = timeoutId;
    }

    openedSessions.push(session);

    console.log(`New session ${username}, ${email} from ${ip} has been successfully opened!`);
}

function closeAllSessions(email) {
    const initialLength = openedSessions.length;
    openedSessions = openedSessions.filter(session => session.email !== email);

    if (openedSessions.length < initialLength) {
        console.log(`All sessions for email ${email} have been successfully closed!`);
        return true;
    } else {
        console.warn(`No active sessions were found for email ${email}.`);
        return false;
    }
}

function closeSession(ip, email) {
    const initialLength = openedSessions.length;
    openedSessions = openedSessions.filter(session => !(session.email === email && session.ip === ip));

    if (openedSessions.length < initialLength) {
        console.log(`A session for email ${email} with IP ${ip} has been successfully closed!`);
        return true;
    } else {
        console.warn(`No active sessions were found for email ${email} with IP ${ip}.`);
        return false;
    }
}

function clearSessionTimer(ip, email) {
    const session = openedSessions.find(s => s.ip === ip && s.email === email);
    if (session && session.timeoutId) {
        clearTimeout(session.timeoutId);
        session.timeoutId = null;
        console.log(`Timeout cleared for session ${email} from ${ip}`);
    }
}


function clearAllSessionTimers(email) {
    openedSessions.forEach(session => {
        if (session.email === email && session.timeoutId) {
            clearTimeout(session.timeoutId);
            session.timeoutId = null;
            console.log(`Timeout cleared for session ${email} from IP ${session.ip}`);
        }
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
