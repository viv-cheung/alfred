import dotenv from 'dotenv'
import getEnvParameter from '../utils/config'

dotenv.config()

// Discord bot token
export const DISCORD_BOT_TOKEN = getEnvParameter('DISCORD_BOT_TOKEN')

// OpenAI GPT-4 API key
export const GPT_API_KEY = getEnvParameter('GPT_API_KEY')

// Github configs
const ALFRED_GIT_APP_ID = Number(getEnvParameter('ALFRED_APP_ID'))
const ALFRED_GIT_CLIENT_ID = getEnvParameter('ALFRED_CLIENT_ID')
const ALFRED_GIT_INSTALLATION_ID = Number(getEnvParameter('ALFRED_GITHUB_INSTALLATION_ID'))
const ALFRED_GIT_CLIENT_SECRET = getEnvParameter('ALFRED_CLIENT_SECRET')
const ALFRED_GIT_PK = getEnvParameter('ALFRED_GITHUB_PK')

export const AlfredGithubConfig = {
  appId: ALFRED_GIT_APP_ID,
  installationId: ALFRED_GIT_INSTALLATION_ID,
  clientID: ALFRED_GIT_CLIENT_ID,
  clientSecret: ALFRED_GIT_CLIENT_SECRET,
  privateKey: ALFRED_GIT_PK,
}
