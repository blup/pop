#-----
# pop
#-----

(($) ->
  class Pop
    defaults:
      cache: true
      trigger: 'click'
      persistant: false
      position: 'bottom'
      toggle: 'open'
      container: false
      content: false
      template: false
      in: 500
      out: 500
      absolute: false

    constructor: (el, all, options) ->
      @enabled = true
      pop = @
      @el = el
      @all = all
      @options = $.extend({}, @defaults, options)
      @$content = @content()
      @$container = @container()
      @dimContent = @$content.offset()
      @dimContainer = @$container.offset()
      if @options.absolute then @$content.remove()
      if @options.trigger is 'hover'
        @$container.hover(in: @options.in, out: @options.out, other: @content)
           .on('hover:in', (e) -> pop.toggle(e))
           .on('hover:out', (e) -> pop.toggle(e))
      else
        @$container.on 'click', (e) -> pop.toggle(e)

      if @options.persistant
        @el.children().on 'click', (e) -> pop.cancel(e)
      @options.position = @options.position.split('-')

    getPosition: ->
      if @pos and @options.cache then return @pos
      $doc = $(document)
      $win = $(window)
      pos = @options.position[0]
      align = if @options.position[1]? then @options.position[1] else 'top'
      @dimContainer = @$container.offset()

      limits = {}
      limits.top = @dimContainer.top - $doc.scrollTop()
      limits.bottom = $win.height() - limits.top - @$container.height()
      limits.left = @dimContainer.left - $doc.scrollLeft()
      limits.right = $win.width() - limits.left - @$container.width()

      if pos is 'auto' then pos = 'right'
      if pos is 'right' and (limits.right - @dimContent.width < 0)
        position = 'left'
      else if pos is 'left' and (limits.left - @dimContent.width < 0)
        position = 'right'
      else if pos is 'top' and (limits.top - @dimContent.height < 0)
        position = 'bottom'
      else if pos is 'bottom' and (limits.top - @dimContent.height < 0)
        position = 'top'
      else position = pos
      style = {}
      left = if @options.absolute then @dimContainer.left else 0
      top = if @options.absolute then @dimContainer.top else 0
      if position is 'top' or position is 'bottom'
          if align is 'left' then style.left = left
          else if align is 'center' then style.left = left + (@dimContainer.width / 2 - @dimContent.width / 2)
          else if align is 'right' then style.left = left + @dimContainer.width - @dimContent.width
          if position is 'top' then style.top = top - @dimContent.height
          else style.top = top + @dimContainer.height
      else if position is 'left' or position is 'right'
          if align is 'top' then style.top = top
          else if align is 'center' then style.top = top + (@dimContainer.height / 2 - @dimContent.height / 2)
          else if align is 'bottom' then style.top = top + @dimContainer.height - @dimContent.height
          if position is 'left' then style.left = left - @dimContent.width
          else style.left = left + @dimContainer.width
      @pos = style

    container: ->
      if @$container then return @$container
      else if @options.container then @$container = @el.parents(@options.container)
      else @$container = @el.parent()

    content: ->
      if @$content then return @$content
      else if @options.template then @$content = $(@options.template)
      else if @options.content and @options.content is true then @$content = @el
      else if @options.content then @$content = @el.children(@options.content)
      else @$content = @el.next()

    toggle: (e) ->
      e.stopPropagation()
      isActive = @$container.hasClass(@options.toggle)
      @clearAll()
      if isActive then @hide()
      else @show()
      @$container

    show: ->
      if @enabled
        pos = @getPosition()
        pos.opacity = 1
        @$content.css(pos)
        if @options.absolute
          $('body').append(@$content)
        @$container.addClass(@options.toggle)

    hide: ->
      @$container.removeClass(@options.toggle)
      @$content.css(opacity: 0)
      if @options.absolute
        @$content.remove()

    clearAll: ->
      all = if @options.container then $(@options.container) else @all.parent()
      all.removeClass @options.toggle

    enable: ->
      @enabled = true

    disable: ->
      @enabled = false

    toggleEnabled: ->
      @enabled = not @enabled

    cancel: (e) ->
      e.stopPropagation()

  $.fn.pop = (options = {}) ->
    all = @
    @each ->
      el = $(this)
      data = el.data("pop")
      unless data
        el.data "pop", data = new Pop(el, all, options)
      data[options]() if typeof options is "string"

  $.fn.popRight = (options = {}) ->
    #$("html").on "click", clearMenus
    all = @
    @each ->
      el = $(this)
      data = el.data("popRight")
      unless data
        options.toggle = 'active'
        options.position = 'right-top'
        options.absolute = false
        options.trigger = 'hover'
        options.cache = false
        options.content = true
        options.in = 1000
        options.out = 400
        el.data "popRight", data = new Pop(el, all, options)
      data[options]() if typeof options is "string"

  $.fn.popDown = (options = {}) ->
    all = @
    @each ->
      el = $(this)
      data = el.data("popDown")
      unless data
        options.persistant = el.data('persistant')
        options.container = el.data('target')
        el.data "popDown", data = new Pop(el, all, options)
      data[options]() if typeof option is "string"

  $.fn.popTip = (options = {}) ->
    all = @
    @each ->
      el = $(this)
      data = el.data("popTip")
      unless data
        options.container = el.data('target')
        options.position = 'top'
        options.template = "<div class=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>"
        el.data "popTip", data = new Pop(el, all, options)
      data[options]() if typeof option is "string"

) window.Zepto || window.jQuery
