# fitText vanilla JS

This library used for fit text in fixed-width block by changing font size


Usage

Declarative
```html
<div class="..." data-fittext="true">Title</div>
```

Specify min and max font size
```html
<div class="..." data-fittext="true" data-fittext-size-min="12" data-fittext-size-max="60">Title</div>
```

For dinamic-width blocks need to recalculate font-size on window resize
```html
<div class="..." data-fittext="true" data-fittext-live="true">Title</div>
```

with JS
```javascript
fitText('.some-class'); // or #id
```

## Demo
http://anyxem.com/fittext/

## Todo:
* wrap into class
* enhanced support options
* support ems, rems and %
* es5 build
* documentation
