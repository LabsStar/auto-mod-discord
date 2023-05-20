// Import the AutoMod function from the 'AutoMod' module
const AutoMod = require('./functions/AutoMod');

// Import the LinkChecker function from the 'LinkChecker' module
const LinkChecker = require('./functions/LinkChecker');

// Import the AntiSpam function from the 'AntiSpam' module
const AntiSpam = require('./functions/AntiSpam');

// Import the Analytics function from the 'analytics' module
const Analytics = require('./functions/Analytics'); //! Only set this to remove the error: 'differs from already included file name 'Analytics.js' only in casing.'

// Export the functions as a module
module.exports = {
  AutoMod,
  LinkChecker,
  AntiSpam,
  Analytics,
};
