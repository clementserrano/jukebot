import { SlashCommandBuilder } from "@discordjs/builders";
import { createAudioResource, getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { CacheType, CommandInteraction, GuildMember } from "discord.js";
import { Discord } from "../api/discord";
import { Command } from "../interfaces/command";

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Add music to queue from url link');
data.addStringOption(option => option.setName("url")
    .setDescription("Url link of the video/music to diffuse")
    .setRequired(true));

const command: Command = {
    data,
    async execute(interaction: CommandInteraction<CacheType>, context: Discord): Promise<void> {
        const member: GuildMember = <GuildMember>interaction.member;
        const channelId = member.voice.channelId;

        let connection: VoiceConnection = getVoiceConnection(member.guild.id);
        // Join same channel as member
        if (channelId) {
            const joinedConnection = joinVoiceChannel({
                channelId: channelId,
                guildId: member.guild.id,
                adapterCreator: member.guild.voiceAdapterCreator
            })
            if(connection && connection !== joinedConnection){
                connection.disconnect();
                connection = null;
            }
            if (!connection) {
                connection = joinedConnection;
                connection.on(VoiceConnectionStatus.Ready, async () => {
                    await playAudio();
                });
            } else {
                await playAudio();
            }
        } else if (connection) {
            await playAudio();
        } else {
            interaction.reply({ content: `You must be in a channel to start the JAM`, ephemeral: true });
        }

        async function playAudio() {
            const player = connection.subscribe(context.player).player;
            const url = interaction.options.getString("url", true);
            const title = await context.youtubeApi.getTitle(url);
            const readable = await context.youtubeApi.streamMP3(url);
            const resource = createAudioResource(readable);
            player.play(resource);
            interaction.reply(`Playing music "${title}"`);
        }
    },
};

module.exports = command;