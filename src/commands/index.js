const utils = require('../utils')
const commands = require('./constants').commands
const MESSAGES = require('../messages.json')
const { Job, Member } = require('../utils/db')

const formatMemberData = member => ({ nickname: member.nickname, id: member.id }) 
const formatProfessionsData = professions => {
  return professions.map(profession => {
    const temp = profession.split(':')
    return { name: temp[0], level: temp[1] }
  })
}

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
    if (!message.member.nickname) {
      message.reply(MESSAGES.ERRORS.NO_MEMBER)
      return
    }

    // Check if there is no args
    if (utils.noData(data)) {
      message.reply(MESSAGES.ERRORS.NO_DATA)
      return
    }

    // TODO: check if the args jobs are allowed

    // Bootstrap the data
    const memberData = formatMemberData(message.member)
    const jobs = formatProfessionsData(data)

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
    const memberData = formatMemberData(message.member)
    const jobs = formatProfessionsData(data)

    // Check if the args in professions are alowes 
    const isAllowedProfession = utils.allowedProfession(jobs, utils.professionsWhitelist)

    if (!isAllowedProfession.allowed) {
      message.reply(`${MESSAGES.ERRORS.PROFESSION_NOT_ALLOWED}: ${allowedProfession.profession}`)
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

async function getProfessions(command, message, data = null) {
  if (command === commands.professions) {
    try {
      if (utils.noData(data)) {
        const jobs = await Job.findAll()

        const list = jobs.map(async job => {
          const member = Member.findOne({ where: { id: job.MemberId } })
          console.log(member)
          // return member.dataValues.nickname
        })

        console.log(list)

        // const list = jobs.map((job) => {
        //   const data = Member
        //     .findOne({ where: { id: job.MemberId } })
        //     .then(({ nickname }) => {
        //       return { name: job.name, level: job.level, member: nickname }
        //     })

        //     return data
        // })

        // console.log(list)
        message.reply(MESSAGES.GET.FOUND)
        return
      } else {
        message.reply(`He aquí todos los oficios ${data[0]}`)
      }
    } catch (error) {
      console.log(error)
      message.reply('No Pude encontrar nada')
    }
  }
}

module.exports = {
  help,
  updateProfession,
  getProfessions,
  registerProfessions
}