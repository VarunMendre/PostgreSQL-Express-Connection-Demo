import express from "express";
import { pool } from "./db.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("PostgreSQL + Express API is running");
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("Select * from users");
        res.json(result.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Express Server Started Listening on 5000");
})