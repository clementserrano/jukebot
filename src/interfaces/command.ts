import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { Discord } from "../api/discord";

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction<CacheType>, context: Discord): Promise<void>;
}