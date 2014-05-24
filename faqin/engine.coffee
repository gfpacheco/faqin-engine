class faqin.Engine
  @defaultOptions:
    fps: 30
    solids: []

  constructor: (options) ->
    deepExtend this, clone(@constructor.defaultOptions), options

    @viewport ?= new faqin.Viewport
      x: 0,
      y: 0,
      width: @canvas.width,
      height: @canvas.height

    @canvasContext = @canvas.getContext('2d')

  simulate: =>
    currentFrame = Date.now()
    deltaTime = (currentFrame - @lastFrame) / 1000
    @fps = 1 / deltaTime
    @lastFrame = currentFrame
    for solid in @solids
      solid.velocity.y += solid.gravity * deltaTime if solid.gravity
      solid.x += solid.velocity.x * deltaTime
      solid.y += solid.velocity.y * deltaTime

    for i in [0..@solids.length - 2]
      solid = @solids[i]
      for j in [i + 1..@solids.length - 1]
        solid2 = @solids[j]
        @handleCollision solid, solid2 if solid.moving() || solid2.moving()

    @viewport.update()

  handleCollision: (solid1, solid2) =>
    if solid1 instanceof faqin.Rect
      if solid2 instanceof faqin.Rect
        if @checkRectVsRect solid1, solid2
          solid1.dispatchEvent new Event 'collide',
            solid1: solid2
          solid2.dispatchEvent new Event 'collide',
            solid1: solid1

  checkRectVsRect: (rect1, rect2) =>
    !(rect1.x + (rect1.width * 0.5) < rect2.x - (rect2.width * 0.5) ||
      rect1.x - (rect1.width * 0.5) > rect2.x + (rect2.width * 0.5) ||
      rect1.y + (rect1.height * 0.5) < rect2.y - (rect2.height * 0.5) ||
      rect1.y - (rect1.height * 0.5) > rect2.y + (rect2.height * 0.5))

  resolveCollision: (solid1, solid2) =>
    # TODO actually calculate normal
    normal = new faqin.Vector 0, 1

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
    scale = new faqin.Vector @canvas.width / @viewport.width, @canvas.height / @viewport.height

    for solid in @solids
      if solid.fill instanceof faqin.Bitmap
        # TODO
      else
        if solid instanceof faqin.Rect
          @drawRect (solid.x - (solid.width * 0.5) - @viewport.x) * scale.x + 0.5,
            (solid.y - (solid.height * 0.5) - @viewport.y) * scale.y + 0.5,
            solid.width * scale.x,
            solid.height * scale.y,
            solid.fill

    if @debug
      @drawDebug solid, scale for solid in @solids
      @drawText Math.floor(@fps), @canvas.width / 2, 10, '10px Arial', '#000'

  drawDebug: (solid, scale) =>
    moving = solid.moving()

    if solid instanceof faqin.Rect
      @drawRect (solid.x - (solid.width * 0.5) - @viewport.x) * scale.x + 0.5,
        (solid.y - (solid.height * 0.5) - @viewport.y) * scale.y + 0.5,
        solid.width * scale.x,
        solid.height * scale.y,
        if moving then 'rgba(255, 0, 0, .3)' else 'rgba(0, 255, 0, .3)',
        if moving then 'rgba(255, 0, 0, .7)' else 'rgba(0, 255, 0, .7)'

  prepareContext: (fill, stroke, strokeWidth) =>
    if fill
      @canvasContext.fillStyle = fill

    if stroke
      @canvasContext.strokeStyle = stroke
      @canvasContext.lineWidth = strokeWidth || 1

  drawRect: (x, y, width, height, fill, stroke, strokeWidth) =>
    @prepareContext fill, stroke, strokeWidth

    if fill
      @canvasContext.fillRect x, y, width, height

    if stroke
      @canvasContext.strokeRect x, y, width, height

  drawText: (text, x, y, font, fill, stroke, strokeWidth) =>
    @prepareContext fill, stroke, strokeWidth

    if font
      @canvasContext.font = font

    x -= @canvasContext.measureText(text).width / 2

    if fill
      @canvasContext.fillText text, x, y

    if stroke
      @canvasContext.strokeText text, x, y

  start: =>
    @lastFrame = Date.now()
    @updateInterval = setInterval =>
        @update()
      , 1000 / @fps

  pause: =>
    clearInterval @updateInterval

  update: =>
    @simulate();
    @render();
