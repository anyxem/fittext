function fitText( arg ) {

    var defaults = {
        selector: '[data-fittext]',
        wrap: true,
        sizes: {
            min: 10,
            max: 40
        }
    };
    var options;

    if ( typeof arg === 'undefined' ){
        options = defaults;
    } else if ( typeof arg === 'string' ){
        options = {...defaults, selector: arg};
    } else {
        options = {...defaults, arg}
    }

    if( options.selector === null ){
        return;
    }

    var elements = document.querySelectorAll(options.selector);

    elements.forEach( (item, index)=>{
        var itemOptions

        if(item.dataset.fittext){
          itemOptions = {...options,
              sizes: {
                  min: item.dataset.fittextSizeMin,
                  max: item.dataset.fittextSizeMax
            }
          }
        } else{
          itemOptions = options;
        }

        if(item.dataset.fittextLive == 'true' && !item.dataset.fittextobservable){
            item.dataset.fittext = "fittext-"+index;
            item.dataset.fittextobservable = true;
            window.addEventListener('resize',debounce(function(){
                fitText('[data-fittext="fittext-'+index+'"]')
            }, 100));
        }

        var originalWordBreak = item.style.wordBreak;
        item.style.fontSize = itemOptions.sizes.max + "px";
        item.style.wordBreak = 'break-all';

        if( itemOptions.wrap ){
            var longest = 0;
            var longestIndex = 0;

            item.innerHTML = item.innerHTML.split(' ').map((word, index, words)=>{
                if(index > 0 && word.length > words[longestIndex].length) {
                    longestIndex = index;
                    longest = word.length;
                }

                return "<div>"+word+"</div>";
            }).join(' ');

            var controlWord = item.querySelectorAll('div')[longestIndex];

            reduceFont( controlWord, item, options, function(){
                item.innerHTML = item.textContent || item.innerText;
                item.style.wordBreak = originalWordBreak;
            });
        } else {
            reduceFont( item, item, options, function(){  });
        }
    } );
}

fitText();

// helpers

function reduceFont(control, element, options, cb) {
    var fontSize = parseInt(element.style.fontSize);
    var decrement = Math.ceil(fontSize/20);
    if(
        fontSize > options.sizes.min &&
        control.getBoundingClientRect().height > 2*fontSize
    ){
        element.style.fontSize = fontSize-decrement+'px';
        reduceFont(control, element, options, cb);
    }else{
        cb();
    }
}

function debounce(cb, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(cb.bind(this), ms, ...args);
  };
}
