const { Client } = require("discord.js");
const token = "MTA5MTM0MTA3MDM3MTE0Mzc1Mg.G89wj4.NXcsYWN-inH2gYP_0s8_Gi5xmvM_WHmOuI8BWs";
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


client.login(token);