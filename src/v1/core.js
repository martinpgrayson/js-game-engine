// Game loop stuff
var game_render_scale = 1;

// Helper to get query string values
var queryString = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

// Update and draw methods to replace
function update(elapsed) { }
function draw(context) { }


function resizeCanvas() {
    var _canvas = document.getElementById("canvas");
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
}

function setViewScale(scale) {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0px";
    document.body.style.touchAction = "none";
    game_render_scale = 1;

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
    if (scale) {
        game_render_scale = scale;
    }
    else {
        game_render_scale = Math.min(window.innerWidth / 640, window.innerHeight / 480);
    }
}

var _lastRender = 0;
function loop(timestamp) {
    var _canvas = document.getElementById("canvas");
    var _context = _canvas.getContext("2d");
    var progress = timestamp - _lastRender;

    if (update) {
        update(progress / 1000);
    }

    if (draw) {
        draw(_context);
    }

    _lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

setViewScale();
window.requestAnimationFrame(loop);

// Create a delegate that calls back into an instance.
createDelegate = function (instance, method) {
    return function () {
        return method.apply(instance, arguments);
    }
}

function getRandom(min, max) {
    if (!max) {
        return Math.random() * min;
    }

    return Math.round(min + Math.random() * (max - min));
}



var List = function() {
    this._items = [];
}




List.prototype = Object.create(Object.prototype, {
constructor: {
    value: List
},
_items: {
    value: null,
    writable: true
},
add: {
    value: function (item) {
        this._items.push(item);
    }
},
remove: {
    value: function (item) {
        var index = -1;
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == item) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            this._items.splice(index, 1);
        }
    }
},
contains: {
    value: function (item) {
        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i] == item) {
                return true;
            }
        }

        return false;
    }
},
count: {
    value: function () {
        return this._items.length;
    }
},
itemAt: {
    value: function (index) {
        if (index < this._items.length) {
            return this._items[index];
        }

        return null;
    }
},
sort: {
    value: function (compare) {
        this._items.sort(compare);
    }
}});

var Random = function (seed) {
    this._seed = seed;
}

Random.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Random
    },
    _seed: {
        value: 1,
        writable: true
    },
    next: {
        value: function (max) {
            var x = Math.sin(this._seed++) * 10000;
            var r = Math.round((x - Math.floor(x)) * max);
            return r;
        }
    }
});