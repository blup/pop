# POP!

Note: In development!

This isn't another one of those dropdown/tooltip/popup plugins... oh wait, it is. Only this one does it all, and with a tiny footprint. In fact, its an abstract plugin with many settings that takes care of showing some content when a particular container is hovered/clicked/etc. There are three preset methods that wrap up some common use cases: popRight(), popDown() and popTip().

Example sidemenu:


HTML:

```html
<div id="container">
  <ul id="sidemenu">
    <li><a href="#">Link</a></li>
    <li><a href="#">Link</a></li>
  </ul>
  <div id="content">
    <p>Content
  </div>
</div>
```

CSS:

```css
#sidemenu {
  opacity: 0;
}
#container.active #sidemenu {
  opacity: 100;
}

```

JS:

```js
$('#sidemenu').popRight()
```

or

```js
$('#container').pop({
    toggle = 'active'
    position = 'right-top'
    absolute = false
    trigger = 'hover'
    cache = false
    content = true
    in = 1000
    out = 400
})
```

Available options:

```js
$('#container').pop({
    cache: true           // Cache or recalculate the position
    trigger: 'click'      // Trigger event (click, hover)
    toggle: 'open'        // Class to toggle when opening popup
    persistant: false     // Hide on click
    position: 'right-top' // Position relative to container (top-left, right-center, ...)
    absolute: false       // Absolute or relative positioning
    container: false      // If unspecified, defaults to parent element
    content: false        // True = children, false = sibling, or selector
    template: false       // HTML to use as template for the content
    in: 500               // Mouseover delay (in milliseconds)
    out: 500              // Mouseout delay (in milliseconds)
})
```
