const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files like index.html

const failedLogins = {};
const BLOCK_TIME = 5 * 60 * 1000;

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many requests. Try again later." }
});

app.post("/login", loginLimiter, (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip;

    if (!failedLogins[ip]) failedLogins[ip] = { count: 0, blockedUntil: null };

    if (failedLogins[ip].blockedUntil && failedLogins[ip].blockedUntil > Date.now()) {
        return res.status(403).json({ message: "You are temporarily blocked due to multiple failed attempts." });
    }

    const isAuthenticated = username === "admin" && password === "password123";

    if (isAuthenticated) {
        failedLogins[ip] = { count: 0, blockedUntil: null };
        return res.json({ message: "Login successful!" });
    }

    failedLogins[ip].count++;
    if (failedLogins[ip].count >= 3) {
        failedLogins[ip].blockedUntil = Date.now() + BLOCK_TIME;
        return res.status(403).json({ message: "Too many failed attempts. You are temporarily blocked." });
    }

    res.status(401).json({ message: `Invalid credentials. Attempt ${failedLogins[ip].count} of 3.` });
});

app.listen(3000, () => console.log("Server running on port 3000"));
