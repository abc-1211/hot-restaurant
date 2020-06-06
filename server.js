// Set up the ports, the URL passing listener and dependencies

// Dependencies
const express = require("express");
const path = require("path");
const render = require(path.join(__dirname,"htmlRenderer.js"));
const util = require("util");
const fs = require("fs");

// Promisify the writeFile function
const writeFileAsync = util.promisify(fs.writeFile);

// Port and app setup
const app = express();
const PORT = 3000;

const htmlOutputPath = path.join(__dirname, "view.html");


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Routes
// =============================================================

app.get("/", function(req, res) {
    // Display home.html
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/make/", function(req, res) {
    // Display make.html
    console.log("Request being made:");
    console.log(req);
    res.sendFile(path.join(__dirname, "make.html"));
});

app.get("/view/", async function(req, res) {
    try {
        // Generate view.html
        const htmlContent = render(tables.reservedTables, tables.waitingListTables);
    
        // Now write it to a file named `team.html` in the output folder. 
        const htmlFile = await writeFileAsync(htmlOutputPath, htmlContent);
    
        // Display view.html
        res.sendFile(htmlOutputPath);

    } catch (error) {
        console.log(error);
    }
});

// Displays all current reservations
app.get("/api/reservations", function(req, res) {
    return res.json(tables.reservedTables);
});

// Displays all tables on waitlist
app.get("/api/waitlist", function(req, res) {
    return res.json(tables.waitingListTables);
});


// Display error message if the user routes to a URL which isn't handled


// Create New reservation request - takes in JSON input
app.post("/api/tables", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    let newTable = req.body;
    // Remove spaces from newTable.routeName
    newTable.routeName = newTable.name.replace(/\s+/g, "").toLowerCase();


    if (tables.reservedTables.length < 5) {
        tables.reservedTables.push(newTable);
        res.json(newTable);
        
        // Display message saying table was added to reservation
        // "\nAll tables were full. You are now part of the waiting list"
    }
    else {
        tables.waitingListTables.push(newTable);
        res.json(newTable);

        // Display message saying table was added to waiting list
    }

    console.log(tables);

});


// Set up eventlistener to trigger the post request
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});


// Decide on structure of table reservation data
tables = {
    // 
    reservedTables : [],
    waitingListTables : []
}