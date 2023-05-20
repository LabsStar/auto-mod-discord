const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class LinkChecker {
    constructor(client) {
        this.client = client;
    };

    async check(message, options) {
        if (!this.client) throw new Error('You must provide a client!');

        if (message.author.bot) return;
        if (message.channel.type === 'DM') return;



        const discordInviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
        const websiteRegex = /(https?:\/\/)?(www\.)?([a-z0-9]+)\.([a-z]{2,})(\/[a-z0-9]+)?/gi;

        if (discordInviteRegex.test(message.content.toLowerCase()) || websiteRegex.test(message.content.toLowerCase())) {
            const bypassRoles = options?.bypassRoles;
            const whitelist = options?.whitelistLinks;

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

            if (checkIfBypass() || checkIfWhitelisted()) return;

            const embed = new MessageEmbed()
                .setTitle(`AutoMod - Link Detector`)
                .setDescription(`**Message:** ${message.content}\n**Channel:** ${message.channel}\n**Author:** ${message.author}`)
                .setColor('RED')
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    url: `https://discord.com/users/${message.author.id}`
                })

            if (options?.modChannel) {
                const modChannel = message.guild.channels.cache.get(options.modChannel);
                if (!modChannel) throw new Error('Invalid mod channel!');

                modChannel.send({ embeds: [embed] });
            }

        }
        
    };
};

module.exports = LinkChecker;