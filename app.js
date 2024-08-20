const fs = require('fs'); // File system module to read YAML files
const yaml = require('js-yaml'); // YAML file parser

const configFiles = ["config.yml"]; // Suppose to handle multiple YAML files

const configs = yaml.load(fs.readFileSync("config.yml", "utf-8")); // Read YAML file and parse it as config array
console.log(configs)

// Priority Order
const priority = ["remove", "replace", "insert", "alter"];

// Creating DOM manipulation action functions

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
    const bodyInnerText = document.body.innerText; // Copy original text
    document.body.innerText = bodyInnerText.replace(query, newValue) // mutate copy then assign it to text
}