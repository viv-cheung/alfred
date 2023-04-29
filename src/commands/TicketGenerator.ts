import {
  CommandInteraction, Client, Message, SlashCommandBuilder,
} from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import { GPT_API_KEY, AlfredConfig } from '../config/config'
import TicketCreatorPrompt from '../prompts/TicketCreatorPrompt'
import openAISettings from '../config/openAISettings'
import { getOctokit, createIssue, getRepositoryLabels } from '../utils/github'
import LabelsPrompt from '../prompts/LabelsPrompt'
import PreConversationPrompt from '../prompts/PreConversationPrompt'

/*  ******SETTINGS****** */
// Number of messages to send to ChatGPT for context
// The messages will be from the most recent messages (e.i last 25 messages)
const N_LAST_MESSAGES_TO_READ = 4
// TEMPORARY SETTINGS
const OWNER = 'viviankc'
const REPO = 'gtc'

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
})
const openai = new OpenAIApi(configuration)
let count: number = 0
const octokit = getOctokit(AlfredConfig)

async function generateAlfredResponse(conversation: string) {
  if (conversation.trim().length === 0) {
    throw new Error('Please enter valid information or conversation')
  }

  try {
    const labels = await getRepositoryLabels(await octokit, OWNER, REPO)
    const completion = await openai.createChatCompletion({
      messages: [
        { role: 'system', content: `${TicketCreatorPrompt}` },
        { role: 'system', content: `${LabelsPrompt}` },
        { role: 'system', content: `${labels}` },
        { role: 'system', content: `${PreConversationPrompt}` },
        { role: 'user', content: `${conversation}` },
      ],
      ...openAISettings,
    } as any)
    return completion.data.choices[0].message?.content.toString()
  } catch (error) {
    console.error(`Error reaching openAI: ${error}`)
    throw new Error(`Error reaching openAI: ${error}`)
  }
}

function isResponseParseableToJSON(alfredResponse:string | undefined) {
  if (alfredResponse && JSON.parse(alfredResponse) !== undefined) {
    return JSON.parse(alfredResponse)
  }
  throw new Error("Alfred's response is not in a JSON format")
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
      // based on the generateAlfredResponse prompt
      const alfredResponse = await generateAlfredResponse(conversation)
      let alfredResponseObject = isResponseParseableToJSON(alfredResponse)

      // If additional information is required from the user, Alfred
      // will ask some questions to the user before creating the ticket
      while (alfredResponseObject.response_to_user !== 'I have all the information needed!' && count < 4) {
        let response = ''
        count++

        await channel.send(alfredResponseObject.response_to_user)

        // define message filter function
        const filter = (msg: any) => msg.author.id === interaction.user.id

        try {
          const responseMessage = await channel.awaitMessages({
            filter, max: 1, time: 40000, errors: ['time'],
          })

          response = responseMessage?.first()?.content || ''
          conversation += `${responseMessage?.first()?.author.username || 'User response'}: ${response} `

          const alfredResponseWithAdditionalInformation = await generateAlfredResponse(conversation)
          alfredResponseObject = isResponseParseableToJSON(alfredResponseWithAdditionalInformation)
        } catch (error) {
          // handle any errors thrown during message waiting
          throw new Error(`Tried to receive response from user, but I got this error: ${error}`)
        }
      }

      count = 0

      // Create github ticket using alfred's response
      const url = await createIssue(
        await octokit,
        OWNER,
        REPO,
        alfredResponseObject.title,
        alfredResponseObject.body,
        alfredResponseObject.labels,
      )

      await interaction.followUp({
        ephemeral: true,
        content: `
        Title:
        ${alfredResponseObject?.title}
        Issue: ${alfredResponseObject?.body} 
        Labels: ${alfredResponseObject?.labels}
        Feedback: ${alfredResponseObject?.response_to_user} 
        Github ticket logged here: ${url}`,
      })
    }
  },
}
