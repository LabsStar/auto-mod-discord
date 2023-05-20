const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Analytics = require('./Analytics');
const analytics = new Analytics();
const checkForDep = require('../utils/checkForDep');

// Helper function to check for package updates
const checkInCase = () => {
  if (checkForDep === "No update available!") return;
  else if (checkForDep === "Update available!") {
    // Emit a deprecation warning if there is a new version of the package
    process.emitWarning('There is a New Version of this package (auto-mod-discord)', 'DeprecationWarning');
  }
};

const AutoModImage = () => {
  const attachment = new MessageAttachment(path.join(__dirname, '../data/images/imrs.jpg'), 'imrs.jpg');
  return attachment;
};

class LinkChecker {
  constructor(client) {
    this.client = client;
  };

  // Method to check for links in messages
  async check(message, options) {
    if (!this.client) throw new Error('You must provide a client!');

    // Check for package updates
    checkInCase();

    // Skip checking messages from bots and DMs
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;

    // Regular expressions to match discord invites and general website links
    const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
    const websiteRegex = /(https?:\/\/)?(www\.)?([a-z0-9]+)\.([a-z]{2,})(\/[a-z0-9]+)?/gi;

    // Check if the message contains a discord invite or a website link
    if (discordInviteRegex.test(message.content.toLowerCase()) || websiteRegex.test(message.content.toLowerCase())) {

      // Get bypass roles and whitelisted links from options
      const bypassRoles = options?.bypassRoles;
      const whitelist = options?.whitelistLinks;

      // Function to check if the user has a bypass role
      function checkIfBypass() {
        if (bypassRoles) {
          if (message.member.roles.cache.some(role => bypassRoles.includes(role.id))) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }

      // Function to check if the link is whitelisted
      function checkIfWhitelisted() {
        if (whitelist) {
          if (whitelist.some(link => message.content.toLowerCase().includes(link))) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }

      // Skip checking if the user has a bypass role or the link is whitelisted
      if (checkIfBypass() || checkIfWhitelisted()) {
        analytics.set("links", "whitelisted", analytics.get("links", "whitelisted").value + 1);
        analytics.set("links", "total", analytics.get("links", "total").value + 1);
      }

      // Create an embed to display information about the link
      const embed = new MessageEmbed()
        .setTitle(`AutoMod - Link Detector`)
        .setDescription(`**Message:** ${message.content}\n**Channel:** ${message.channel}\n**Author:** ${message.author}`)
        .setColor('RED')
        .setImage('attachment://imrs.jpg')
        .setFooter({
          text: `AutoMod By: www.hyperstar.cloud`,
          iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
        })
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
          url: `https://discord.com/users/${message.author.id}`
        });

      // Create a row of buttons for additional actions
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setURL(`https://www.hyperstar.cloud/guides/setup-automod-for-your-discord-server`)
            .setLabel('Setup AutoMod For Your Server (Guide)')
            .setEmoji('📚')
            .setStyle('LINK'),
        );

      // Send the embed and buttons to the specified mod channel
      if (options?.modChannel) {
        const modChannel = message.guild.channels.cache.get(options.modChannel);
        if (!modChannel) throw new Error('Invalid mod channel!');

        modChannel.send({ embeds: [embed], components: [row], files: [AutoModImage()] });
      }

      analytics.set("links", "total", analytics.get("links", "total").value + 1);
      analytics.set("links", "blocked", analytics.get("links", "blocked").value + 1);
      analytics.set("links", "links", [...analytics.get("links", "links").value, message.content]);
    }
  };
}

module.exports = LinkChecker;
