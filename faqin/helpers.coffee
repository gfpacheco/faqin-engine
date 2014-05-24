deepExtend = (object, extenders...) ->
  return {} if not object?

  for other in extenders
    for own key, val of other
      if not object[key]? or typeof val isnt 'object'
        object[key] = val
      else
        object[key] = deepExtend object[key], val

  object

clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj

  if obj instanceof Date
    return new Date(obj.getTime())

  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags)

  newInstance = new obj.constructor()

  for key of obj
    newInstance[key] = clone obj[key]

  newInstance
