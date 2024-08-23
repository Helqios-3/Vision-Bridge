// Fetching YAML Files From Server

async function fetchConfigFiles() {
    const response = await fetch('/yaml-files');
    const files = await response.json();
    return files;
}

// Fetching Singular YAML File And Parsing It

async function parseConfigFile(file) {
    const response = await fetch(file);
    const text = await response.text();
    return jsyaml.load(text);
}

// Filling Configurations Array From Fetched YAML Files

async function fillConfigArray(configFiles) {
    // If there is no YAML file or no YAML file found, give a warning
    if (configFiles.length === 0) {
        console.warn("No configuration YAML file found!");
    } else {
        let configs = [];
        for (const configFile of configFiles) {
            try {
                let tempConfigs = await parseConfigFile(configFile) // Read YAML file and parse it as an object with actions array
                configs.push(...tempConfigs.actions); // Push new configurations to an unsorted array
            } catch (error) {
                console.error(`Bad YAML file. Broken file: ${configFile}`);
            }
        }
        return configs;
    }
}

// Sorting Configs

async function sortConfigArray(configs) {
    // Priority Order
    const priority = ["insert", "replace", "remove", "alter"];
    const sortedConfigs = []; // Sorted actions based on priority

    // Sort actions based on priority
    for (const action of priority) {
        configs.forEach((config) => {
            if (action === config["type"] && configs.length !== 0) {
                sortedConfigs.push(config); // Push action to sorted array
            }
        });
    }
    return sortedConfigs;
}

// Creating Functions for DOM Manipulation

function removeAction(query) {
    const elementsToRemove = document.querySelectorAll(query); // Detect elements based on query (element name)
    if (elementsToRemove.length !== 0) {
        elementsToRemove.forEach(element => element.remove()); // Remove them from DOM
    }
    else {
        console.warn(`Could not find ${query} for removal.`)
    }
}

function replaceAction(query, newElement) {
    const elementsToReplace = document.querySelectorAll(query);
    if (elementsToReplace.length !== 0) {
        elementsToReplace.forEach(element => element.outerHTML = newElement); // Replace the whole element with the new element
    }
    else {
        console.warn(`Could not find ${query} to replace with ${newElement}.`)
    }
}

function insertAction(position, target, elementToInsert) {
    const targetLocation = document.querySelector(target); // Find the target location
    if (targetLocation) {
        if (position === "after") {
            targetLocation.insertAdjacentHTML("afterend", elementToInsert); // Insert element after the target
        } else if (position === "before") {
            targetLocation.insertAdjacentHTML("beforebegin", elementToInsert); // Insert element before the target
        } else {
            console.error(`Undefined insert position. Input: ${position}`); // Raise console error if position parameter not applicable
        }
    }
    else {
        console.warn(`Could not find ${target} for insertion location.`)
    }
}

function alterAction(query, newValue) {
    const bodyInnerText = document.body.innerHTML; // Copy original text
    // Making sure query is not inside an html element by making sure that it is not afte < nor before > ((?<!<[^>]*?) and (?![^<]*?>)) As well as word is not part of another word like fire and firetruck (\\b) second parameter replaces all instances
    const safeQuery = new RegExp(`(?<!<[^>]*?)\\b${query}\\b(?![^<]*?>)`, 'g');
    document.body.innerHTML = bodyInnerText.replace(safeQuery, newValue); // Mutate copy then assign it to text
}

//  Use All The Functions In Order To Fetch And Apply Configs

async function applyConfigs() {
    try {
        
        // Fetch YAML configurations; fill config array with them; sort it with priority order

        const configFiles = await fetchConfigFiles(); // All YAML files *NOT PARSED*
        console.log("Found YAML Files: ", (configFiles));
        let configs = await fillConfigArray(configFiles); // Unsorted configurations
        let sortedConfigs = await sortConfigArray(configs) // Sorted configs

        console.log("Found Total Amount of Actions: ", (await sortedConfigs.length))

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
                    console.log(`Undefined action. Skipped. Action: ${configuration}`); // Unreachable sortedConfigs only accepts available configs. 
            }
        }
        console.log('Succesfuly applied possible configurations');
    } catch (error) {
        console.error('Error applying configurations:', error);
    }
}

// Run configurations after DOM is loaded

document.addEventListener("DOMContentLoaded", applyConfigs());
