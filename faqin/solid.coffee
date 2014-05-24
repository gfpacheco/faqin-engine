class faqin.Solid extends faqin.EventDispatcher
  @defaultOptions:
    gravity: false
    velocity: new faqin.Vector
    restitution: 1
    x: 0
    y: 0
    visible: false

  constructor: (options) ->
    deepExtend this, clone(@constructor.defaultOptions), options
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
