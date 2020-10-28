const utils = require('../utils')
const commands = require('./constants').commands
const MESSAGES = require('../messages.json')

const { Job, Member } = require('../utils/db')

/**
 *
 * It allows to update a job for a existing on the member
 *
 * @param {String} command - the user command
 * @param {Object} message - the discord message object
 * @param {Object} [data=null] - arguments
 */
async function deleteRegister(command, message, data = null) {
  // Check the correct command
  if (command === commands.deleteRegister) {
    const roles = message.member.roles.cache
    if (!utils.isMember(roles, message.member)) {
      message.reply(MESSAGES.ERRORS.NO_MEMBER)
      return
    }

    if (!utils.isAdmin) {
      message.reply(MESSAGES.ERRORS.NO_ADMIN)
      return
    }

    // If not member, create and add jobs
    if (utils.noData(data)) {
      message.reply(MESSAGES.ERRORS.NO_DATA)
      return
    }

    // Bootstrap data
    data = data.map(arg => arg.toLowerCase())

    try {
      const member = await Member.findOne({ where: { nickname: data[0] } })
      const jobs = await Job.findAll({ where: { MemberId: member.dataValues.id } })
      jobs.forEach(async job => {
        await job.destroy()
      })
      await member.destroy()
      message.reply('Entrada removida')
      // Update the job
    } catch (error) {
      console.log(error)
      message.reply(MESSAGES.ERRORS.NOT_FINISHED)
    }
  }
}

module.exports = deleteRegister
