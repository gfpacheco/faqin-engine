class fuckin.Solid extends fuckin.EventDispatcher
  defaultOptions:
    gravity: false
    velocity: new fuckin.Vector
    restitution: 1
    x: 0
    y: 0

  constructor: (options) ->
    deepExtend this, @defaultOptions, options
    super
    @mass ?= @calculateMass()
    @inverseMass = 1 / @mass

  calculateMass: =>
    1

  addImpulse: (impulse) =>
    @velocity.add impulse, true
    this

  moving: =>
    Boolean @velocity.x or @velocity.y
