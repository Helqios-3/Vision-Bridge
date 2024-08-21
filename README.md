# Vision-Bridge
Software Developer Assignment

Requires js-yaml module for parsing YAML files. (npm install js-yaml)
Requires jsdom module for DOM manipulation for Node.js. (npm install jsdom)
Put your YAML(".yml") files in the same directory with "app.js". Javascript file will automatically detect and apply them.
YAML file must include the indicators ".", "#" before element names so that document.querySelectorAll() can understand if it is searching for Id, Class or Tag.
Insert action only accepts positions "after" and "before" so raises a console error if there is an undefined position.
