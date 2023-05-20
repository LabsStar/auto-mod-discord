const url = "https://api.github.com/repos/LabsStar/auto-mod-discord/contents/package.json";
const fetch = require("node-fetch");

const { version } = require("../../package.json");

module.exports = async () => {
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const buff = Buffer.from(data.content, "base64");

        const text = buff.toString("ascii");

        const json = JSON.parse(text);

        const version = json.version;

        if (version !== version) return "Update available!";

        return "No update available!";
        
    })
    .catch(error => {
        console.error("Error:", error);
    });
};
