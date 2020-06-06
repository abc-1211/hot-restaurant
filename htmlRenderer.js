// Require in all necessary modules
const path = require("path");
const fs = require("fs");

// Store templates directory as a variable
const tableTemplateDir = path.resolve(__dirname, "tableTemplate.html");
const viewTemplateDir = path.resolve(__dirname, "viewTemplate.html");

// Render function returns a string of HTML content using the tables
const render = (reservedTables, waitingTables) => {
  // Define an empty HTML array
  const htmlReserved = [];
  const htmlWaiting = [];

  // Filter by manager in tables array, map using the renderManager function and push into HTML array
  htmlReserved.push(reservedTables
    .map(reservedTable => renderTable(reservedTable))
  );
  
  // Filter by manager in tables array, map using the renderManager function and push into HTML array
  htmlWaiting.push(waitingTables
    .map(waitingTable => renderTable(waitingTable))
  );
    
  // Join HTML array elements into a string, feed into renderMain function with teamName and return the value
  renderView(htmlReserved.join(""),htmlWaiting.join(""));

};

// renderManager returns a string of HTML content read from manager.html, replacing placeholders with values
const renderTable = table => {
  // Read in manager.html file and store in template variable
  let template = fs.readFileSync(tableTemplateDir, "utf8");
  // Replace all placeholders in the template string using replacePlaceholders function
  template = replacePlaceholders(template, "name", table.getName());
  return template;
};

// renderView reads in view.html, replaces 'table placeholder' with the value of table
// replaces 'team' placeholder with the provided html and returns the result
const renderView = (htmlReserved, htmlWaiting) => {
  // Read in view.html file and store in template variable
  let template = fs.readFileSync(viewTemplateDir, "utf8");
  // Replace placeholders in the template string using replacePlaceholders function
  replacePlaceholders(template, "reservedTables", htmlReserved);
  return replacePlaceholders(template, "waitingTables", htmlWaiting);
};

// replacePlaceholders replaces every occurrence of a placeholder with a value
const replacePlaceholders = (template, placeholder, value) => {
  const pattern = new RegExp("{ " + placeholder + " }", "gm");
  return template.replace(pattern, value);
};

// Export the render function for use in other files
module.exports = render;