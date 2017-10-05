function fitText( arg ) {

    var defaults = {
        selector: null, 
        wrap: true, 
        sizes: {
            min: 10, 
            max: 40
        }
    };

    if( typeof arg === 'string' ){
        options = Object.assign({},defaults,{ selector: arg });
    }else{
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

    elements.forEach( (item)=>{
        var originalWordBreak = item.style.wordBreak;
        item.style.fontSize = options.sizes.max + "px";
        item.style.wordBreak = 'break-all';

        if( options.wrap ){
            var longest = 0;
            var longestIndex = 0;

            item.innerHTML = item.innerHTML.split(' ').map((word, index, words)=>{
                if(index > 0 && word.length > words[longestIndex].length) {
                    longestIndex = index;
                    longest = word.length;
                }

                return "<div>"+word+"</div>";
            }).join(' ');

            var controlWord = item.querySelectorAll('div')[longestIndex]; console.log(controlWord);

            reduceFont( controlWord, item, function(){ 
                item.innerHTML = item.textContent || item.innerText;
                item.style.wordBreak = originalWordBreak;
            });
        } else {
            reduceFont( item, item, function(){  });
        }
    } );
}