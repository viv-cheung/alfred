import { CommandInteraction, Client } from 'discord.js'
import { Command } from '../types/Command'

// Command to check if bot is alive
export default {
  name: 'gtc-ping',
  description: 'Returns a pong',
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = 'pong'

    await interaction.followUp({
      ephemeral: true,
      content,
    })
  },
} as Command
