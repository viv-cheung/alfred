import dotenv from 'dotenv'

dotenv.config()

export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || ''
export const GPT_API_KEY = process.env.GPT_API_KEY || ''
