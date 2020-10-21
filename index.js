const Discord = require('discord.js')
const config = require('./config.json')

const client = new Discord.Client()
const PREFIX = '!'

const userCommands = require('./src/commands')
const { Job, Member } = require('./src/utils/db')

client.once('ready', () => {
  Member.sync()
  Job.sync()
})

client.on('message', message => {
  if (message.author.bot) return

  if (!message.content.startsWith(PREFIX)) return

  const commandBody = message.content.slice(PREFIX.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()

  userCommands.help(command, message)
  userCommands.registerProfessions(command, message, args)
  userCommands.updateProfession(command, message, args)
  userCommands.getProfessions(command, message, args)
})

client.login(config.BOT_TOKEN)
