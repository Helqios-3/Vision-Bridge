# Vision Bridge

## Software Developer Assignment

### Setup

- This GitHub repo has the modules "server.js" has dependencies on. However, for unforeseen problems, here are the required modules:
- Only required module to test other host names. `npm install localtunnel`
```javascript
  npm install js-yaml // Node.js YAML file parser: js-yaml
  npm install --save-dev http-server   // Node.js Server
```

- You can remove the example "index.html" and copy your HTML file, or simply copy its content over the example.
- However "index.html" needs two spesific lines code. They are:
- 1. `<script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>` at the end of head section of the "index.html".
- 2. `<script src="app.js"></script>` at the end of body section of the "index.html".
- Similarly, replace or write over the example ".yml" files with your own YAML files.
- Make sure your YAML (".yml") files are in the same directory as "server.js". The JavaScript file will automatically detect and apply them. Bad YAML file errors will show up in the console if things go wrong.
- Make sure your HTML file is in the same directory with server.js and named "index.html" for it to be configured by YAML configurations.
- Run server.js with `node server.js` in console and it will run the server which will automatically apply the configurations.
- You can see your running HTML at http://localhost:8080/
- Start-Process "http://localhost:8080" -ArgumentList "-H", "Host: example.com"

### Code Structures

### "app.js"

#### Fetching YAML Files From Server
- Request files from server with `.yml` extensions and return files as an array.

#### Fetching Singular YAML File And Parsing It
- Get a YAML file and parse it with js-yaml extension added to HTML.

#### Filling Configurations Array From Fetched YAML Files
- Use previous two functions to get files then parse them one by one push them to an unsorted array.

#### Sorting Configs
- Sort the unsorted configs array from previous section with `insert -> replace -> remove -> alter` order. (More on "Solution.txt")

#### Creating Functions for DOM Manipulation
- Create functions for actions that YAML files can provide so that when it's time to apply the config, the code can call these functions to achieve its goal.
- Singular note for alter action as it is the most complex one. Code simply checks that modified text is not part of HTML element structure as code manipulates .innerHTML to make sure that HTML structure is not changed.

#### Applying Configurations
- Use first 4 sections to create a sorted configurations array. Go through the sorted config array with a switch-case that decides based on the "type" of action, then call the previously mentioned DOM manipulation functions.

#### Run Configurations After DOM Is Loaded
- Wait for DOM to be fully loaded then apply previous function to apply rest of the code.

### "server.js"

#### Request YAML Files
- Only non boilerplate code in the "server.js" file. I created unique request that will send any file that has YAML file extension to "app.js".

### Limitations and Assumptions
- YAML files are in working order with the expected structure. There is no attempt in the code to parse and salvage some configs. The code will simply raise an error and skip the config file while displaying the skipped file name in the console.
- The HTML file must be named "index.html".
- All YAML files and the HTML file must be in the same directory as server.js.
- To extend the "proper YAML structure" clause, this code is written based on the example in the assignment PDF, so requirements include:
- YAML file must include the indicators ".", "#" before element names so that document.querySelectorAll() can understand if it is searching for Id, Class or Tag.
- Insert action only accepts positions "after" and "before", so it raises a console error if there is an undefined position.

- There is no checking if the HTML file after configurations is working or if the user made a mistake somewhere (e.g., removing an element but trying to change it afterward). Actions are only sorted through action priority; there is no factoring in config file names or how high an action was written in YAML files.
- If an action with higher priority is acting on the same element, configurations will apply through that priority order, and if an action isn't available due to previous actions, it will be skipped.