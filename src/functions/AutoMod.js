const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const checkForDep = require('../utils/checkForDep');
const Analytics = require('./Analytics');
const analytics = new Analytics();

// Read and split the list of naughty words from a file
const naughtyWords = fs.readFileSync(path.join(__dirname, '..', 'naughty-words.txt'), 'utf-8').split('\r\n');

// Helper function to check for package updates
const checkInCase = () => {
  if (checkForDep === "No update available!") return;
  else if (checkForDep === "Update available!") {
    // Emit a warning if there is a new version of the package
    process.emitWarning('There is a New Version of this package (auto-mod-discord)', 'DeprecationWarning');
  }
};

const AutoModImage = () => {
  const attachment = new MessageAttachment(path.join(__dirname, '../data/images/imrs.jpg'), 'imrs.jpg');
  return attachment;
};

class AutoMod {
  constructor(client) {
    this.client = client;
  };

  // Method to check for naughty words in messages
  async check(message, options) {
    if (!this.client) throw new Error('You must provide a client!');

    // Check for package updates
    checkInCase();

    // Skip checking messages from bots and DMs
    if (message.author.bot) return;
    if (message.channel.type === 'DM') return;

    // Create a regular expression from the list of naughty words
    const messageRegex = new RegExp(naughtyWords.join('|'), 'gi');

    // Check if the message contains a naughty word but if it is like "Analytics" or "Analyst" where it contains a naughty word but is not a naughty word itself

    const checkWord = (word) => {
      if (word.toLowerCase().match(messageRegex)) {
        if (naughtyWords.includes(word.toLowerCase())) return true;
        else return false;
      }
      else return false;
    };
    
    if (checkWord(message.content)) {

      // Delete the message if specified in options
      if (options?.deleteMessage) message.delete();

      // Send a warning to the user if specified in options
      if (options?.warnUser) {
        const warnEmbed = new MessageEmbed()
          .setTitle('Warning!')
          .setDescription(`You said a naughty word in ${message.guild.name}! Please don't do that again!`)
          .setColor('RED')
          .setFooter({
            text: `AutoMod By: www.hyperstar.cloud`,
            iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
          })
          .setImage("attachment://imrs.jpg")
          .setTimestamp();

        try {
          await message.author.send({ embeds: [warnEmbed], content: `${message.author}` });
        }
        catch (err) {
          console.log(chalk.redBright(`[AutoMod] Couldn't send a DM to ${message.author.tag}... Trying to send a message in the channel instead.`));
          warnEmbed.setDescription(`Oops! You said a naughty word... Please don't do that again!`);
          await message.channel.send({ embeds: [warnEmbed], content: `${message.author}`, files: [AutoModImage()] }).then(msg => setTimeout(() => msg.delete(), 5000));
        }
      }

      // Send a notification to the mod channel if specified in options
      if (options?.modChannel) {
        const embed = new MessageEmbed()
          .setTitle(`AutoMod - Naughty Word Detector`)
          .setDescription(`**Message:** ${message.content}\n**Channel:** ${message.channel}\n**Author:** ${message.author}`)
          .setColor('RED')
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
            url: `https://discord.com/users/${message.author.id}`
          })
          .setImage("attachment://imrs.jpg")
          .setFooter({
            text: `AutoMod By: www.hyperstar.cloud`,
            iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
          });

        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setURL(`https://discord.com/users/${message.author.id}`)
              .setLabel('View Profile')
              .setEmoji('👤')
              .setStyle('LINK'),
            new MessageButton()
              .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
              .setLabel('View Message')
              .setEmoji('📝')
              .setStyle('LINK'),
            new MessageButton()
              .setURL(`https://www.hyperstar.cloud/guides/setup-automod-for-your-discord-server`)
              .setLabel('Setup AutoMod For Your Server (Guide)')
              .setEmoji('📚')
              .setStyle('LINK'),
          );

        const channel = message.guild.channels.cache.get(options.modChannel);

        if (!channel) throw new Error('Invalid mod channel!');

        channel.send({ embeds: [embed], components: [row], files: [AutoModImage()] });
      }

      // Ping moderators if specified in options
      if (options?.pingMods) {
        const modRole = options.pingMods.role || null;

        const embed = new MessageEmbed()
          .setTitle('AutoMod')
          .setDescription(`Someone said a naughty word in ${message.guild.name}! Please check it out!`)
          .setColor('RED')
          .setImage("attachment://imrs.jpg")
          .setFooter({
            text: `AutoMod By: www.hyperstar.cloud`,
            iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
          })
          .setTimestamp();

        const moderators = message.guild.members.cache.filter(member => member.roles.cache.has(modRole));

        if (!moderators) throw new Error('Invalid mod role. Maybe you forgot to set it?');

        moderators.forEach(async moderator => {
          try {
            await moderator.send({ embeds: [embed], files: [AutoModImage()] });
          }
          catch (err) {
            console.log(chalk.redBright(`[AutoMod] Couldn't send a DM to ${moderator.user.tag}...`));
          }
        });
      }

      analytics.set("word_filter", "total", analytics.get("word_filter", "total").value + 1);
      analytics.set("word_filter", "blocked", analytics.get("word_filter", "blocked").value + 1);
      analytics.set("word_filter", "messages", [...analytics.get("word_filter", "messages").value, message.content]);
    }
    else {
      return;
    }
  };
};

module.exports = AutoMod;
