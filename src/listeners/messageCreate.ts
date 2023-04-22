import { Client, Message } from 'discord.js'
import Commands from '../Commands'

// Text command validation
const handleTextCommand = async (client: Client, message: Message): Promise<void> => {
  const commandPrefix = '!$!$!$'
  if (!message.content.startsWith(commandPrefix)) return

  const commandName = message.content.slice(commandPrefix.length).trim().split(/ +/).shift()
    ?.toLowerCase()

  const textCommand = Commands.find((c) => c.data.name === commandName)

  if (!textCommand) {
    message.reply('An error has occurred')
    return
  }

  textCommand.execute(client, message)
}

// Check if the message is a bot command
export default (client: Client): void => {
  client.on('messageCreate', async (message: Message) => {
    // Only listen to bot
    if (message.author.bot) {
      await handleTextCommand(client, message)
    }
  })
}
