const commands = {
  registerProfessions: 'registrar-oficios',
  updateProfession: 'actualizar-oficios',
  professions: 'oficios',
  delete: 'borrar',
  help: 'ayuda'
}

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
  if (data === null || !data.length)
    return true

    return false
}

const formatIncomingData = data => {
  return data.map(item => item.toLowerCase())
}

module.exports = {
  noData,
  formatIncomingData,
  professionsWhitelist,
  allowedProfession
}