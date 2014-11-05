/*
This is a plugin for JQuery designed to animate a smooth color changing text in the selected element(s)
options are available such as:
	animation time per color,  - timer: (milliseconds)
	animation delay between either the next word or the next letter,  - delay: (milliseconds)
	the array of colors,   -colors: [array, of, colors] -  css colors
	and as mentioned above the choice between animating each word or every letter in the selection -  word: true/false
	
	the defaults:
		  
			 timer: 80,
             delay: 600,
             colors: ["#330000", "#AA0000", "#FF0000", "#FF3300", "#333300", "#AAAA00", "#FFFF00", "#33AA00", "#00AA00", "#00FF00", "#00FFAA", "#00AAAA", "#00FFFF", "#00AAFF", "#0000AA", "#0000FF", "#3300FF", "#AA00FF", "#AA00FF", "#AA00AA", "#FF00AA", "#AA33AA", "#AAAAAA", "#CCCCCC", "#888888", "#333333"],
             word: true
	
	an example: set to color chage every letter in every div element
	$('div').chasingRainbow({	
			timer: 80,
             delay: 600,
             colors: ["#330000", "#AA0000", "#FF0000", "#FF3300", "#333300", "#AAAA00", "#FFFF00", "#33AA00"],
             word: false
	});

	
	
*/
(function ($) {
    function childTree(element) {
        if (!$(element).html())
            return;
        var open = false;
        var $element = $(element);
        var element_html = $element.html().trim();
        var element_tree = [];
        for (i = 0; i < element_html.length; i++) {
            if (element_html.charCodeAt(i) === 60 || !open && element_html.charCodeAt(i) !== 62) {
                open = true;
                element_tree.push(element_html.charAt(i));
            } else if (open && element_html.charCodeAt(i) !== 62) {
                element_tree[(element_tree.length - 1)] += element_html.charAt(i);
            } else if (open && element_html.charCodeAt(i) === 62) {
                element_tree[(element_tree.length - 1)] += element_html.charAt(i);
                open = false;
            } else if (!open) {
                if (element_tree.length && element_tree[(element_tree.length - 1)].charCodeAt(0) !== 60) {
                    element_tree[(element_tree.length - 1)] += element_html.charAt(i);
                } else {
                    element_tree.push(element_html.charAt(i));
                }
            }


        }
        for (var g = 0; g < element_tree.length; g++) {
            element_tree[g] = element_tree[g].trim();
            if (!element_tree[g]) {
                element_tree.splice(g, 1);
            }
        }
        return element_tree;
    }


    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this);

                var settings = $this.data('ChasingRainbow');
                if (typeof (settings) === 'undefined') {
                    var defaults = {
                        timer: 80,
                        delay: 600,
                        colors: ["#330000", "#AA0000", "#FF0000", "#FF3300", "#333300", "#AAAA00", "#FFFF00", "#33AA00", "#00AA00", "#00FF00", "#00FFAA", "#00AAAA", "#00FFFF", "#00AAFF", "#0000AA", "#0000FF", "#3300FF", "#AA00FF", "#AA00FF", "#AA00AA", "#FF00AA", "#AA33AA", "#AAAAAA", "#CCCCCC", "#888888", "#333333"],
                        word: true
                    };

                    settings = $.extend({}, defaults, options);
                    $this.data('ChasingRainbow', settings);
                } else {
                    // We got settings, merge our passed options in with them (optional)
                    settings = $.extend({}, settings, options);

                    // If you wish to save options passed each time, add:
                     $this.data('ChasingRainbow', settings);
                }
        var text_tree =[];
        var rainText = [];
                if($this.children().length > 0){
        text_tree = childTree(this);
    }else{
       text_tree.push($this.text());
    }
        if (text_tree.length) {
            for (var tree_len = 0; tree_len < text_tree.length; tree_len++) {
                if (text_tree[tree_len].charCodeAt(0) !== 60) {
                    if(settings.word){
                        var newText = '';
newText += '<rgb>' + text_tree[tree_len] + '<rgb>';
                    }else{
                    rainText = text_tree[tree_len].split("");
                    var newText = '';
                    for (var g = 0; g < rainText.length; g++) {
                        newText += '<rgb>' + rainText[g] + '</rgb>';
                    }
                }
                    text_tree[tree_len] = newText;
                }
            }
var new_ele_html ='';
            for (var i = 0; i < text_tree.length; i++) {
                new_ele_html += text_tree[i];
            }

            
            $this.html(new_ele_html);
var rgbcount = 0;
        var IntervalToken = setInterval(function(){
              rgbchange($this.children('rgb')[rgbcount],0);
              rgbcount++;
              if(rgbcount === $this.children('rgb').length){
                  clearInterval(IntervalToken);
                  $this.removeData("interval");
              }
        },settings.timer);
        $this.data({"interval": IntervalToken});
        }    

  var colorCount = settings.colors.length;

                function rgbchange(ele, color) {

                    $(ele).animate({color: settings.colors[color]}, settings.delay, function () {
                        var nextColor = color + 1;
                        if (nextColor === colorCount) {
                            nextColor = 0;
                        }
                        rgbchange(this, nextColor);
                    });
                }

            });
        },
        destroy: function (options) {
            // Repeat over each element in selector
            return $(this).each(function () {
                var $this = $(this);
                if($this.data("interval")){
                clearInterval($this.data("interval"));
                $this.removeData("interval");
            }
                var cleanupHTML = $this.html().replace(/<\/?rgb[^>]*>/g, "");
                $this.html(cleanupHTML);
                $this.removeData('ChasingRainbow');
            });
        }

    };


    $.fn.chasingRainbow = function () {
        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof (method) === 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ChasingRainbow');
            return this;
        }

        return method.apply(this, arguments);

    };

})(jQuery);