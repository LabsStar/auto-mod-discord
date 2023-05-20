const { Client } = require("discord.js");
const { LinkChecker } = require("../src/app");


const client = new Client({
    intents: 32767,
});

const linkChecker = new LinkChecker(client);
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    
    linkChecker.check(message, {
        bypassRoles: [],
        modChannel: "1020761875979452457",
        whitelistLinks: ["https://discord.gg/m23dww9j"],
    });
    
    
});


client.login("TOKEN");