import { Client, CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const pingCommandData = new SlashCommandBuilder()
  .setName('gtc-ping')
  .setDescription('Returns a pong')

export default {
  data: pingCommandData,
  execute: async (client: Client, interaction: CommandInteraction) => {
    const content = 'pong'

    await interaction.followUp({
      ephemeral: true,
      content,
    })
  },
}
