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
    if (!utils.isMember(roles)) {
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
      const memberToDelete = await Member.findOne({ where: { ninckname: data[0] } })
      const idToDestroy = memberToDelete.dataValues.id
      await Job.destroy({ where: { MemberId: idToDestroy } })
      message.reply(`He removido los oficios de ${memberToDelete.dataValues.ninckname}`)
      // Update the job
    } catch (error) {
      console.log(error)
      message.reply(MESSAGES.ERRORS.NOT_FINISHED)
    }
  }
}

module.exports = deleteRegister
