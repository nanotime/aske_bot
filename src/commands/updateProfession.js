const utils = require('../utils')
const commands = require('./constants').commands
const MESSAGES = require('../messages.json')
const { Job } = require('../utils/db')
const { formatMemberData, formatProfessionsData } = require('../utils')

/**
 *
 * It allows to update a job for a existing on the member
 *
 * @param {String} command - the user command
 * @param {Object} message - the discord message object
 * @param {Object} [data=null] - arguments
 */
async function updateProfession(command, message, data = null) {
  // Check the correct command
  if (command === commands.updateProfession) {
    if (!message.member.nickname) {
      message.reply(MESSAGES.ERRORS.NO_MEMBER)
      return
    }

    // If not member, create and add jobs
    if (utils.noData(data)) {
      message.reply(MESSAGES.ERRORS.NO_DATA)
      return
    }

    // Bootstrap data
    data = data.map(arg => arg.toLowerCase())
    const memberData = formatMemberData(message.member)
    const jobs = formatProfessionsData(data)

    // Check if the args in professions are alowes
    const isAllowedProfession = utils.allowedProfession(jobs, utils.professionsWhitelist)

    if (!isAllowedProfession.allowed) {
      message.reply(`${MESSAGES.ERRORS.PROFESSION_NOT_ALLOWED} ${isAllowedProfession.profession}`)
      return
    }

    try {
      // Update the job
      jobs.forEach(async (job) => {
        const jobQuery = {
          where: { name: job.name, MemberId: memberData.id }
        }
        Job.update({ level: job.level }, jobQuery)
      })

      message.reply(MESSAGES.UPDATE.DONE)
    } catch (error) {
      console.log(error)
      message.reply(MESSAGES.ERRORS.NOT_FINISHED)
    }
  }
}

module.exports = updateProfession
