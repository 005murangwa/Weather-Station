const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('weather.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database');
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature TEXT,
    humidity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(bodyParser.json());
app.use(express.static("public"));

// Handle incoming MQTT messages
const mqttClient = mqtt.connect('ws://157.173.101.159:9001');

mqttClient.on('connect', () => {
    console.log("Connected to MQTT via WebSockets");
    mqttClient.subscribe("/work_group_01/room_temp/temperature");
    mqttClient.subscribe("/work_group_01/room_temp/humidity");
});

let temperature = null;
let humidity = null;

mqttClient.on('message', (topic, message) => {
    const value = message.toString();
    console.log(`Received: ${topic} → ${value}`);
    
    if (topic === "/work_group_01/room_temp/temperature") {
        temperature = value;
    } else if (topic === "/work_group_01/room_temp/humidity") {
        humidity = value;
    }
    
    if (temperature !== null && humidity !== null) {
        db.run(`INSERT INTO weather (temperature, humidity) VALUES (?, ?)`, [temperature, humidity], (err) => {
            if (err) console.error(err.message);
            else console.log("Data inserted into SQLite");
        });
        temperature = null;
        humidity = null;
    }
});

// API endpoint to fetch stored data
app.get("/data", (req, res) => {
    db.all("SELECT * FROM weather WHERE timestamp >= datetime('now', '-1 hour') ORDER BY timestamp ASC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
