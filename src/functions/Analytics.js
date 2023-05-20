const chalk = require("chalk");
const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

// Define the initial data structure
var DataObj = {
  links: {
    blocked: 0,
    whitelist: 0,
    bypass: 0,
    total: 0,
    links: [],
  },
  spam: {
    blocked: 0,
    emojis: 0,
    text: 0,
    total: 0,
    messages: [],
  },
  word_filter: {
    blocked: 0,
    total: 0,
    messages: [],
  },
};

class Analytics {
  constructor() { }

  /**
   * Sets the value for a specified key within an object in the Data structure.
   * @param {string} objName - The name of the object within Data.
   * @param {string} key - The key to set within the specified object.
   * @param {any} value - The value to assign to the specified key.
   * @returns {object} - The modified object within Data.
   */
  set(objName, key, value) {
    if (!objName) throw new Error("You must provide an object name!");
    if (!key) throw new Error("You must provide a key!");
    if (!value) throw new Error("You must provide a value!");

    DataObj[objName][key] = value;

    return DataObj[objName];
  }

  /**
   * Retrieves the value of a specified key within an object in the Data structure.
   * If no object name is provided, returns the entire Data structure.
   * If no key is provided, returns the specified object within Data.
   * @param {string} objName - The name of the object within Data.
   * @param {string} key - The key to retrieve within the specified object.
   * @returns {object} - The value and type of the specified key or the entire Data structure.
   */
  get(objName, key) {
    if (!objName) return DataObj;

    if (!key) return DataObj[objName];

    return {
      value: DataObj[objName][key],
      type: typeof DataObj[objName][key], //? This can be used to check if the value is an array, object, string, etc. (e.g. if (type === "object") { ... })
    };
  }

  sendEmbed(client, channelID) {
    const embed = new MessageEmbed()
      .setTitle("AutoMod Analytics")
      .setColor("#2F3136")
      .setFooter({
        text: `AutoMod By: www.hyperstar.cloud`,
        iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
      })
      .setTimestamp();

      for (const [key, value] of Object.entries(DataObj)) {
        if (key === "links") {
          embed.addFields({
            name: "Links",
            value: `Blocked: \`${value.blocked}\`\nWhitelisted: \`${value.whitelist}\`\nBypassed: \`${value.bypass}\`\nTotal: \`${value.total}\``,
          })
        }
        else if (key === "spam") {
          embed.addFields({
            name: "Spam",
            value: `Blocked: \`${value.blocked}\`\nEmojis: \`${value.emojis}\`\nText: \`${value.text}\`\nTotal: \`${value.total}\``,
          })
        }
        else if (key === "word_filter") {
          embed.addFields({
            name: "Word Filter",
            value: `Blocked: \`${value.blocked}\`\nTotal: \`${value.total}\``,
          })
        }
      }

    if (!client && !channelID) return embed;

    const channel = client.channels.cache.get(channelID);

    if (!channel) throw new Error("Invalid channel ID!");

    channel.send({ embeds: [embed] });
  }
}

module.exports = Analytics;
