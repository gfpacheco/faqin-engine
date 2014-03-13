class fuckin.Engine
  defaultOptions:
    fps: 30
    solids: []

  constructor: (options) ->
    deepExtend this, @defaultOptions, options

    @viewport ?= new fuckin.Viewport
      x: 0,
      y: 0,
      width: @canvas.width,
      height: @canvas.height

    @canvasContext = @canvas.getContext('2d')

  simulate: =>
    for solid in @solids
      solid.velocity.y += solid.gravity / @fps if solid.gravity
      solid.x += solid.velocity.x
      solid.y += solid.velocity.y

    for solid, i in @solids
      for j in [i + 1..@solids.length]
        solid2 = @solids[j]
        @handleCollision solid, solid2 if solid.moving() || solid2.moving()

    @viewport.update()

  handleCollision: (solid1, solid2) =>
    if solid1 instanceof fuckin.Rect
      if solid2 instanceof fuckin.Rect
        if @checkRectVsRect solid1, solid2
          solid1.dispatchEvent new Event 'collide',
            solid1: solid2
          solid2.dispatchEvent new Event 'collide',
            solid1: solid1

  checkRectVsRect: (rect1, rect2) =>
    !(rect1.x + (rect1.width * 0.5) < rect2.x ||
      rect1.x > rect2.x + (rect2.width * 0.5) ||
      rect1.y + (rect1.height * 0.5) < rect2.y ||
      rect1.y > rect2.y + (rect2.height * 0.5))

  resolveCollision: (solid1, solid2) =>
    # TODO actually calculate normal
    normal = new fuckin.Vector 0, 1

    velocityAlongNormal = solid2.velocity.sub(solid1.velocity).dot normal
    return if velocityAlongNormal > 0

    e = Math.min solid1.restitution, solid2.restitution
    j = (-(1 + e) * velocityAlongNormal) / (solid11.inverseMass + solid2.inverseMass)

    normal.multiply j, true

    solid1.addImpulse normal.multiply(solid1.inverseMass).invert true
    solid2.addImpulse normal.multiply(solid2.inverseMass)

  render: =>
    @canvasContext.save()
    @canvasContext.setTransform 1, 0, 0, 1, 0, 0
    @canvasContext.clearRect 0, 0, @canvas.width, @canvas.height
    @canvasContext.restore()

    # TODO cache scale until viewport size changes
    scale = new fuckin.Vector @canvas.width / @viewport.width, @canvas.height / @viewport.height

    for solid in @solids
      if solid.fill instanceof fuckin.Bitmap
        # TODO
      else
        if solid instanceof fuckin.Rect
          @drawRect (solid.x - @viewport.x) * scale.x + 0.5,
            (solid.y - @viewport.y) * scale.y + 0.5,
            solid.width * scale.x,
            solid.height * scale.y,
            solid.fill

    @drawDebug solid for solid in solids if @debug

  drawDebug: (solid) =>
    moving = solid.moving()

    if solid instanceof fuckin.Rect
      @drawRect solid.x + .5,
        solid.y + .5,
        solid.width,
        solid.height,
        moving? 'rgba(255, 0, 0, .2)' : 'rgba(0, 255, 0, .2)',
        moving? 'rgba(255, 0, 0, .5)' : 'rgba(0, 255, 0, .5)'

  drawRect: (x, y, width, height, fill, stroke, strokeWidth) =>
    if fill
      @canvasContext.fillStyle = fill
      @canvasContext.fillRect x, y, width, height

    if stroke
      @canvasContext.strokeStyle = stroke
      @canvasContext.lineWidth = strokeWidth || 1
      @canvasContext.strokeRect x, y, width, height

  start: =>
    @updateInterval = setInterval =>
        @update()
      , 1000 / @fps

  pause: =>
    clearInterval @updateInterval

  update: =>
    @simulate();
    @render();
