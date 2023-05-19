import {
  Client, Message, SlashCommandBuilder, ChatInputCommandInteraction, ThreadChannel,
} from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import { GPT_API_KEY, AlfredGithubConfig } from '../config/config'
import openAISettings from '../config/openAISettings'
import { getOctokit, createIssue, getRepositoryLabels } from '../utils/github'
import LabelsPrompt from '../prompts/LabelsPrompt'
import PreConversationPrompt from '../prompts/PreConversationPrompt'
import {
  getMessageFromURL, mentionUser, replaceMessageUrls, replyOrFollowup, waitForUserResponse,
} from '../utils/discord'
import { AlfredResponse } from '../types/AlfredResponse'
import AlfredRolePrompt from '../prompts/AlfredRolePrompt'
import TicketRulesPrompt from '../prompts/TicketRulesPrompt'
import { addConversation } from '../utils/openai'

/*  ******SETTINGS****** */
const COUNT_QUESTION_LIMIT = 4 // Number of questions Alfred can ask
const CONVERSATION_WORD_LIMIT = 1500 // Maximum number of words in conversation
const TIMEOUT_WAITING_FOR_RESPONSE_LIMIT = 60000 // Time user has to reply to a question
const USER_RESPONSE_COUNT_LIMIT = 1 // How many answers does Alfred wait for

// TEMPORARY SETTINGS
const OWNER = 'viv-cheung'
const REPO = 'alfred'

// Setup
const config = new Configuration({ apiKey: GPT_API_KEY })
const openai = new OpenAIApi(config)
const octokit = getOctokit(AlfredGithubConfig)

// Core function
async function generateAlfredResponse(discordClient: Client, conversation: string) {
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

  // Get Repository labels + definitions for auto-labeling
  const labels = await getRepositoryLabels(await octokit, OWNER, REPO)

  // Send all to chat GPT
  const completion = await openai.createChatCompletion({
    messages: [
      { role: 'system', content: AlfredRolePrompt },
      { role: 'system', content: PreConversationPrompt },
      { role: 'user', content: noURLconversation },
      { role: 'system', content: TicketRulesPrompt },
      { role: 'system', content: LabelsPrompt },
      { role: 'system', content: labels },
    ],
    ...openAISettings,
  } as any)
  const alfredResponse = completion.data.choices[0].message?.content.toString()

  if (alfredResponse) {
    return JSON.parse(alfredResponse) as AlfredResponse
  }
  throw new Error('GPT response is unfortunately empty. Troubled servers perhaps?')
}

// Build command
const generateTicketCommandData = new SlashCommandBuilder()
  .setName('create-issue-ai')
  .setDescription('Alfred will read conversation and create a ticket')
  .addStringOption((option) => option
    .setName('first_message')
    .setDescription('URL of the first message Alfred should start from')
    .setRequired(true))

// Command to generate a GitHub Ticket
export default {
  data: generateTicketCommandData,
  execute: async (discordClient: Client, interaction: ChatInputCommandInteraction) => {
    let questionCount: number = 0 // Number of questions alfred asks
    let responseThread: ThreadChannel | undefined

    // Get the first message to start from (the Original Post)
    const op = await getMessageFromURL(discordClient, interaction.options.getString('first_message'))

    // Find the channel where the conversation took place
    const channel = await discordClient.channels.cache.get(interaction.channelId)

    if (channel && channel.isTextBased()) {
      // Start the conversation with the OP
      let conversation = addConversation(op)

      // Fetch the messages in the channel after OP and concatenate them
      const messages = await channel.messages.fetch({ after: op.id })
      messages.reverse().forEach((message: Message<true> | Message<false>) => {
        conversation += addConversation(message)
      })

      // Pass the messages from Discord to GPT model to create a response
      let alfredResponse = await generateAlfredResponse(discordClient, conversation)

      // If additional information is required from the user, Alfred will ask some questions to
      // the user before creating the ticket, up to a point. To not pollute main channels,
      // Alfred will create a thread to inquire further information.
      while (alfredResponse.response_to_user !== 'I have all the information needed!' && questionCount < COUNT_QUESTION_LIMIT) {
        await replyOrFollowup(
          interaction,
          questionCount > 1,
          {
            ephemeral: true,
            content: `${mentionUser(interaction.user.id)} ${alfredResponse.response_to_user}`,
          },
          responseThread,
        )

        // Listen for user response in channel or thread
        const responseMessage = await waitForUserResponse(
          interaction.user.id,
          USER_RESPONSE_COUNT_LIMIT,
          TIMEOUT_WAITING_FOR_RESPONSE_LIMIT,
          channel,
          responseThread,
        )

        if (!responseMessage || responseMessage.size === 0) {
          throw new Error('The waiting period for the response has timed out.')
        }

        // Append new response from user to conversation sent to GPT
        conversation += `Alfred (you): ${alfredResponse.response_to_user}\n`
        conversation += addConversation(responseMessage?.first()!)
        alfredResponse = await generateAlfredResponse(discordClient, conversation)

        // Will make a thread for remaining interactions
        if (!responseThread) {
          responseThread = await responseMessage.last()?.startThread({
            name: 'Alfred inquiries',
            autoArchiveDuration: 60, // in minutes
          })
        }

        questionCount += 1
      }

      // Create github ticket using alfred's response
      const url = await createIssue(
        await octokit,
        OWNER,
        REPO,
        alfredResponse.title,
        alfredResponse.body,
        alfredResponse.labels,
      )

      await replyOrFollowup(
        interaction,
        questionCount > 1,
        {
          ephemeral: true,
          content:
            `**${alfredResponse.title}**\n`
            + `:link: ${url}\n`
            + `:label: ${alfredResponse.labels}\n`
            + `\`\`\`${alfredResponse.body}\`\`\``,
        },
        responseThread,
      )
    }
  },
}
