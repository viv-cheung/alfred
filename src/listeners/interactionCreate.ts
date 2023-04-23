import { CommandInteraction, Client, Interaction } from 'discord.js'
import Commands from '../Commands'
import executeCommand from '../utils/commands'

// Slash command validation
const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction,
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.data.name === interaction.commandName)
  if (!slashCommand) {
    interaction.followUp({ content: 'Hm, I do not understand this command.' })
    return
  }

  await interaction.deferReply()
  executeCommand(slashCommand, client, interaction)
}

// Check if the message is a bot command
export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction)
    }
  })
}
