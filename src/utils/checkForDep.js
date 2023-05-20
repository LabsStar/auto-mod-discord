const url = "https://github.com/LabsStar/auto-mod-discord/blob/main/package.json";
const fetch = require("node-fetch");

fetch(url).then(response => response.json()).then(data => {
    console.log(data);
});