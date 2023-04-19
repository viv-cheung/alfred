import dotenv from 'dotenv'
import getEnvParameter from '../utils/config'

dotenv.config()

export const DISCORD_BOT_TOKEN = getEnvParameter('DISCORD_BOT_TOKEN')
export const GPT_API_KEY = getEnvParameter('GPT_API_KEY')

// Alfred configs
const ALFRED_APP_ID = Number(getEnvParameter('ALFRED_APP_ID'))
const ALFRED_GITHUB_INSTALLATION_ID = Number(getEnvParameter('ALFRED_GITHUB_INSTALLATION_ID'))
const ALFRED_CLIENT_ID = getEnvParameter('ALFRED_CLIENT_ID')
const ALFRED_CLIENT_SECRET = getEnvParameter('ALFRED_CLIENT_SECRET')
const ALFRED_GITHUB_PK = getEnvParameter('ALFRED_GITHUB_PK')

export const AlfredConfig = {
  appId: ALFRED_APP_ID,
  installationId: ALFRED_GITHUB_INSTALLATION_ID,
  clientID: ALFRED_CLIENT_ID,
  clientSecret: ALFRED_CLIENT_SECRET,
  privateKey: ALFRED_GITHUB_PK,
}
