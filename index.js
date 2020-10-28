const Discord = require('discord.js')
const http = require('http')

const client = new Discord.Client()
const PREFIX = '!'

const userCommands = require('./src/commands')
const { Job, Member } = require('./src/utils/db')

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('ok')
})
server.listen(3000)

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
  userCommands.deleteRegister(command, message, args)
})

client.login(process.env.BOT_TOKEN)
