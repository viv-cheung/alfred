import { Command } from './types/Command'
import Ping from './commands/Ping'
import TicketGenerator from './commands/TicketGenerator'
import CreateIssue from './commands/CreateIssue'
import Summarize from './commands/Summarize'

// List of all commands available to the bot
export default [CreateIssue, Ping, TicketGenerator, Summarize] as Command[]
