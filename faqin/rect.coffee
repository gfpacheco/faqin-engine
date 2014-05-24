class faqin.Rect extends faqin.Solid
  deepExtend @defaultOptions, @defaultOptions,
    width: 0
    height: 0

  constructor: (options) ->
    super options

  calculateMass: =>
    @width * @height / 100
