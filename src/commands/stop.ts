import { SlashCommandBuilder } from "@discordjs/builders";
import { VoiceConnection, getVoiceConnection } from "@discordjs/voice";
import { CacheType, CommandInteraction, GuildMember } from "discord.js";
import { Discord } from "../api/discord";
import { Command } from "../interfaces/command";

const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music player and leaves voice channel');

const command: Command = {
    data,
    async execute(interaction: CommandInteraction<CacheType>, context: Discord): Promise<void> {
        context.player.stop();
        const member: GuildMember = <GuildMember>interaction.member;
        const connection: VoiceConnection = getVoiceConnection(member.guild.id);
        connection.destroy();
        interaction.reply({ content: 'Player stopped ⏹' });
    }
};

module.exports = command;