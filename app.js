const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config()
// Import a bunch of middleware

// Initialize Express app
const port = process.env.PORT || 3000;
const app = express();

// Set routers
const apiRouter = require("./routes/api");
const docsRouter = require("./routes/docsRouter");
const homeRouter = require("./routes/indexRouter");

// 
const expressEjsLayouts = require('express-ejs-layouts');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/static', express.static(path.join(__dirname, "public")));

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use("/api/v1/", apiRouter);
app.use("/docs/", docsRouter);
app.use("/", homeRouter);
app.use(expressEjsLayouts);


mongoose.connect(`mongodb+srv://soumitradev:${process.env.MONGO_PSWD}@todoapp.0zonn.gcp.mongodb.net/todo_data?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error connecting to DB: ' + err);
});

db.on('open', () => {
    console.log('Connected to DB');
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
