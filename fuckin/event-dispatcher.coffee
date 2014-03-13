class fuckin.EventDispatcher
  constructor: ->
    @registrations = {}

  getListeners: (type, useCapture) =>
    captype = (useCapture? '1' : '0') + type
    @registrations[captype] = [] unless captype of @registrations
    @registrations[captype]

  addEventListener: (type, listener, useCapture) =>
    listeners = @getListeners(type, useCapture)
    listeners.push listener if listener not in listeners
    return this

  removeEventListener: (type, listener, useCapture) =>
    listeners = @getListeners(type, useCapture)
    ix = listeners.indexOf(listener)
    listeners.splice ix, 1 if ix isnt -1
    return this

  dispatchEvent: (event) =>
    listeners = @getListeners(event.type, false).slice()
    listener.call this, event for listener in listeners
    not event.defaultPrevented
