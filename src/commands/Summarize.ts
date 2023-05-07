import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import { getMessageFromURL, replaceMessageUrls } from '../utils/discord'
import { GPT_API_KEY } from '../config/config'
import openAISettings from '../config/openAISettings'
import { addConversation } from '../utils/openai'

/*  ******SETTINGS****** */
const CONVERSATION_WORD_LIMIT = 3000 // Maximum number of words in conversation

// Setup
const config = new Configuration({ apiKey: GPT_API_KEY })
const openai = new OpenAIApi(config)

// Command declaration
const summarizeCommandData = new SlashCommandBuilder()
  .setName('summarize-ai')
  .setDescription('Summarize the key points from a conversation starting with a message URL')
  .addStringOption((option) =>
    option
      .setName('start_message')
      .setDescription('URL of the message to start summarizing from')
      .setRequired(true)
  )

// Will summarize conversations 
async function generateConversationSummary(discordClient: Client, conversation: string) {
  if (conversation.trim().length === 0) {
    throw new Error('Please enter valid information or conversation')
  }

  // Check if conversation is too long for GPT to handle in one call
  if (conversation.split(' ').length > CONVERSATION_WORD_LIMIT) {
    throw new Error(`
        Not able to review the conversation because it exceeds the 
        word limit of ${CONVERSATION_WORD_LIMIT} (${conversation.split(' ').length} words)
    `)
  }

  // Replace discord message urls with their actual message content
  const noURLconversation = await replaceMessageUrls(discordClient, conversation)

  // Send conversation to GPT with a summary prompt
  const completion = await openai.createChatCompletion({
    messages: [
      { role: 'system', content: 'Please summarize the key points from the following conversation:' },
      { role: 'user', content: noURLconversation },
    ],
    ...openAISettings,
  } as any)

  const summary = completion.data.choices[0].message?.content.toString()

  if (summary) {
    return summary
  }
  throw new Error('GPT response is unfortunately empty. Troubled servers perhaps?')
}

export default {
  data: summarizeCommandData,
  execute: async (discordClient: Client, interaction: ChatInputCommandInteraction) => {
    // Get the starting message using the provided URL
    const startMessage = await getMessageFromURL(discordClient, interaction.options.getString('start_message'))

    // Find the channel where the conversation took place
    const channel = await discordClient.channels.cache.get(interaction.channelId)

    if (channel && channel.isTextBased()) {
      // Start the conversation with the starting message
      let conversation = addConversation(startMessage)

      // Fetch the messages in the channel after the starting message and concatenate them
      const messages = await channel.messages.fetch({ after: startMessage.id })
      messages.reverse().forEach((message) => {
        conversation += addConversation(message)
      })

      // Generate a summary of the conversation
      const summary = await generateConversationSummary(discordClient, conversation)

      // Send the summary back to the user
      await interaction.followUp({
        content: `Here's the summary of the conversation:\n\n${summary}`,
        ephemeral: true

      })
    }
  },
}