class fuckin.Rect extends fuckin.Solid
  deepExtend @defaultOptions, @defaultOptions,
    width: 0
    height: 0

  constructor: (options) ->
    super options

  calculateMass: =>
    @width * @height / 100
