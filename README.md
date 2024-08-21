# Vision-Bridge
Software Developer Assignment

Requires js-yaml module for parsing. (npm install js-yaml)
Put your YAML(".yml") files in the same directory with "app.js". Javascript file will automatically detect and apply them.
YAML file must include the indicators ".", "#" before element names so that document.querySelectorAll() can understand if it is searching for Id, Class or Tag.
Insert action only accepts positions "after" and "before" so raises a console error if there is an undefined position.
You need to put "<script defer src="./app.js"></script>" line at the end of body of the HTML you wish to apply the configs to.