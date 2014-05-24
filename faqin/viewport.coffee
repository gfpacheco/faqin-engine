class faqin.Viewport extends faqin.Rect
  constructor: (options) ->
    deepExtend this, options
    super

  update: =>
    if !this.anchor
      return



    if this.type == 'margin'

      if this.anchor.x < this.x + this.margin.x
        this.x = this.anchor.x - this.margin.x + (this.width * 0.5)
      else if this.anchor.x > this.x + this.width - this.margin.x
        this.x = this.anchor.x + this.margin.x - (this.width * 0.5)

      if this.anchor.y < this.y + this.margin.y
        this.y = this.anchor.y - this.margin.y + (this.height * 0.5)
      else if this.anchor.y > this.y + this.height - this.margin.y
        this.y = this.anchor.y + this.margin.y - (this.height * 0.5)

    else if this.type == 'xFixed'
      this.x = this.anchor.x - this.xFixed + (this.width * 0.5)
    else if this.type == 'yFixed'
      this.y = this.anchor.y - this.yFixed + (this.height * 0.5)
