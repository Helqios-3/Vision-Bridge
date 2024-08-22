# Vision Bridge

## Software Developer Assignment

### Setup

- This GitHub repo has the modules "app.js" has dependencies on. However, for unforeseen problems, here are the required modules:
```javascript
  npm install js-yaml // Node.js YAML file parser: js-yaml
  npm install jsdom   // Node.js DOM manipulator: jsdom
```

- You can remove the example "index.html" and copy your HTML file, or simply copy its content over the example.
- Similarly, replace or write over the example ".yml" files with your own YAML files.
- Put your YAML (".yml") files in the same directory as "app.js". The JavaScript file will automatically detect and apply them. Bad YAML file errors will show up in the console if things go wrong
- Put your HTML file in the directory with app.js and name it "index.html" for it to be configured by YAML configurations.
- Run app.js with `node app.js` in console and it will apply the configurations.

### Code Structure

#### Module Imports
- Require() needed Node.js modules (fs, js-yaml, jsdom)

#### Loading Files
- Read `index.html` HTML as string then parse it with jsdom then reach inside elements for future use.
- Search through directory with fs to find `.yml` extensions and add their actions in one unsorted configs array.

#### Sorting Configs with Priority Order
- Sort the unsorted configs array from"File Loading" section with `remove -> replace -> insert -> alter` order. (More on "Solution.txt")

#### Creating Functions for DOM Manipulation
- Create functions for actions that YAML files can provide so that when it's time to apply the config, the code can call these functions to achieve its goal.

#### Applying Configurations
- Go through the sorted config array with a switch-case that decides based on the "type" of action, then call the previously mentioned functions.

### Limitations and Assumptions
- YAML files are in working order with the expected structure. There is no attempt in the code to parse and salvage some configs. The code will simply raise an error and skip the config file while displaying the skipped file name in the console.
- The HTML file must be named "index.html".
- All YAML files and the HTML file must be in the same directory as app.js.
- To extend the "proper YAML structure" clause, this code is written based on the example in the assignment PDF, so requirements include:
- YAML file must include the indicators ".", "#" before element names so that document.querySelectorAll() can understand if it is searching for Id, Class or Tag.
- Insert action only accepts positions "after" and "before", so it raises a console error if there is an undefined position.

- There is no checking if the HTML file after configurations is working or if the user made a mistake somewhere (e.g., removing an element but trying to change it afterward). Actions are only sorted through action priority; there is no factoring in config file names or how high an action was written in YAML files.
- If an action with higher priority is acting on the same element, configurations will apply through that priority order, and if an action isn't available due to previous actions, it will be skipped.