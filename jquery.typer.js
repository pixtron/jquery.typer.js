/*!
 * jquery.typer.js 0.0.4 - https://github.com/yckart/jquery.typer.js
 * The typewriter effect
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/03/24
*/
(function($){
    $.fn.typer = function(text, options){
        options = $.extend({}, {
            delay: 2000,
            markDelay: 300,
            markDuration: 200,
            duration: 600,
            endless: true,
            onType: $.noop,
            onMark: $.noop,
            afterAll: $.noop,
            afterPhrase: $.noop
        }, options || text);

        text = $.isPlainObject(text) ? options.text : text;
        text = $.isArray(text) ? text : text.split(" ");

        return this.each(function(){
            var elem = $(this),
                isTag = false,
                timer,
                c = 0;

            (function typetext(i) {
                var e = ({string:1, number:1}[typeof text] ? text : text[i]) + '',
                    char = e.substr(c++, 1);

                if( char === '<' ){ isTag = true; }
                if( char === '>' ){ isTag = false; }
                elem.html(e.substr(0, c));

                if(c <= e.length){
                    if( isTag ){
                        typetext(i);
                    } else {
                        timer = setTimeout(typetext, options.duration/10, i);
                    }
                    options.onType(timer);
                } else {
                    timer = setTimeout(marktext, options.delay, i);
                }

                function marktext(i) {
                    var e = ({string:1, number:1}[typeof text] ? text : text[i]) + '',
                        char = e.substr(c--, 1);

                    if( char === '>' ){ isTag = true; }
                    if( char === '<' ){ isTag = false; }
                    var markedText = $('<span class="highlighted" />').html(e.substr(c, e.length));

                    elem.html(e.substr(0, c)).append(markedText);

                    if(c > 0){
                        if( isTag ){
                            marktext(i);
                        } else {
                            timer = setTimeout(marktext, options.markDuration/10, i);
                        }
                        options.onMark(timer);
                    } else {
                        c = 0;
                        i++;

                        if (i === text.length && !options.endless) {
                            return;
                        } else if (i === text.length) {
                            i = 0;
                        }

                        timer = setTimeout(typetext, options.markDelay, i);
                        if(i === text.length - 1) options.afterAll(timer);
                        options.afterPhrase(timer);

                    }
                }
            })(0);
        });
    };
}(jQuery));