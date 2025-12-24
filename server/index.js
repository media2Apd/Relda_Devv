const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const path = require('path');
require('source-map-support').install();
require('./controller/scheduler/dailyReportScheduler')

const getClientIp = require('./middleware/getClientIp'); // Define this in a middleware file if not done already
// Assuming a User model for storing user details
const guestSession = require("./middleware/guestSession");

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001","http://192.168.31.36:3000"],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(getClientIp); // This should be applied before the routes
app.use(guestSession);

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use("/api", router);

app.use("/api", router);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT,'0.0.0.0', () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});
