import { ChatInputCommandInteraction, Client } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Configuration, OpenAIApi } from 'openai'
import { getOctokit, createIssue, getRepositoryLabels } from '../utils/github'
import { AlfredGithubConfig, GPT_API_KEY } from '../config/config'
import LabelsPrompt from '../prompts/LabelsPrompt'
import openAISettings from '../config/openAISettings'
import { AlfredResponse } from '../types/AlfredResponse'

// TEMPORARY SETTINGS
const OWNER = 'viv-cheung'
const REPO = 'alfred'

// Setup
const configuration = new Configuration({ apiKey: GPT_API_KEY })
const openai = new OpenAIApi(configuration)
const octokit = getOctokit(AlfredGithubConfig)

// Command
const createIssueCommandData = new SlashCommandBuilder()
  .setName('create-issue-manual')
  .setDescription('Create a GitHub issue')
  .addStringOption((option) => option
    .setName('title')
    .setDescription('The title of the issue')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('content')
    .setDescription('The body of the issue')
    .setRequired(true))
  .addBooleanOption((option) => option
    .setName('ai-labels')
    .setDescription('Let Alfred label the ticket?'))

// Command to let the bot create a ticket
export default {
  data: createIssueCommandData,
  execute: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const title = interaction.options.getString('title')
    const body = interaction.options.getString('content')
    const aiLabels = interaction.options.getBoolean('ai-labels') ?? true

    // Labels proposed by Alfred
    let proposedLabels: string[] | undefined

    if (aiLabels) {
      // Get Repository labels + definitions for auto-labeling
      const labels = await getRepositoryLabels(await octokit, OWNER, REPO)
      const alfredResponse = (await openai.createChatCompletion({
        messages: [
          { role: 'system', content: 'You will assign labels for the following github issue:' },
          { role: 'user', content: `${title}: ${body}` },
          { role: 'system', content: LabelsPrompt },
          { role: 'system', content: labels },
          { role: 'system', content: 'Reply with RFC8259 compliant JSON with a field called "labels"' },
        ],
        ...openAISettings,
      } as any)).data.choices[0].message?.content.toString()

      // Don't throw if smart labeling failed
      try {
        proposedLabels = (JSON.parse(alfredResponse!) as AlfredResponse).labels
      } catch (e) {
        console.log(`Can't assign labels: ${e}`)
      }
    }

    // Create ticket
    const url = await createIssue(await octokit, OWNER, REPO, title!, body!, proposedLabels)

    // Send info back to discord
    interaction.followUp({
      content:
          `**${title}**\n`
          + `:link: ${url}\n`
          + `:label: ${proposedLabels ?? ''}\n`
          + `\`\`\`${body}\`\`\``,
      ephemeral: false,
    })
  },
}
