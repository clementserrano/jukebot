import { REST } from "@discordjs/rest";
import { AudioPlayer, createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";
import { Routes } from "discord-api-types/rest/v9";
import { ApplicationCommandDataResolvable, Client, Intents } from "discord.js";
import * as fs from 'file-system';
import secrets from '../../secrets.json';
import { Command } from "../interfaces/command";
import { YoutubeClient } from "./youtube";

export class Discord {

    bot: Client;
    player: AudioPlayer;
    youtubeApi: YoutubeClient;

    constructor() {
        this.bot = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
        // Init bot
        this.bot.login(secrets.discord.key).catch(err => console.error(err))
        this.bot.once("ready", async () => {
            console.log('started Discord Bot')

            // Load commands
            const commands: { [key: string]: Command } = {};
            const commandsData: ApplicationCommandDataResolvable[] = [];
            const commandFiles: string[] = fs.readdirSync("src/commands").filter((file: string) => file.endsWith('.ts'));
            commandFiles.forEach(file => {
                const command: Command = require(`../commands/${file}`);
                commands[command.data.name] = command;
                commandsData.push(command.data.toJSON())
            })

            // Works in one hour
            // this.bot.application.commands.set(commandsData);
            // Alt with res api
            // rest.put(Routes.applicationCommands(<any>this.bot.application.id), { body: commandsData })
            //     .then(() => console.log('Successfully registered application commands on all servers.'))
            //     .catch(console.error);

            const rest = new REST({ version: '9' }).setToken(secrets.discord.key);
            const guilds = await this.bot.guilds.fetch();
            guilds.forEach(guild => {
                rest.put(Routes.applicationGuildCommands(<any>this.bot.application.id, <any>guild.id), { body: commandsData })
                    .then(() => console.log('Successfully registered application commands on server ' + guild.name))
                    .catch(console.error);
            })

            // Init player
            this.player = createAudioPlayer({ debug: true, behaviors: { noSubscriber: NoSubscriberBehavior.Stop } });
            this.player.on('error', error => {
                console.error(error);
            });

            // Init youtube API
            this.youtubeApi = new YoutubeClient();

            // Handle commands executions
            this.bot.on('interactionCreate', async interaction => {
                if (!interaction.isCommand()) return;
                const command = commands[interaction.commandName];
                if (!command) return;
                try {
                    await command.execute(interaction, this);
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error while executing this command! 😨', ephemeral: false });
                }
            });
        })

        this.bot.on('error', error => {
            console.error('The websocket connection encountered an error:' + error.message)
        });
    }
}