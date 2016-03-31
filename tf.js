
// make sure we've got namespace
if (typeof wd == "undefined") {
  var wd = {};
}

/**
 * Courtesy of some dude with a blog named ddiaz.
 *
 */
wd.getElementsByClass = function(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\\\s)"+searchClass+"(\\\\s|$)");
	for (var i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
};

/**
 * Typical cross-browser add event listener code.
 * @param {Element} el
 * @param {string} type
 * @param {Function} fn
 */
wd.addEventListener = function(el, type, fn) { 
  if (el.addEventListener) { 
    el.addEventListener(type, fn, false); 
    return true; 
  } else if (el.attachEvent) { 
    var r = el.attachEvent("on" + type, fn); 
    return r; 
  } else { 
    return false; 
  } 
};

// Add/remove/has class functions from http://snipplr.com/view/3561/addclass-removeclass-hasclass/

/**
 * Returns true if the element has the given class, false otherwise.
 * @param {Element} ele
 * @param {string} cls
 * @return {Boolean}
 */
wd.hasClass = function(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

/**
 * Adds a class name to the element.
 * @param {Element} ele
 * @param {string} cls
 */
wd.addClass = function(ele,cls) {
  if (!wd.hasClass(ele,cls)) ele.className += " "+cls;
}

/**
 * Completely removes a class name from the element.
 * @param {Element} ele
 * @param {string} cls
 */
wd.removeClass = function(ele,cls) {
  if (wd.hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

/**
 * function scope bind
 */
Function.prototype.bind = function(obj) {
  var method = this, temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
}; 


// ------------------------------------------------------------------ //

(function() {

    function permutations(vals) {
        if (vals.length < 2) {
            return [vals.slice(0)];
        }
        var perms = [];
        var first = vals[0];
        permutations(vals.slice(1)).forEach(function(subresult) {
            for (var ii = 0; ii <= subresult.length; ii++) {
                var newarr = subresult.slice(0);
                newarr.splice(ii, 0, first);
                perms.push(newarr);
            }
        });
        return perms;
    }

    function partitions(vals) {
        if (vals.length < 2) {
            return [];
        }
        var parts = [];
        for (var ii = 1; ii < vals.length; ii++) {
            parts.push([vals.slice(0, ii), vals.slice(ii)]);
        }
        return parts;
    }


    function list_to_exprs(vals) {
        if (vals.length < 2) {
            return vals;
        }
        var operations = [" + ", " - ", " * ", " / "];
        var exprs = [];
        partitions(vals).forEach(function(partition) {
            list_to_exprs(partition[0]).forEach(function(left) {
                list_to_exprs(partition[1]).forEach(function(right) {
                    operations.forEach(function(op) {
                        exprs.push("(" + left + op + right + ")");
                    });
                });
            });
        });
        return exprs;
    }


    function find_exprs(vals, target) {
        var matches = [];
        permutations(vals).forEach(function(perm) {
            list_to_exprs(perm).forEach(function(expr) {
                if (eval(expr) == target) {
                    matches.push(expr);
                }
            });
        });
        return matches;
    }

    function randnums(min, max, number) {
        
    }

    // ------------------------------------------------------------------ //

    function reload() {
        var num_answers = document.getElementById("show");
        var num_answers = document.getElementById("show");
    }
    
    // ------------------------------------------------------------------ //

    var show_button = document.getElementById("show");
    wd.addEventListener(show_button, 'click', function() {
        var answers = document.getElementById("answers");
        if (wd.hasClass(answers, "hidden")) {
            wd.removeClass(answers, "hidden")
            wd.addClass(answers, "shown")
        } else {
            wd.removeClass(answers, "shown")
            wd.addClass(answers, "hidden")
        }
    });

}());
