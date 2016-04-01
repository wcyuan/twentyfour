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

if (typeof tf == "undefined") {
  var tf = {};
}

tf.permutations = function(vals) {
    if (vals.length < 2) {
        return [vals.slice(0)];
    }
    var perms = [];
    var first = vals[0];
    tf.permutations(vals.slice(1)).forEach(function(subresult) {
        for (var ii = 0; ii <= subresult.length; ii++) {
            var newarr = subresult.slice(0);
            newarr.splice(ii, 0, first);
            perms.push(newarr);
        }
    });
    return perms;
};

tf.partitions = function(vals) {
    if (vals.length < 2) {
        return [];
    }
    var parts = [];
    for (var ii = 1; ii < vals.length; ii++) {
        parts.push([vals.slice(0, ii), vals.slice(ii)]);
    }
    return parts;
};


tf.list_to_exprs = function(vals) {
    if (vals.length < 2) {
        return vals;
    }
    var operations = [" + ", " - ", " * ", " / "];
    var exprs = [];
    tf.partitions(vals).forEach(function(partition) {
        tf.list_to_exprs(partition[0]).forEach(function(left) {
            tf.list_to_exprs(partition[1]).forEach(function(right) {
                operations.forEach(function(op) {
                    exprs.push("(" + left + op + right + ")");
                });
            });
        });
    });
    return exprs;
};


tf.find_exprs = function(vals, target) {
    var matches = [];
    tf.permutations(vals).forEach(function(perm) {
        tf.list_to_exprs(perm).forEach(function(expr) {
            if (eval(expr) == target) {
                matches.push(expr);
            }
        });
    });
    return matches;
};

tf.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

tf.randint = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

tf.randnums = function(min, max, number) {
    var vals = [];
    for (var ii = 0; ii < number; ii++) {
        vals.push(tf.randint(min, max));
    }
    return vals;
};

tf.reload = function() {
    var exprs = [];
    var vals;
    while (exprs.length < 1) {
        vals = tf.randnums(1, 13, 4);
        exprs = tf.find_exprs(vals, 24);
    }
    tf.display(vals, 24, exprs);
};

tf.display = function(vals, target, exprs) {

    if (typeof exprs == "undefined") {
        exprs = tf.find_exprs(vals, target);
    }

    var numbers = document.getElementById("numbers");
    var num_answers = document.getElementById("num_answers");
    var answers = document.getElementById("answers");
    wd.removeClass(answers, "shown")
    wd.addClass(answers, "hidden")

    numbers.innerHTML = "<pre>" + vals + "</pre>";
    num_answers.innerHTML = "<pre>(" + exprs.length + " answers found)</pre>";
    answers.innerHTML = "<pre>" + exprs.join("\n") + "</pre>";
};

// ------------------------------------------------------------------ //

(function() {

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

    var reload_button = document.getElementById("reload");
    wd.addEventListener(reload_button, 'click', tf.reload);

    var solve_button = document.getElementById("solve");
    wd.addEventListener(solve_button, 'click', function() {
	    var vals = [];
	    ["a", "b", "c", "d"].forEach(function(id) {
		    var input = document.getElementById(id);
		    if (tf.isNumeric(input.value)) {
			vals.push(input.value);
		    }
		});
	    var target = document.getElementById("target").value;
	    if (!tf.isNumeric(target)) {
		target = 24;
	    }
	    if (vals.length > 0) {
		tf.display(vals, target);
	    }
	});

    tf.reload();

}());
