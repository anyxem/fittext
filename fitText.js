function fitText( arg ) {

    var defaults = {
        selector: null, 
        wrap: true, 
        sizes: {
            min: 10, 
            max: 40
        }
    };

    if ( typeof arg === 'undefined' ){
        options = Object.assign({},defaults,{ selector: '[data-fittext]' });
    } else if ( typeof arg === 'string' ){
        options = Object.assign({},defaults,{ selector: arg });
    } else {
        options = Object.assign({},defaults,arg);
    }

    if( options.selector === null ){
        return;
    }

    var reduceFont = function(control, element, cb) {
        if( 
            parseInt(element.style.fontSize) > options.sizes.min && 
            control.getBoundingClientRect().height > 2*parseInt(element.style.fontSize) 
        ){
            element.style.fontSize = parseInt(element.style.fontSize)-1+'px';
            reduceFont(control, element, cb);
        }else{
            cb();
        }
    }

    var elements = document.querySelectorAll(options.selector);

    elements.forEach( (item, index)=>{
        var itemOptions

        if(item.dataset.fittext){
            itemOptions = Object.assign({},options, 
                {
                    sizes: {
                        min: item.dataset.fittextSizeMin,
                        max: item.dataset.fittextSizeMax
                }
            });
        } else{
            itemOptions = options;
        }

        if(item.dataset.fittextLive == 'true'){console.log(item);
            item.dataset.fittext = "fittext-"+index;
            window.addEventListener('resize',debounce(function(){
                fitText('[data-fittext="fittext-'+index+'"]')
            }, 500));
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

            reduceFont( controlWord, item, function(){ 
                item.innerHTML = item.textContent || item.innerText;
                item.style.wordBreak = originalWordBreak;
            });
        } else {
            reduceFont( item, item, function(){  });
        }
    } );
}

fitText();

// helpers

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};