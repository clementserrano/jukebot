import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { Command } from "../interfaces/command";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Add music to queue from url link'),
    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        // TODO Handle url from youtube or spotify
    },
};

module.exports = command;