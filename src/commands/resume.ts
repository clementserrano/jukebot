import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { Discord } from "../api/discord";
import { Command } from "../interfaces/command";

const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume music player');

const command: Command = {
    data,
    async execute(interaction: CommandInteraction<CacheType>, context: Discord): Promise<void> {
        context.player.unpause();
        interaction.reply({ content: 'Player resumed ⏯' });
    }
};

module.exports = command;