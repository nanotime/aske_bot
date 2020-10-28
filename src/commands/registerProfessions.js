const utils = require('../utils')
const commands = require('./constants').commands
const MESSAGES = require('../messages.json')
const { Job, Member } = require('../utils/db')

const { formatMemberData, formatProfessionsData } = require('../utils')

/**
 * registerProfessions
 *
 * It allows to register a new profession/job or update the existing on the member
 *
 * @param {String} command - the user command
 * @param {Object} message - the discord message object
 * @param {Object} [data=null] - arguments
 */
async function registerProfessions(command, message, data = null) {
  // Check the correct command
  if (command === commands.registerProfessions) {
    const roles = message.member.roles.cache
    if (!utils.isMember(roles, message.member)) {
      message.reply(MESSAGES.ERRORS.NO_MEMBER)
      return
    }
    // TODO: check the level arg and ensure that is not grether than 200
    // Check if there is no args
    if (utils.noData(data)) {
      message.reply(MESSAGES.ERRORS.NO_DATA)
      return
    }

    // Normalize data
    data = data.map(arg => arg.toLowerCase())
    // Bootstrap the data
    const memberData = formatMemberData(message.member)
    const jobs = formatProfessionsData(data)

    // Check if the args in professions are alowes
    const isAllowedProfession = utils.allowedProfession(jobs, utils.professionsWhitelist)

    if (!isAllowedProfession) {
      message.reply(`${MESSAGES.ERRORS.PROFESSION_NOT_ALLOWED}`)
      return
    }

    try {
      // Check for existing member
      const memberQuery = { where: { id: memberData.id } }
      const member = await Member.findOne(memberQuery)

      // If not member, create and add jobs
      if (!member) {
        const newMember = await Member.create(memberData)

        jobs.forEach(async (job) => {
          await newMember.createJob(job)
        })

        message.reply(MESSAGES.REGISTER.DONE)
        return
      }

      const existingJobsQuery = { where: { MemberId: memberData.id } }

      // Get the existing jobs and create a joblist
      const existingJobs = await Job.findAll(existingJobsQuery)
      const jobList = existingJobs.map(job => job.dataValues.name)

      // If the joblist doesn't includes one of the jobs in the args, add it to the Member.
      jobs.forEach(async (job) => {
        if (!jobList.includes(job.name)) {
          const newJob = await Job.create(job)
          newJob.setMember(memberData.id)
        }
      })

      message.reply(MESSAGES.REGISTER.DONE)
    } catch (error) {
      console.log(error, '\n\n\n')
      message.reply(MESSAGES.ERRORS.NOT_FINISHED)
    }
  }
}

module.exports = registerProfessions
