const commands = require('./constants').commands
const MESSAGES = require('../messages.json')

function help(command, message) {
  if (command === commands.help) {
    const jobCommandList = MESSAGES.HELP.COMMANDS
      .map(({ name, description }) => {
        return `**${name}**: ${description} \n`
      })

    message.reply(MESSAGES.HELP.BASE)
    jobCommandList.forEach(command => message.channel.send(command))
  }
}

module.exports = help
