// Import the AutoMod function from the 'AutoMod' module
const AutoMod = require('./functions/AutoMod');

// Import the LinkChecker function from the 'LinkChecker' module
const LinkChecker = require('./functions/LinkChecker');

// Import the AntiSpam function from the 'AntiSpam' module
const AntiSpam = require('./functions/AntiSpam');

// Export the functions as a module
module.exports = {
    AutoMod,
    LinkChecker,
    AntiSpam
};
