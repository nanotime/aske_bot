const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
})

const Member = sequelize.define('Member', {
  nickname: Sequelize.STRING,
  id: {
    primaryKey: true,
    type: Sequelize.STRING
  }
})

const Job = sequelize.define('Job', {
  name: Sequelize.STRING,
  level: {
    type: Sequelize.INTEGER,
    set(value) {
      this.setDataValue('level', value)
    }
  }
})

Member.hasMany(Job)
Job.belongsTo(Member)

module.exports = {
  Member,
  Job
}