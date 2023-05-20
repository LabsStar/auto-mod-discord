const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');


const AutoModImage = () => {
    const attachment = new MessageAttachment(path.join(__dirname, '../data/images/imrs.jpg'), 'imrs.jpg');
    return attachment;
};

// Helper function to check for package updates
const checkInCase = (checkForDep) => {
  if (checkForDep === "No update available!") return;
  else if (checkForDep === "Update available!") {
    // Emit a warning if there is a new version of the package
    process.emitWarning('There is a New Version of this package (auto-mod-discord)', 'DeprecationWarning');
  }
};

class AntiSpam {
  constructor(client) {
    this.client = client;
  };

  // Method to check for spam
  async check(message, options) {
    if (!this.client) throw new Error('You must provide a client!');

    // Function to check if the user is exempt from spam checks based on roles
    function checkIfBypass() {
      const bypassRoles = options?.bypassRoles || null;
      if (bypassRoles) {
        return message.member.roles.cache.some(role => bypassRoles.includes(role.id));
      } else {
        return false;
      }
    }

    // Skip spam check for bots, DMs, and exempt users
    if (message.author.bot || message.channel.type === 'DM' || checkIfBypass()) {
      return;
    }

    // Retrieve options or use default values
    const modLogChannel = options?.modLogChannel || null;
    const warnMessage = options?.warnMessage || '{@user}, Please do not spam {type}!';
    const allowEmojis = options?.allowEmojis || false;
    const messageWarningThreshold = options?.messageWarningThreshold || 5;
    const emojiWarningThreshold = options?.emojiWarningThreshold || 5;

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL(`https://www.hyperstar.cloud/guides/setup-automod-for-your-discord-server`)
          .setLabel('Setup AutoMod For Your Server (Guide)')
          .setEmoji('📚')
          .setStyle('LINK'),
      );

    const MAX_EMOJI = 5;
    const MAX_MESSAGE = 5;

    const emojiRegex = /<a?:.+?:\d+>|[\u263a-\ud83d[\uDE00-\uDE4F]/g;

    // Count the number of emojis in the message
    const emojiCount = (message.content.match(emojiRegex) || []).length;
    // Count the number of words in the message
    const messageCount = message.content.split(/\s+/).length;

    // Check for excessive emoji usage
    if (emojiCount >= emojiWarningThreshold && !allowEmojis) {
      message.delete();
      message.channel.send({ content: warnMessage.replace('{@user}', `<@${message.author.id}>`).replace('{type}', 'emojis') });
      if (modLogChannel) {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setTitle('AutoMod - Anti Spam')
          .setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Action:** Warn\n**Reason:** Spamming Emojis\n**Message:** \`\`\`${message.content}\`\`\``)
          .setImage('attachment://imrs.jpg')
          .setTimestamp();

        const channel = message.guild.channels.cache.get(modLogChannel);

        if (!channel) throw new Error('Invalid ModLog Channel Provided!');
        else channel.send({ embeds: [embed], components: [row], files: [AutoModImage()] });
      }
    }

    // Check for excessive message length
    if (messageCount >= messageWarningThreshold) {
      message.delete();
      message.channel.send({ content: warnMessage.replace('{@user}', `<@${message.author.id}>`).replace('{type}', 'messages') });
      
      if (modLogChannel) {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setTitle('AutoMod - Anti Spam')
          .setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Action:** Warn\n**Reason:** Spamming Messages\n**Message:** \`\`\`${message.content}\`\`\``)
          .setImage('attachment://imrs.jpg')
          .setTimestamp();

        const channel = message.guild.channels.cache.get(modLogChannel);

        if (!channel) throw new Error('Invalid ModLog Channel Provided!');
        else channel.send({ embeds: [embed], components: [row], files: [AutoModImage()] });
      }
    }
  };
}

module.exports = AntiSpam;
