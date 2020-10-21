const professionsWhitelist = [
  'alquimista',
  'campesino',
  'cazador',
  'escultomago',
  'escultor',
  'fabricamago',
  'fabricante',
  'forjamago',
  'herrero',
  'joyero',
  'joyeromago',
  'leñador',
  'manitas',
  'minero',
  'pescador',
  'sastre',
  'sastremago',
  'zapatero',
  'zapateromago'
]

const allowedProfession = (data, whitelist) => {
  let result
  data.forEach(profession => {
    const allowed = whitelist.includes(profession.name)
    if (!allowed) {
      result = {
        allowed,
        profession: profession.name
      }
      return
    }

    result = {
      allowed,
      profession: profession.name
    }
  })
  return result
}

const noData = data => {
  if (data === null || !data.length) {
    return true
  }

  return false
}

const formatIncomingData = data => {
  return data.map(item => item.toLowerCase())
}

const formatMemberData = member => ({ nickname: member.nickname, id: member.id })

const formatProfessionsData = professions => {
  return professions.map(profession => {
    const temp = profession.split(':')
    return { name: temp[0], level: temp[1] }
  })
}

module.exports = {
  professionsWhitelist,
  noData,
  formatIncomingData,
  allowedProfession,
  formatMemberData,
  formatProfessionsData
}
