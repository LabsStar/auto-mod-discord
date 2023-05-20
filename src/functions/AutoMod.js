const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const checkForDep = require('../utils/checkForDep');

const naughtyWords = fs.readFileSync(path.join(__dirname, '..', 'naughty-words.txt'), 'utf-8').split('\r\n');

const checkInCase = () => {
    if (checkForDep === "No update available!") return;
    else if (checkForDep === "Update available!") {
        // Emit a deprecation warning
        process.emitWarning('There is a New Version of this package (@hyperstarcloud/auto-mod)', 'DeprecationWarning');
    }
};

class AutoMod {
    constructor(client) {
        this.client = client;
    };

    async check(message, options) {
        if (!this.client) throw new Error('You must provide a client!');

        checkInCase();

        if (message.author.bot) return;
        if (message.channel.type === 'DM') return;

        const messageRegex = new RegExp(naughtyWords.join('|'), 'gi');

        if (messageRegex.test(message.content.toLowerCase())) {

            if (options?.deleteMessage) message.delete();

            if (options?.warnUser) {
                const warnEmbed = new MessageEmbed()
                    .setTitle('Warning!')
                    .setDescription(`You said a naughty word in ${message.guild.name}! Please don't do that again!`)
                    .setColor('RED')
                    .setFooter({
                        text: `AutoMod By: www.hyperstar.cloud`,
                        iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
                    })
                    .setTimestamp();

                try {
                    await message.author.send({ embeds: [warnEmbed], content: `${message.author}` });
                }
                catch (err) {
                    console.log(chalk.redBright(`[AutoMod] Couldn't send a DM to ${message.author.tag}... Trying to send a message in the channel instead.`));
                    warnEmbed.setDescription(`Oops! You said a naughty word... Please don't do that again!`);
                    await message.channel.send({ embeds: [warnEmbed], content: `${message.author}` }).then(msg => setTimeout(() => msg.delete(), 5000));
                }
            }

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
                    .setFooter({
                        text: `AutoMod By: www.hyperstar.cloud`,
                        iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
                    })

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

                channel.send({ embeds: [embed], components: [row] });

            }

            if (options?.pingMods) {
                const modRole = options.pingMods.role || null;


                const embed = new MessageEmbed()
                    .setTitle('AutoMod')
                    .setDescription(`Someone said a naughty word in ${message.guild.name}! Please check it out!`)
                    .setColor('RED')
                    .setFooter({
                        text: `AutoMod By: www.hyperstar.cloud`,
                        iconURL: 'https://avatars.githubusercontent.com/u/133303718?s=200&v=4',
                    })
                    .setTimestamp();

                const moderators = message.guild.members.cache.filter(member => member.roles.cache.has(modRole));

                if (!moderators) throw new Error('Invalid mod role. Maybe you forgot to set it?');

                moderators.forEach(async moderator => {
                    try {
                        await moderator.send({ embeds: [embed] });
                    }
                    catch (err) {
                        console.log(chalk.redBright(`[AutoMod] Couldn't send a DM to ${moderator.user.tag}...`));
                    }
                });
            }

        }
        else {
            return;
        }
    };
};

module.exports = AutoMod;