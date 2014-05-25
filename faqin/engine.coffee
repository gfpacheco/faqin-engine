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
        @testCollision solid, solid2 if solid.moving() || solid2.moving()

    @viewport.update()

  testCollision: (solid1, solid2) =>
    if solid1 instanceof faqin.Rect
      if solid2 instanceof faqin.Rect
        if @checkRectVsRect solid1, solid2
          event = new Event 'collide'
          event.solid = solid2
          solid1.dispatchEvent event

          event = new Event 'collide'
          event.solid = solid1
          solid2.dispatchEvent event

  checkRectVsRect: (rect1, rect2) =>
    !(rect1.x + (rect1.width * 0.5) < rect2.x - (rect2.width * 0.5) ||
      rect1.x - (rect1.width * 0.5) > rect2.x + (rect2.width * 0.5) ||
      rect1.y + (rect1.height * 0.5) < rect2.y - (rect2.height * 0.5) ||
      rect1.y - (rect1.height * 0.5) > rect2.y + (rect2.height * 0.5))

  render: =>
    @canvasContext.save()
    @canvasContext.setTransform 1, 0, 0, 1, 0, 0
    @canvasContext.clearRect 0, 0, @canvas.width, @canvas.height
    @canvasContext.restore()

    scale = new faqin.Vector @canvas.width / @viewport.width, @canvas.height / @viewport.height
    zeroZero =
      x: @viewport.x - (@viewport.width * 0.5)
      y: @viewport.y - (@viewport.height * 0.5)

    for solid in @solids
      if solid.fill instanceof faqin.Bitmap
        # TODO
      else
        if solid instanceof faqin.Rect
          wasVisible = solid.visible
          solid.visible = @checkRectVsRect @viewport, solid
          if solid.visible
            @drawRect (solid.x - (solid.width * 0.5) - zeroZero.x) * scale.x + 0.5,
              (solid.y - (solid.height * 0.5) - zeroZero.y) * scale.y + 0.5,
              solid.width * scale.x,
              solid.height * scale.y,
              solid.fill
            solid.dispatchEvent new Event 'show' if not wasVisible
            solid.dispatchEvent new Event 'render'
          else
            solid.dispatchEvent new Event 'hide' if wasVisible

    if @debug
      @drawDebug solid, scale, zeroZero for solid in @solids when solid.visible
      @drawText Math.floor(@fps) + ' FPS', @canvas.width / 2, 10, '10px Arial', '#000'

  drawDebug: (solid, scale, zeroZero) =>
    moving = solid.moving()

    if solid instanceof faqin.Rect
      @drawRect (solid.x - (solid.width * 0.5) - zeroZero.x) * scale.x + 0.5,
        (solid.y - (solid.height * 0.5) - zeroZero.y) * scale.y + 0.5,
        solid.width * scale.x,
        solid.height * scale.y,
        if moving then 'rgba(0, 255, 0, .3)' else 'rgba(255, 0, 0, .3)',
        if moving then 'rgba(0, 255, 0, .7)' else 'rgba(255, 0, 0, .7)'

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
