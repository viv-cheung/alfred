import {
  CommandInteraction, Client, Message, SlashCommandBuilder,
} from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import { GPT_API_KEY } from '../config/config'
import ticketCreatorPrompt from '../prompts/TicketCreatorPrompt'
import openAISettings from '../config/openAISettings'

/*  ******SETTINGS****** */
// Number of messages to send to ChatGPT for context
// The messages will be from the most recent messages (e.i last 25 messages)
const N_LAST_MESSAGES_TO_READ = 25

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function generateGitHubTicket(conversation: string) {
  if (conversation.trim().length === 0) {
    throw new Error('Please enter valid information or conversation')
  }

  try {
    const completion = await openai.createChatCompletion({
      messages: [
        { role: 'system', content: `${ticketCreatorPrompt}` },
        { role: 'user', content: `${conversation}` },
      ],
      ...openAISettings,
    } as any)

    return completion.data.choices[0].message?.content.toString()
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
    }

    return 'error occured'
  }
}

const generateTicketCommandData = new SlashCommandBuilder()
  .setName('generate-ticket-summary')
  .setDescription('Generate a GitHub Ticket')

// Command to generate a GitHub Ticket
export default {
  data: generateTicketCommandData,
  execute: async (client: Client, interaction: CommandInteraction) => {
    // Find the channel where the conversation took place
    const channel = await client.channels.cache.get(interaction.channelId)

    if (channel && channel.isTextBased()) {
      // Fetch the messages in the channel and concatenate them into a single string
      const messages = await channel.messages.fetch({ limit: N_LAST_MESSAGES_TO_READ })
      let conversation = ''
      messages.reverse().forEach((message: Message<true> | Message<false>) => {
        conversation += `${message.author.username} : ${message.content} \n `
      })
      // Pass the messages from Discord to ChatGPT to create a response
      // based on the generateGitHubTicket prompt
      const alfredResponse = await generateGitHubTicket(conversation)

      await interaction.followUp({
        ephemeral: true,
        content: alfredResponse,
      })
    }
  },
}
