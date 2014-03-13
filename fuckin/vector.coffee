class fuckin.Vector
  constructor: (x, y) ->
    @x = x || 0
    @y = y || 0

  dot: (vector) =>
    return (@x * vector.x) + (@y * vector.y)

  add: (vector, self) =>
    if self
      @x += vector.x
      @y += vector.y
      return this
    else
      return new fuckin.Vector @x + vector.y, @y + vector.y

  sub: (vector, self) =>
    if self
      @x -= vector.x
      @y -= vector.y
      return this
    else
      return new fuckin.Vector @x - vector.y, @y - vector.y

  invert: (self) =>
    if self
      @x = -@x
      @y = -@y
      return this
    else
      return new fuckin.Vector -@x, -@y

  multiply: (scalar, self) =>
    if self
      @x *= scalar
      @y *= scalar
      return this
    else
      return new fuckin.Vector @x * scalar, @y * scalar

  distance: (vector) =>
    return Math.sqrt Math.pow(@x - vector.x, 2) + Math.pow(@y - vector.y, 2)
