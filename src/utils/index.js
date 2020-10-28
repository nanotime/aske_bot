const ROLES_WHITELIST = ['Mando', 'Consejo', 'Agente']
const ADMIN_ROLES = ['Mando', 'Consejo']

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

const isValidLevel = level => {
  level = Number(level)

  if (level > 200 || level < 0) {
    return false
  }

  if (typeof level !== 'number' || isNaN(level)) {
    return false
  }

  return true
}

const allowedProfession = (data, whitelist) => {
  let result
  data.forEach(profession => {
    const allowed = whitelist.includes(profession.name)
    if (!isValidLevel(profession.level)) {
      result = false
      return
    }

    if (!allowed) {
      result = false
      return
    }

    result = true
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

const formatMemberData = member => ({ nickname: member.nickname.toLowerCase(), id: member.id })

const formatProfessionsData = professions => {
  return professions.map(profession => {
    const temp = profession.split(':')
    return { name: temp[0], level: temp[1] }
  })
}

const uniqByKeepLast = (data, key) => {
  return [
    ...new Map((
      data.map(x => [key(x), x])
    )).values()
  ]
}

const reduceJobs = jobs => {
  const reduced = jobs.reduce((acc, cur, idx, src) => {
    const data = {
      jobs: src
        .filter(item => item.name === cur.name)
        .map(({ level, member }) => ({ level, member })),
      name: cur.name
    }
    acc.push(data)
    const clean = uniqByKeepLast(acc, it => it.name)
    return clean
  }, [])
  return reduced
}

const isMember = (roles, member) => {
  const haveRole = roles.some(role => ROLES_WHITELIST.includes(role.name))
  const haveNickname = member.nickname
  return haveRole && haveNickname
}

const isAdmin = roles => {
  return roles.includes(ROLES_WHITELIST[0]) || roles.includes(ROLES_WHITELIST[1])
}

module.exports = {
  professionsWhitelist,
  noData,
  formatIncomingData,
  allowedProfession,
  formatMemberData,
  formatProfessionsData,
  reduceJobs,
  isMember,
  isAdmin
}
