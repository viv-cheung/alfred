import { CommandInteraction, Client, Interaction } from 'discord.js'
import Commands from '../Commands'

// Slash command validation
const handleSlashCommand = async (
  interaction: CommandInteraction,
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.data.name === interaction.commandName)
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' })
    return
  }

  await interaction.deferReply()
  slashCommand.execute(interaction)
}

// Check if the message is a bot command
export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(interaction)
    }
  })
}
