var Keyboard = function() {
    document.addEventListener("keypress", createDelegate(this, this._onKeyPress), false);
    this._onKeyPressHandlers = new List();
}

Keyboard.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Keyboard
    },
    _onKeyPressHandlers: {
        value: null,
        writable: true
    },
    onKeyPress: {
        value: function(handler) {
            this._onKeyPressHandlers.add(handler);
        }
    },
    _onKeyPress: {
        value: function (e) {
            for(var i = 0; i < this._onKeyPressHandlers.count(); i++) {
                var handler = this._onKeyPressHandlers.itemAt(i);
                handler(e.keyCode, e);
            } 
        }
    }
});


var Mouse = function (element) {
    this._element = element;
    if (element.attachEvent) {
        element.attachEvent("mousemove", createDelegate(this, this._onMouseMove), false);
        element.attachEvent("mouseenter", createDelegate(this, this._onMouseEnter), false);
        element.attachEvent("mouseleave", createDelegate(this, this._onMouseLeave), false);
        element.attachEvent("mousedown", createDelegate(this, this._onMouseDown), false);
        element.attachEvent("mouseup", createDelegate(this, this._onMouseUp), false);

        element.attachEvent("touchstart", createDelegate(this, this._onTouchStart), false);
        element.attachEvent("touchmove", createDelegate(this, this._onTouchMove), false);
        element.attachEvent("touchend", createDelegate(this, this._onTouchEnd), false);
    }
    else {
        element.addEventListener("mousemove", createDelegate(this, this._onMouseMove), false);
        element.addEventListener("mouseenter", createDelegate(this, this._onMouseEnter), false);
        element.addEventListener("mouseleave", createDelegate(this, this._onMouseLeave), false);
        element.addEventListener("mousedown", createDelegate(this, this._onMouseDown), false);
        element.addEventListener("mouseup", createDelegate(this, this._onMouseUp), false);

        element.addEventListener("touchstart", createDelegate(this, this._onTouchStart), false);
        element.addEventListener("touchmove", createDelegate(this, this._onTouchMove), false);
        element.addEventListener("touchend", createDelegate(this, this._onTouchEnd), false);
    }


        this._onClickHandlers = new List();
    }

Mouse.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Mouse
    },
    _element: {
        value: null, 
        writable: true
    },
    x: {
        value: 0,
        writable: true
    },
    y: {
        value: 0,
        writable: true
    },
    isInCanvas: {
        value: false,
        writable: true
    },
    isDown: {
        value: false,
        writable: true
    },
    _onClickHandlers: {
        value: null,
        writable: true
    },
    onClick: {
        value: function(handler) {
            this._onClickHandlers.add(handler);
        }
    },
    _onMouseDown: {
        value: function (e) {
            if (!this.isDown) {
                for(var i = 0; i < this._onClickHandlers.count(); i++) {
                    var handler = this._onClickHandlers.itemAt(i);
                    handler(this.x, this.y, e);
                }                
            }
            this.isDown = true;
        }
    },
    _onMouseUp: {
        value: function (e) {
            this.isDown = false;
        }
    },
    _onMouseEnter: {
        value: function (e) {
            this.isInCanvas = true;
        }
    },
    _onMouseLeave: {
        value: function (e) {
            this.isInCanvas = false;
        }
    },
    _onMouseMove: {
        value: function (e) {
            // Get the mouse position relative to the canvas element.
            if (e.layerX || e.layerX == 0) { // Firefox
                this.x = e.layerX;
                this.y = e.layerY;
            } else if (e.offsetX || e.offsetX == 0) { // Opera
                this.x = e.offsetX;
                this.y = e.offsetY;
            }
        }
    },
    _onTouchStart: {
        value: function (e) {
            e.preventDefault();
            
            var touchPosition = this._getTouchPosition(e);
            this.x = touchPosition.x;
            this.y = touchPosition.y;

            if (!this.isDown) {
                for(var i = 0; i < this._onClickHandlers.count(); i++) {
                    var handler = this._onClickHandlers.itemAt(i);
                    handler(this.x, this.y, e);
                }                
            }
            
            this.isDown = true;
        }
    },
    _onTouchMove: {
        value: function (e) {
            e.preventDefault();
            var touchPosition = this._getTouchPosition(e);
            this.x = touchPosition.x;
            this.y = touchPosition.y;
        }
    },
    _onTouchEnd: {
        value: function (e) {
            e.preventDefault();
            this.isDown = false;
        }
    },
    _getTouchPosition: {
        value: function (e) {
            var rect = this._element.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
    }
});


var AudioClip = function (url) {
    this._url = url;
    this._audio = new Audio(url);
}

AudioClip.prototype = Object.create(Object.prototype, {
    constructor: {
        value: AudioClip
    },
    _url: {
        value: null,
        writable: true
    },
    _audio: {
        value: null,
        writable: true
    },
    setIsLooping: {
        value: function (isLooping) {
            if (this._audio) {
                if (isLooping) {
                    this._audio.loop = "loop";
                } else {
                    this._audio.loop = "";
                }
            }
        }
    },
    play: {
        value: function () {
            if (this._audio) {
                this._audio.play();
            }
        }
    },
    stop: {
        value: function () {
            if (this._audio) {
                this._audio.pause();
                this._audio.currentTime = 0;
            }
        }
    }
});

var GameScene = function () {
    this._background = new List();
    this._children = new List();
}

GameScene.prototype = Object.create(Object.prototype, {
    constructor: {
        value: GameScene
    },
    _background: {
        value: null,
        writable: true
    },
    _children: {
        value: null,
        writable: true
    },
    addBackground: {
        value: function (child) {
            this._background.add(child);
        }
    },
    add: {
        value: function (child) {
            this._children.add(child);
        }
    },
    clear: {
        value: function (context, color) {

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.beginPath();
            context.closePath();

            var fillStyle = context.fillStyle;
            context.fillStyle = color;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.fillStyle = fillStyle;
        }
    },
    drawSprites: {
        value: function (context) {
            for (i = 0; i < this._background.count(); i++) {
                this._drawChild(context, this._background.itemAt(i));
            }

            this._children.sort(function (a, b) {
                if (a.y + a.height < b.y + b.height) {
                    return -1;
                }
                if (a.y + a.height > b.y + b.height) {
                    return 1;
                }
                return 0;
            });

            for (i = 0; i < this._children.count(); i++) {
                this._drawChild(context, this._children.itemAt(i));
                
            }
        }
    },
    _drawChild: {
        value: function (context, child) {
            if (child.isActive) {
                if (child.x < 0) {
                    child.x = 0;
                }
                else if (child.x + child.width > context.canvas.width) {
                    child.x = context.canvas.width - child.width;
                }

                if (child.y < 0) {
                    child.y = 0;
                }
                else if (child.y + child.height > context.canvas.height) {
                    child.y = context.canvas.height - child.height;
                }

                child.draw(context);
            }
        }
    },
    drawTopText: {
        value: function (context, text) {
            var fillStyle = context.fillStyle;
            context.fillStyle = "white";
            var fontSize = 20 * game_render_scale;
            context.font = "bold " + fontSize + "px Consolas,Arial";
            context.fillText(text, 5, 20 * game_render_scale);
            context.fillStyle = fillStyle;
        }
    },
    drawCenterText: {
        value: function (context, text) {
            var fillStyle = context.fillStyle;
            context.fillStyle = "white";
            context.font = "bold 200px Consolas,Arial";
            context.fillText(text, (context.canvas.width / 2) - 250, (context.canvas.height / 2) + 50);
            context.fillStyle = fillStyle;
        }
    }
});

var Sprite = function (url, x, y, width, height) {
    this.url = url;
    this.x = x;
    this.y = y;

    if (width) {
        this.width = width * game_render_scale;

        if (height) {
            this.height = height * game_render_scale;
        }
    }
    this._load();
}

Sprite.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Sprite
    },
    x: {
        value: 0,
        writable: true
    },
    y: {
        value: 0,
        writable: true
    },
    width: {
        value: 0,
        writable: true
    },
    height: {
        value: 0,
        writable: true
    },
    _isLoaded: {
        value: true,
        writable: true
    },
    _image: {
        value: null,
        writable: true
    },
    url: {
        value: null,
        writable: true
    },
    isActive: {
        value: true,
        writable: true
    },
    _load: {
        value: function () {
            if (!this._image && this.url) {
                this._image = new Image();
                if (this.url.indexOf("http") == 0) {
                    this._image.crossorigin = "anonymous";
                }
                this._image.addEventListener('load', createDelegate(this, this._handleImageLoad), false);
                this._image.src = this.url;
            }
        }
    },
    _handleImageLoad: {
        value: function (e) {
            this._isLoaded = true;
            if (this.width == 0) {
                this.width = this._image.width * game_render_scale;
            }

            if (this.height == 0) {
                this.height = (this._image.height * game_render_scale) * (this.width / (this._image.width * game_render_scale));
            }
        }
    },
    draw: {
        value: function (context) {
            if (this._isLoaded) {
                context.drawImage(this._image, this.x, this.y, this.width, this.height);
            }
        }
    },
    move: {
        value: function (x, y, distance) {
            var xDist = x - this.x;
            var yDist = y - this.y;
            var totalDistance = Math.sqrt((xDist * xDist) + (yDist * yDist));
            if (totalDistance > 0) {
                var factor = (distance / totalDistance) * game_render_scale;
                this.x += (x - this.x) * factor;
                this.y += (y - this.y) * factor;
            }
        }
    },
    place: {
        value: function (x, y) {
            this.x = x - this.width / 2;
            this.y = y - this.height / 2;
        }
    },
    getCenter: {
        value: function () {
            return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
        }
    },
    getBottomCenter: {
        value: function () {
            return { x: this.x + this.width / 2, y: this.y + (this.height * 0.75) };
        }
    },
    contains: {
        value: function (point, scaleX, scaleY) {
            var edgeX = 0.25;
            if (scaleX) {
                edgeX = (1 - scaleX) / 2;
            }

            var edgeY = 0.25;
            if (scaleY) {
                edgeY = (1 - scaleY) / 2;
            }

            var x1 = this.x + this.width * edgeX;
            var y1 = this.y + this.height * edgeY;
            var x2 = this.x + this.width * (1 - edgeX);
            var y2 = this.y + this.height * (1 - edgeY);
            return point.x > x1 && point.x < x2 && point.y > y1 && point.y < y2;
        }
    }
});

var ForegroundSprite = function (gameScene, url, x, y, width, height) {
    Sprite.call(this, url, x, y, width, height);
    gameScene.add(this);
}

ForegroundSprite.prototype = Object.create(Sprite.prototype, {
    constructor: {
        value: ForegroundSprite
    }
});

var BackgroundSprite = function (gameScene, url, x, y, width, height) {
    Sprite.call(this, url, x, y, width, height);
    gameScene.addBackground(this);
}

BackgroundSprite.prototype = Object.create(Sprite.prototype, {
    constructor: {
        value: BackgroundSprite
    }
});




