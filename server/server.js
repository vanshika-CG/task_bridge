const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const  dotenv = require("dotenv"); 
       dotenv.config();
const port = 4400;



// MongoDB connection details
const uri = process.env.URI; // access uri from .env
const dbName = "taskbridge";

// Middleware
app.use(express.json());
app.use(cors());
let db, team;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        team = db.collection("team");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); 
    }
}

// Initialize Database
initializeDatabase();

// ROUTES

// team - collection

// GET  /team/:team_code:  get all members of team
app.get('/team/:team_code', async (req, res) => {
    try {
        const team_code = req.params.team_code;
        const result = await team.find({ team_code }).toArray();; // Assuming `userId` is a field in the document
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user" });
    }
});


// POST  /team/new_user - add new member
app.post('/team/new_user', async (req, res) => {
    try {
        
        const { team_code, full_name,title,  email, role , active, password } = req.body;

        const newUser  = {
            team_code,
            full_name,
            title,  
            email, 
            role , 
            active, 
            password
        };

        const result = await team.insertOne(newUser );
        res.status(201).send(`User  added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});


// PATCH /team/user/:full_name/edit - to edit a member with full_name
app.patch('/team/user/:full_name/edit', async (req, res) => {
    try {
        const full_name = (req.params);
        const updates = req.body;
        const result = await team.updateOne( full_name , { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});



//DELETE /team/user/:full_name/:team_code/delete - delete member
app.delete('/team/user/:full_name/:team_code/delete', async (req, res) => {
    try {
        const full_name = (req.params.full_name);
        const result = await team.deleteOne({full_name});
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});

