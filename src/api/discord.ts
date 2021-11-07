import { ApplicationCommandDataResolvable, Client, Intents } from "discord.js";
import * as fs from 'file-system';
import secrets from '../../secrets.json';
import { Command } from "../interfaces/command";

export class Discord {
    public static init(): void {
        const bot = new Client({ intents: Intents.FLAGS.GUILD_MESSAGES });
        // Init
        bot.login(secrets.discord.key).catch(err => console.error(err))
        bot.once("ready", () => console.log('started Discord Bot'))

        bot.on('error', error => {
            console.error('The websocket connection encountered an error:' + error.message)
        });

        // Load commands
        const commands: { [key: string]: Command } = {};
        const commandsData: ApplicationCommandDataResolvable[] = [];
        const commandFiles: string[] = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.ts'));
        commandFiles.forEach(file => {
            const command: Command = require(`./commands/${file}`);
            commands[command.data.name] = command;
            commandsData.push(command.data.toJSON())
        })
        bot.application.commands.set(commandsData);

        // Handle commands executions
        bot.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            const command = commands[interaction.commandName];
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }
}