/// <reference path="core.js" />

// UI alignment
const ALIGN_LEFT = "left";
const ALIGN_TOP = "top";
const ALIGN_RIGHT = "right";
const ALIGN_BOTTOM = "bottom";
const ALIGN_CENTER = "center";
const ALIGN_STRETCH = "stretch";

// Text alignment
const TEXTALIGN_LEFT = "left";
const TEXTALIGN_RIGHT = "right";
const TEXTALIGN_CENTER = "center";

// Font style
const FONTSTYLE_NORMAL = "normal";
const FONTSTYLE_ITALIC = "italic";
const FONTSTYLE_OBLIQUE = "oblique";

// Font variant
const FONTVARIANT_NORMAL = "normal";
const FONTVARIANT_SMALLCAPS = "small-caps";

// Font weight
const FONTWEIGHT_NORMAL = "normal";
const FONTWEIGHT_BOLD = "bold";
const FONTWEIGHT_BOLDER = "bolder";
const FONTWEIGHT_LIGHTER = "lighter";

var Size = function(width, height) {
    if (width != undefined) {
        this.width = width;
    }

    if (height != undefined) {
        this.height = height;
    }
}

Size.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Size
    },
    width: {
        value: 0,
        writable: true
    },
    height: {
        value: 0,
        writable: true
    }
});

var Rect = function(x, y, width, height) {
    if (x != undefined) {
        this.x = x;
    }

    if (y != undefined) {
        this.y = y;
    }

    if (width != undefined) {
        this.width = width;
    }

    if (height != undefined) {
        this.height = height;
    }
}

Rect.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Rect
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
    }
});

var Margin = function(left, top, right, bottom) {
    if (left != undefined) {
        this.left = left;

        if (top != undefined) {
            this.top = top;
        } else {
            this.top = left;
        }

        if (right != undefined) {
            this.right = right;
        } else {
            this.right = left;
        }

        if (bottom != undefined) {
            this.bottom = bottom;
        } else if (top != undefined) {
            this.bottom = top;
        } else {
            this.bottom = left;
        }
    }
}

Margin.prototype = Object.create(Object.prototype, {
    constructor: {
        value: Margin
    },
    left: {
        value: 0,
        writable: true
    },
    top: {
        value: 0,
        writable: true
    },
    right: {
        value: 0,
        writable: true
    },
    bottom: {
        value: 0,
        writable: true
    }
});



var UICanvasElement = function () {
    this.margin = new Margin(0);
    this.desiredSize = new Size(0, 0);    
}

UICanvasElement.prototype = Object.create(Object.prototype, {
    constructor: {
        value: UICanvasElement
    },
    margin: {
        value:null ,
        writable: true
    },
    desiredSize: {
        value: null,
        writable: true
    },
    horizontalAlignment: {
        value: ALIGN_STRETCH,
        writable: true
    },
    verticalAlignment: {
        value: ALIGN_STRETCH,
        writable: true
    },
    measure: {
        value: function (context, availableSize) {
            this.desiredSize = this.measureOverride(context, availableSize);
        }
    },
    measureOverride: {
        value: function (context, availableSize) {
            var width = availableSize.width;
            var height = availableSize.height;

            if (this.width) {
                width = this.width + this.margin.top + this.margin.bottom;
            }
            else if (this.horizontalAlignment == ALIGN_STRETCH) {
                width = Math.max(availableSize.width, this.margin.left + this.margin.right);
            }
            else {
                width = this.margin.top + this.margin.bottom;
            }            

            if (this.height) {
                height = this.height + this.margin.top + this.margin.bottom;
            }
            else if (this.verticalAlignment == ALIGN_STRETCH) {
                height = Math.max(availableSize.height, this.margin.top + this.margin.bottom);
            } 
            else {
                height = this.margin.top + this.margin.bottom;
            }

            return new Size(Math.min(width, availableSize.width), Math.min(height, availableSize.height));
        }
    },
    getDrawRect: {
        value: function(rect) {
            var x = rect.x + this.margin.left;
            var y = rect.y + this.margin.top;

            var width = rect.width;
            if (this.width) {
                width = Math.min(rect.width, this.width) 
            } else {
                width = this.desiredSize.width - this.margin.left - this.margin.right;
            }

            var height = rect.height;
            if (this.height) {
                height = Math.min(rect.height, this.height);
            } else {
                height = this.desiredSize.height - this.margin.top - this.margin.bottom;;
            }

            if (this.horizontalAlignment == ALIGN_STRETCH || this.horizontalAlignment == ALIGN_CENTER) {
                x += ((rect.width - this.margin.left - this.margin.right) - width) / 2;
            }
            else if (this.horizontalAlignment == ALIGN_RIGHT) {
                x = rect.x + rect.width - width - this.margin.right;
            }

            if (this.verticalAlignment == ALIGN_STRETCH || this.verticalAlignment == ALIGN_CENTER) {
                y += ((rect.height - this.margin.top - this.margin.bottom) - height) / 2;
            } 
            else if (this.verticalAlignment == ALIGN_BOTTOM) {
                y = rect.y + rect.height - height - this.margin.bottom;
            }
            

            return new Rect(x, y, width, height);
        }
    },
    draw: {
        value: function (context, rect) {
            context.save();
            this.drawOverride(context, rect);            
            context.restore();
        }
    },
    drawOverride: {
        value: function (context, rect) {
        }
    },
});


var UICanvas = function () {
    this._children = new List();
}

UICanvas.prototype = Object.create(Object.prototype, {
    constructor: {
        value: UICanvas
    },
    _children: {
        value: null,
        writable: true
    },
    addChild: {
        value: function(child) {
            this._children.add(child);
        }
    },
    clear: {
        value: function (context, color) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.beginPath();
            context.closePath();

            if (color) {
                var fillStyle = context.fillStyle;
                context.fillStyle = color;
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                context.fillStyle = fillStyle;
            }
        }
    },
    draw: {
        value: function(context) {
            for (var i = 0; i < this._children.count(); i++) {
                var child = this._children.itemAt(i);
                child.measure(context, new Size(context.canvas.width, context.canvas.height));
            }

            for (var i = 0; i < this._children.count(); i++) {
                var child = this._children.itemAt(i);
                child.draw(context, new Rect(0, 0, context.canvas.width, context.canvas.height));
            }
        }
    }
});

var UILabel = function (text) {
    UICanvasElement.call(this);
    if (text != undefined) {
        this.text = text;
    }
}

UILabel.prototype = Object.create(UICanvasElement.prototype, {
    constructor: {
        value: UILabel
    },
    text: {
        value: null,
        writable: true
    },
    fontFamily: {
        value: "Arial",
        writable: true
    },
    fontWeight: {
        value: FONTWEIGHT_NORMAL,
        writable: true
    },
    fontStyle: {
        value: FONTSTYLE_NORMAL,
        writable: true
    },
    fontVariant: {
        value: FONTVARIANT_NORMAL,
        writable: true
    },
    fontSize: {
        value: 20,
        writable: true
    },
    fontSizeUnit: {
        value: "px",
        writable: true
    },
    textAlignment: {
        value: TEXTALIGN_LEFT,
        writable: true
    },
    wrap: {
        value: true,
        writable: true
    },
    foreground: {
        value: "black",
        writable: true
    },
    lineSpacing: {
        value: 1.5,
        writable: true
    },
    measureOverride: {
        value: function (context, availableSize) {
            this._setContext(context);
            var lines = this._getLines(context, availableSize.width - this.margin.left - this.margin.right);

            var width = 0;
            var lineHeight = 0;
            for(var i = 0; i < lines.length; i++) {
                var textSize = context.measureText(lines[0]);    
                lineHeight = Math.max(lineHeight, (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) * this.lineSpacing);
                width = Math.max(width, textSize.width);
            }

            var width = textSize.width;
            var height = lines.length * lineHeight;

            if (this.width) {
                width = this.width + this.margin.top + this.margin.bottom;
            }
            else if (this.horizontalAlignment == ALIGN_STRETCH) {
                width = Math.max(availableSize.width, width + this.margin.left + this.margin.right);
            }
            else {
                width += this.margin.left + this.margin.right;
            }            

            if (this.height) {
                height = this.height + this.margin.top + this.margin.bottom;
            }
            else if (this.verticalAlignment == ALIGN_STRETCH) {
                height = Math.max(availableSize.height, height + this.margin.top + this.margin.bottom);
            } 
            else {
                height += this.margin.top + this.margin.bottom;
            }

            return new Size(Math.min(width, availableSize.width), Math.min(height, availableSize.height));
        }
    },
    drawOverride: {
        value: function(context, rect) {                        
            if (this.text != undefined) {
                var drawRect = UICanvasElement.prototype.getDrawRect.call(this, rect); 
                
                context.rect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);
                context.clip();

                this._setContext(context);
                var lines = this._getLines(context, drawRect.width);
                
                var y = drawRect.y;
                for(var i = 0; i < lines.length; i++) {
                    var textSize = context.measureText(lines[i]);
                    var x = drawRect.x;
                    if (i == 0 && lines.length == 1) {
                        y += textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent;
                    }
                    else {
                        y += (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) * this.lineSpacing;
                    }

                    if (this.textAlignment == TEXTALIGN_CENTER) {
                        x += (drawRect.width - textSize.width) / 2;
                    }
                    else if (this.textAlignment == TEXTALIGN_RIGHT) {
                        x = drawRect.x + drawRect.width - textSize.width;
                    }

                    context.fillText(lines[i], x, y);
                }
            }
        }
    },
    _getLines: {
        value: function(context, maxWidth) {
            var lines = [];
            if (this.wrap) {
                var words = this.text.split(" ");
                var line = "";            
                var wordCount = 0;
                for(var i = 0; i < words.length; i++) {
                    var testLine = line;
                    if (testLine != "") {
                        testLine += " ";
                    }

                    testLine += words[i];
                    wordCount++;
                    var lineSize = context.measureText(testLine);
                    if (lineSize.width > maxWidth && wordCount > 1) {
                        lines.push(line);
                        line = words[i];
                        wordCount = 1;
                    } 
                    else {
                        line = testLine;
                    }
                }

                if (line != "") {
                    lines.push(line);
                }
            }
            else {
                lines.push(this.text);
            }
            
            return lines;
        }
    },
    _setContext: {
        value: function(context) {
            context.font = this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + this.fontSizeUnit + " " + this.fontFamily;
            context.fillStyle = this.foreground;
        }
    }
});

var UIBorder = function () {
    UICanvasElement.call(this);
}

UIBorder.prototype = Object.create(UICanvasElement.prototype, {
    constructor: {
        value: UIBorder
    },
    content: {
        value: null,
        writable: true
    },
    strokeThickness: {
        value: 1,
        writable: true
    },
    stroke: {
        value: "black",
        writable: true
    },
    measureOverride: {
        value: function (context, availableSize) {
            var size = UICanvasElement.prototype.measureOverride.call(this, context, availableSize);

            if (this.content) {
                this.content.measure(context, new Size(size.width - this.margin.left - this.margin.right, size.height - this.margin.top - this.margin.bottom));
                size.width = Math.max(size.width, this.content.desiredSize.width + this.margin.left + this.margin.right);
                size.height = Math.max(size.height, this.content.desiredSize.height + this.margin.top + this.margin.bottom);
            }

            return size;
        }
    },
    drawOverride: {
        value: function(context, rect) {            
            var drawRect = this.getDrawRect(rect);

            context.rect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);
            context.clip();
            if (this.content) {
                this.content.draw(context, drawRect);
            }

            context.lineWidth = this.strokeThickness;
            context.strokeStyle = this.stroke;
            context.strokeRect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);
        }
    }
});


var UIPanel = function () {
    UICanvasElement.call(this);
    this._children = new List();
}

UIPanel.prototype = Object.create(UICanvasElement.prototype, {
    constructor: {
        value: UIPanel
    },
    _children: {
        value: null,
        writable: true
    },
    addChild: {
        value: function(child) {
            this._children.add(child);
        }
    },
    removeChild: {
        value: function(child) {
            this._children.remove(child);
        }
    },
    count: {
        value: function() {
            return this._children.count();
        }
    },
    childAt: {
        value: function(index) {
            if (index >= 0 && index < this._children.count()) {
                return this._children.itemAt(index);
            }
            
            return null;
        }
    }
});

var UIGrid = function (columns, rows) {
    UIPanel.call(this);    
    if (columns != undefined && columns > 0) {
        this._columns = columns;
    }

    if (rows != undefined && rows > 0) {
        this._rows = rows;
    }
}

UIGrid.prototype = Object.create(UIPanel.prototype, {
    constructor: {
        value: UIGrid
    },
    _columns: {
        value: 1,
        writable: true
    },
    _rows: {
        value: 1,
        writable: true
    },
    measureOverride: {
        value: function (context, availableSize) {
            var size = UICanvasElement.prototype.measureOverride.call(this, context, availableSize);

            var childSize = new Size((size.width - this.margin.left - this.margin.right) / this._columns, (size.height - this.margin.top - this.margin.bottom) / this._rows);            
            var index = 0;
            for(var row = 0; row < this._rows; row++) {
                for (var column = 0; column < this._columns; column++) {
                    var child = this.childAt(index);
                    child.measure(context, childSize);
                    index++;
                }
            }

            return size;
        }
    },
    drawOverride: {
        value: function(context, rect) {    
            var drawRect = this.getDrawRect(rect);
            var childWidth = drawRect.width / this._columns;
            var childHeight = drawRect.height / this._rows;
            var index = 0;
            for(var row = 0; row < this._rows; row++) {
                for (var column = 0; column < this._columns; column++) {
                    var child = this.childAt(index);
                    child.draw(context, new Rect(drawRect.x + (column * childWidth), drawRect.y + (row * childHeight), childWidth, childHeight));
                    index++;
                }
            }
        }
    }
});