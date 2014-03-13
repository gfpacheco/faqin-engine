class fuckin.Rect extends fuckin.Solid
  defaultOptions:
    width: 0
    height: 0

  constructor: (options) ->
    deepExtend this, @defaultOptions, options
    super options

  calculateMass: =>
    @width * @height / 100
