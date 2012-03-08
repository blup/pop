(function() {

  (function($) {
    var Pop;
    Pop = (function() {

      Pop.prototype.defaults = {
        cache: true,
        trigger: 'click',
        persistant: false,
        position: 'bottom',
        toggle: 'open',
        container: false,
        content: false,
        template: false,
        "in": 500,
        out: 500,
        absolute: false
      };

      function Pop(el, all, options) {
        var pop;
        this.enabled = true;
        pop = this;
        this.el = el;
        this.all = all;
        this.options = $.extend({}, this.defaults, options);
        this.$content = this.content();
        this.$container = this.container();
        this.dimContent = this.$content.offset();
        this.dimContainer = this.$container.offset();
        if (this.options.absolute) this.$content.remove();
        if (this.options.trigger === 'hover') {
          this.$container.hover({
            "in": this.options["in"],
            out: this.options.out,
            other: this.content
          }).on('hover:in', function(e) {
            return pop.toggle(e);
          }).on('hover:out', function(e) {
            return pop.toggle(e);
          });
        } else {
          this.$container.on('click', function(e) {
            return pop.toggle(e);
          });
        }
        if (this.options.persistant) {
          this.el.children().on('click', function(e) {
            return pop.cancel(e);
          });
        }
        this.options.position = this.options.position.split('-');
      }

      Pop.prototype.getPosition = function() {
        var $doc, $win, align, left, limits, pos, position, style, top;
        if (this.pos && this.options.cache) return this.pos;
        $doc = $(document);
        $win = $(window);
        pos = this.options.position[0];
        align = this.options.position[1] != null ? this.options.position[1] : 'top';
        this.dimContainer = this.$container.offset();
        limits = {};
        limits.top = this.dimContainer.top - $doc.scrollTop();
        limits.bottom = $win.height() - limits.top - this.$container.height();
        limits.left = this.dimContainer.left - $doc.scrollLeft();
        limits.right = $win.width() - limits.left - this.$container.width();
        if (pos === 'auto') pos = 'right';
        if (pos === 'right' && (limits.right - this.dimContent.width < 0)) {
          position = 'left';
        } else if (pos === 'left' && (limits.left - this.dimContent.width < 0)) {
          position = 'right';
        } else if (pos === 'top' && (limits.top - this.dimContent.height < 0)) {
          position = 'bottom';
        } else if (pos === 'bottom' && (limits.top - this.dimContent.height < 0)) {
          position = 'top';
        } else {
          position = pos;
        }
        style = {};
        left = this.options.absolute ? this.dimContainer.left : 0;
        top = this.options.absolute ? this.dimContainer.top : 0;
        if (position === 'top' || position === 'bottom') {
          if (align === 'left') {
            style.left = left;
          } else if (align === 'center') {
            style.left = left + (this.dimContainer.width / 2 - this.dimContent.width / 2);
          } else if (align === 'right') {
            style.left = left + this.dimContainer.width - this.dimContent.width;
          }
          if (position === 'top') {
            style.top = top - this.dimContent.height;
          } else {
            style.top = top + this.dimContainer.height;
          }
        } else if (position === 'left' || position === 'right') {
          if (align === 'top') {
            style.top = top;
          } else if (align === 'center') {
            style.top = top + (this.dimContainer.height / 2 - this.dimContent.height / 2);
          } else if (align === 'bottom') {
            style.top = top + this.dimContainer.height - this.dimContent.height;
          }
          if (position === 'left') {
            style.left = left - this.dimContent.width;
          } else {
            style.left = left + this.dimContainer.width;
          }
        }
        return this.pos = style;
      };

      Pop.prototype.container = function() {
        if (this.$container) {
          return this.$container;
        } else if (this.options.container) {
          return this.$container = this.el.parents(this.options.container);
        } else {
          return this.$container = this.el.parent();
        }
      };

      Pop.prototype.content = function() {
        if (this.$content) {
          return this.$content;
        } else if (this.options.template) {
          return this.$content = $(this.options.template);
        } else if (this.options.content && this.options.content === true) {
          return this.$content = this.el;
        } else if (this.options.content) {
          return this.$content = this.el.children(this.options.content);
        } else {
          return this.$content = this.el.next();
        }
      };

      Pop.prototype.toggle = function(e) {
        var isActive;
        e.stopPropagation();
        isActive = this.$container.hasClass(this.options.toggle);
        this.clearAll();
        if (isActive) {
          this.hide();
        } else {
          this.show();
        }
        return this.$container;
      };

      Pop.prototype.show = function() {
        var pos;
        if (this.enabled) {
          pos = this.getPosition();
          pos.opacity = 1;
          this.$content.css(pos);
          if (this.options.absolute) $('body').append(this.$content);
          return this.$container.addClass(this.options.toggle);
        }
      };

      Pop.prototype.hide = function() {
        this.$container.removeClass(this.options.toggle);
        this.$content.css({
          opacity: 0
        });
        if (this.options.absolute) return this.$content.remove();
      };

      Pop.prototype.clearAll = function() {
        var all;
        all = this.options.container ? $(this.options.container) : this.all.parent();
        return all.removeClass(this.options.toggle);
      };

      Pop.prototype.enable = function() {
        return this.enabled = true;
      };

      Pop.prototype.disable = function() {
        return this.enabled = false;
      };

      Pop.prototype.toggleEnabled = function() {
        return this.enabled = !this.enabled;
      };

      Pop.prototype.cancel = function(e) {
        return e.stopPropagation();
      };

      return Pop;

    })();
    $.fn.pop = function(options) {
      var all;
      if (options == null) options = {};
      all = this;
      return this.each(function() {
        var data, el;
        el = $(this);
        data = el.data("pop");
        if (!data) el.data("pop", data = new Pop(el, all, options));
        if (typeof options === "string") return data[options]();
      });
    };
    $.fn.popRight = function(options) {
      var all;
      if (options == null) options = {};
      all = this;
      return this.each(function() {
        var data, el;
        el = $(this);
        data = el.data("popRight");
        if (!data) {
          options.toggle = 'active';
          options.position = 'right-top';
          options.absolute = false;
          options.trigger = 'hover';
          options.cache = false;
          options.content = true;
          options["in"] = 1000;
          options.out = 400;
          el.data("popRight", data = new Pop(el, all, options));
        }
        if (typeof options === "string") return data[options]();
      });
    };
    $.fn.popDown = function(options) {
      var all;
      if (options == null) options = {};
      all = this;
      return this.each(function() {
        var data, el;
        el = $(this);
        data = el.data("popDown");
        if (!data) {
          options.persistant = el.data('persistant');
          options.container = el.data('target');
          el.data("popDown", data = new Pop(el, all, options));
        }
        if (typeof option === "string") return data[options]();
      });
    };
    return $.fn.popTip = function(options) {
      var all;
      if (options == null) options = {};
      all = this;
      return this.each(function() {
        var data, el;
        el = $(this);
        data = el.data("popTip");
        if (!data) {
          options.container = el.data('target');
          options.position = 'top';
          options.template = "<div class=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>";
          el.data("popTip", data = new Pop(el, all, options));
        }
        if (typeof option === "string") return data[options]();
      });
    };
  })(window.Zepto || window.jQuery);

}).call(this);
