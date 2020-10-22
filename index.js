const http = require('http')
const express = require('express')
const app = express()
const Discord = require('discord.js')

// Keep glitch.io app alive
app.get('/', (request, response) => {
  console.log(Date.now() + ' Ping Received')
  response.sendStatus(200)
})

app.listen(process.env.PORT)
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000)

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

client.login(process.env.BOT_TOKEN)
