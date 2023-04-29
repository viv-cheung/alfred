import { Client, CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

const pingCommandData = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Alfred will greet you')

export default {
  data: pingCommandData,
  execute: async (client: Client, interaction: CommandInteraction) => {
    const content = ':smile: *Why, hello!*'

    await interaction.followUp({
      ephemeral: true,
      content,
    })
  },
}
