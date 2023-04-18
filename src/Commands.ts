import { Command } from './types/Command'
import Ping from './commands/Ping'
import TicketGenerator from './commands/TicketGenerator'
import CreateIssue from './commands/CreateIssue'

// List of all commands available to the bot
export default [CreateIssue, Ping, TicketGenerator] as Command[]
