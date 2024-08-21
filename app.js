const fs = require('fs'); // File system module to read YAML files
const yaml = require('js-yaml'); // YAML file parser
const { JSDOM } = require('jsdom');

// Load HTML document
const htmlDocument = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(htmlDocument);

// Now you can manipulate the document as you would with any other DOM Document
let htmlDOM = dom.window.document;

// Search through directory to find YAML files
const files = fs.readdirSync("./");
let configFiles = []; // All YAML files in directory
for (const file of files) {
    if (file.includes(".yml")) {
        configFiles.push(file);
    }
}

// If there is no YAML file or no YAML file found, give a warning
if (configFiles.length === 0) {
    console.warn("No configuration YAML file found!");
}

// Pushing YAML file configurations to an array
let configs = []; // Unsorted configurations

for (const configFile of configFiles) {
    try {
        let tempConfigs = yaml.load(fs.readFileSync(configFile, "utf-8")); // Read YAML file and parse it as an object with actions array
        configs.push(...tempConfigs.actions); // Push new configurations to an unsorted array
    } catch (error) {
        console.error(`Bad YAML file. Broken file: ${configFile}`);
    }
}

// Priority Order
const priority = ["remove", "replace", "insert", "alter"];
const sortedConfigs = []; // Sorted actions based on priority

// Sort actions based on priority
for (const action of priority) {
    configs.forEach((config, idx) => {
        if (action === config["type"] && configs.length !== 0) {
            sortedConfigs.push(config); // Push action to sorted array
        }
    });
}
// Creating DOM manipulation action functions
function removeAction(query, htmlFile) {
    const elementsToRemove = htmlFile.querySelectorAll(query); // Detect elements based on query (element name)
    if (elementsToRemove.length !== 0) {
        elementsToRemove.forEach(element => element.remove()); // Remove them from DOM
    }
}

function replaceAction(query, newElement, htmlFile) {
    const elementsToReplace = htmlFile.querySelectorAll(query);
    if (elementsToReplace.length !== 0) {
        elementsToReplace.forEach(element => element.outerHTML = newElement); // Replace the whole element with the new element
    }
}

function insertAction(position, target, elementToInsert, htmlFile) {
    const targetLocation = htmlFile.querySelector(target); // Find the target location
    if (targetLocation) {
        if (position === "after") {
            targetLocation.insertAdjacentHTML("afterend", elementToInsert); // Insert element after the target
        } else if (position === "before") {
            targetLocation.insertAdjacentHTML("beforebegin", elementToInsert); // Insert element before the target
        } else {
            console.error(`Undefined insert position. Input: ${position}`); // Raise console error if position parameter not applicable
        }
    }
}

function alterAction(query, newValue, htmlFile) {
    const bodyInnerText = htmlFile.body.innerHTML; // Copy original text
    htmlFile.body.innerHTML = bodyInnerText.replaceAll(query, newValue); // Mutate copy then assign it to text
}

// Applying Configurations
for (const configuration of sortedConfigs) {
    switch (configuration["type"]) {
        case "remove":
            removeAction(configuration["selector"], htmlDOM);
            break;
        case "replace":
            replaceAction(configuration["selector"], configuration["newElement"], htmlDOM);
            break;
        case "insert":
            insertAction(configuration["position"], configuration["target"], configuration["element"], htmlDOM);
            break;
        case "alter":
            alterAction(configuration["oldValue"], configuration["newValue"], htmlDOM);
            break;
        default:
            console.log(`Undefined action. Skipped. Action: ${configuration}`); // Unreachable sortedConfigs only accepts available configs. 
    }
}

console.log(htmlDOM.documentElement.outerHTML)