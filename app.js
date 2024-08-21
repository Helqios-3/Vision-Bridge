const fs = require('fs'); // File system module to read YAML files
const yaml = require('js-yaml'); // YAML file parser

const files = fs.readdirSync("./");
let configFiles = []; 
for (file of files){
    if (file.includes(".yml")) {
        configFiles.push(file)
    }
}

let configs = [];

// TODO: Error Catch For Bad YAML Files

for (const configFile of configFiles) {
    let tempConfigs = yaml.load(fs.readFileSync(configFile, "utf-8")); // Read YAML file and parse it as config array
    configs.push(...tempConfigs.actions);
    tempConfigs = null;
}

// Priority Order
const priority = ["remove", "replace", "insert", "alter"];
const sortedConfigs = [];

for (const action of priority) {
    configs.forEach((config, idx) => {
        if (action === config["type"] && configs.lenght !== 0) {
            const halfBefore = configs.slice(0, idx)
            const halfAfter = configs.slice((idx))
            configs.actions = halfBefore.concat(halfAfter)
            sortedConfigs.push(config);
        }
    }
    );
}
// console.log(sortedConfigs)

// Creating DOM manipulation action functions
// TODO: Error catch

function removeAction(query) {
    const elementsToRemove = document.querySelectorAll(query); // Detect elements based on query (element name)
    elementsToRemove.forEach(element => element.remove()); // Remove them from DOM
}

function replaceAction(query, newElement) {
    const elementsToReplace = document.querySelectorAll(query);
    elementsToReplace.forEach(element => element.outerHTML = newElement); // Replace the whole element with the new element
}

function insertAction(position, target, elementToInsert) {
    const targetLocation = document.querySelector(target); // Find the target location
    if (position === "after") {
        targetLocation.insertAdjacentHTML("afterend", elementToInsert); // Insert element after the target
    }
    else if (position === "before") {
        targetLocation.insertAdjacentHTML("beforebegin", elementToInsert); // Insert element before the target
    }
    else {
        console.error(`Undefined position. Input: ${position}`); // Raise console error if position parameter not applicable
    }
}

function alterAction(query, newValue) {
    const bodyInnerText = Document.body.innerText; // Copy original text
    document.body.innerText = bodyInnerText.replace(query, newValue) // mutate copy then assign it to text
}

// Applying Configurations

for (const configuration of sortedConfigs) {
    switch (configuration["type"]) {
        case "remove":
            removeAction(configuration["selector"]);
            break;
        case "replace":
            replaceAction(configuration["selector"], configuration["newElement"]);
            break;
        case "insert":
            insertAction(configuration["position"], configuration["target"], configuration["element"]);
            break;
        case "alter":
            alterAction(configuration["oldValue"], configuration["newValue"]);
            break;
        default:
            console.error(`Undefined action. Skipped. Action: ${configuration}`)
    }
}