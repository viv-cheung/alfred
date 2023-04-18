import dotenv from 'dotenv'

dotenv.config()

export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
export const GPT_API_KEY = process.env.GPT_API_KEY || ''

// Alfred configs
const ALFRED_APP_ID = Number(process.env.ALFRED_APP_ID) || 0
const ALFRED_GITHUB_INSTALLATION_ID = Number(process.env.ALFRED_GITHUB_INSTALLATION_ID) || 0
const ALFRED_CLIENT_ID = process.env.ALFRED_CLIENT_ID || ''
const ALFRED_CLIENT_SECRET = process.env.ALFRED_CLIENT_SECRET || ''
const ALFRED_GITHUB_PK = process.env.ALFRED_GITHUB_PK || ''

export const AlfredConfig = {
  appId: ALFRED_APP_ID,
  installationId: ALFRED_GITHUB_INSTALLATION_ID,
  clientID: ALFRED_CLIENT_ID,
  clientSecret: ALFRED_CLIENT_SECRET,
  privateKey: ALFRED_GITHUB_PK,
}
