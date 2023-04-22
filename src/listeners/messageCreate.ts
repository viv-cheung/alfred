import { Client, Message } from 'discord.js'
import Commands from '../Commands'

// Text command validation
const handleTextCommand = async (client: Client, message: Message): Promise<void> => {
  console.log({message})
  if (!message.content.startsWith('!$!$!$')) return

  console.log('1')

  const commandName = message.content.slice(1).trim().split(/ +/).shift()
    ?.toLowerCase()
  const textCommand = Commands.find((c) => c.data.name === commandName)

  console.log('2')


  if (!textCommand) {
    message.reply('An error has occurred')
    return
  }

  console.log('3')


  console.log(message)
  console.log(Commands.map(c => c.data.name))

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
