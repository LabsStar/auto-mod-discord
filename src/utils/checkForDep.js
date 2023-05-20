const url = "https://api.github.com/repos/LabsStar/auto-mod-discord/contents/package.json";
const fetch = require("node-fetch");

const { version } = require("../../package.json");

// Function to check for package updates
module.exports = async () => {
  // Fetch the package.json file from the GitHub API
  fetch(url)
    .then(response => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Decode the content of the package.json file from base64 to ASCII
      const buff = Buffer.from(data.content, "base64");
      const text = buff.toString("ascii");

      // Parse the package.json content into a JSON object
      const json = JSON.parse(text);

      // Extract the version from the package.json
      const latestVersion = json.version;

      // Compare the latest version with the current version
      if (latestVersion !== version) return "Update available!";
      
      return "No update available!";
    })
    .catch(error => {
      console.error("Error:", error);
    });
};
