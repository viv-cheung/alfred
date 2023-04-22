import { Client, CommandInteraction, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const pingCommandData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Returns a pong');

export default {
  data: pingCommandData,
  execute: async (client: Client, interaction: CommandInteraction | Message) => {
    const content = 'pong';

    if (interaction instanceof CommandInteraction) {
      await interaction.followUp({
        ephemeral: true,
        content,
      });
      
    } else if (interaction instanceof Message) {
      await interaction.reply({
        content,
      });
    }
  },
};