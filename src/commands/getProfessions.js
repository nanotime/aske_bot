const utils = require('../utils')
const commands = require('./constants').commands
const MESSAGES = require('../messages.json')
const { Job, Member } = require('../utils/db')

async function getProfessions(command, message, data = null) {
  if (command === commands.professions) {
    try {
      if (utils.noData(data)) {
        const jobs = await Job.findAll()
        if (!jobs.length) {
          message.reply('No Pude encontrar nada')
          return
        }

        const list = await Promise.all(jobs.map(async job => {
          const member = await Member.findOne({ where: { id: job.MemberId } })
          return { name: job.name, level: job.level, member: member.dataValues.nickname }
        }))

        message.reply(MESSAGES.GET.FOUND)

        utils.professionsWhitelist.forEach(job => {
          const tempJobList = list.filter(item => item.name === job)
          const jobList = utils.reduceJobs(tempJobList)
          jobList.forEach(item => {
            message.channel.send(`**${item.name}** \n`)
            item.jobs.forEach(el => message.channel.send(`_${el.member}_ -> ${el.level}\n`))
          })
        })
        return
      } else {
        data = data.map(arg => arg.toLowerCase())

        const query = {
          where: { name: data[0] }
        }
        const jobs = await Job.findAll(query)
        const list = await Promise.all(jobs.map(async job => {
          const member = await Member.findOne({ where: { id: job.MemberId } })
          return { level: job.level, member: member.dataValues.nickname }
        }))

        message.reply(`He aquí todos los oficios para: **${data[0]}**\n`)
        list.forEach(item => message.channel.send(`_${item.member}_ -> ${item.level}\n`))
      }
    } catch (error) {
      console.log(error)
      message.reply('No Pude encontrar nada')
    }
  }
}

module.exports = getProfessions
