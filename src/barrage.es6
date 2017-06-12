(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

function Barrager(obj) {
  this._init(obj);
}

Barrager.prototype = {
  constructor: Barrager,
  _init: function (obj) {
    if (!obj) {
      console.log('please add valid options for Barrager');
      return;
    }

    const { elemId, height, width, texts, toLeft, sperateX, sperateY, lineHeight, loop, opacity, strokeColor } = obj;

    this._height = height || 300;          // 画布高，默认300px
    this._width = width || 400;            // 画布宽，默认400px
    this._texts = texts || [];             // 弹幕文本信息
    this._toLeft = toLeft || false;        // 移动方向是否向左，默认为false
    this._sperateX = sperateX || 40;       // 一行中每段文本的水平间隔，默认40px
    this._sperateY = sperateY || 40;       // 行与行之间的间隔，默认40px
    this._lineHeight = lineHeight || 80;   // 文字的行高，默认80px
    this._loop = loop || false;            // 开启弹幕循环播放, 默认关闭
    this._opacity = opacity || 1;          // 透明度
    this._strokeColor = strokeColor || false; // 字体描边样式，默认关闭


    this._cvs = document.getElementById(elemId);
    this._ratio = this._getPixel(this._cvs);
    this._ctx = this._cvs.getContext('2d');
    this._cvs.width = this._width * this._ratio;
    this._cvs.height = this._height * this._ratio;
    this._cvs.style.width = this._width + 'px';
    this._cvs.style.height = this._height + 'px';
    this._ctx.globalAlpha = this._opacity;
    this._rebuildTexts();
    this._startFlow();
  },
  _rebuildTexts: function () {
    this._texts.forEach((item, index) => {
      let prevTextWidth = 0;
      item.text.forEach((val, i) => {
        let { content, style, color } = val
        style = style || '20px Arial';
        color = color || 'white';
        let fontSize = style.match(/\d+px/)[0];
        val.style = style.replace(parseInt(fontSize), parseInt(fontSize) * this._ratio);
        val.posY = index * this._lineHeight + this._sperateY;
        this._ctx.font = val.style;
        val.selfWith = this._ctx.measureText(content).width + this._sperateX;
        if (this._toLeft) {
          prevTextWidth += val.selfWith;
          val.pos = prevTextWidth;
        } else {
          val.pos = prevTextWidth;
          prevTextWidth += val.selfWith;
        }
      });
      item.lineW = prevTextWidth;
    });
  },
  _startFlow: function () {
    this._run = () => {
      this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height);
      if (!this._texts.length) {
        cancelAnimationFrame(this._run);
        return;
      }
      this._texts.forEach((item, index) => {
        const speed = this._cvs.width / (item.time || 8000) * (this._toLeft ? -1 : 1) * 10;
        if (!item.text.length) {
          this._texts.splice(index, 1);
        }
        item.text.forEach((val, i) => {
          let { content, style, color } = val
          this._ctx.font = style;
          if (this._strokeColor) { // 是否描边
            this._ctx.strokeStyle = this._strokeColor;
            this._ctx.lineWidth = 1;
          }
          this._ctx.fillStyle = color;
          this._ctx.textBaseline = "middle";
          this._ctx.textAlign = this._toLeft ? 'right' : 'left';
          val.pos += speed;
          if (this._loop) { // 是否循环
            const minPos = this._getMinPos(item.text);
            this._judgeBack(val, item.lineW, minPos);
          }
          if (this._strokeColor) { // 是否描边
            this._ctx.strokeText(content, val.pos, val.posY);
          }
          this._ctx.fillText(content, val.pos, val.posY);
          if (!this._loop && this._judgeDispear(val, this._toLeft)) { // 是否循环
            item.text.splice(i, 1);
          }
        });
      });
      requestAnimationFrame(this._run);
    }
    this._run()
  },
  _getMinPos: function(texts) {
    const poses = texts.map(text => {return text.pos;})
    return Math.min.apply(null, poses);
  },
  _judgeDispear: function(txt, left) {
    return (left && txt.pos < -txt.selfWith || !left && txt.pos > this._cvs.width);
  },
  _judgeBack: function(text, limit, minPos) {
    const { pos, selfWith } = text;
    if (this._toLeft) {
      if (pos < 0 && (pos - selfWith) < -limit) {
        text.pos = this._cvs.width + selfWith;
      }
    } else {
      // pos > this._cvs.width: 文本从右边消失
      // 最左侧的文本全部显示：最小pos > 40
      const rightOver = limit > this._cvs.width ? limit : this._cvs.width + limit;
      if (pos > this._cvs.width && minPos > 0) {
        text.pos = -selfWith;
      }
    }
  },
  _getPixel: function (context) {
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }

}

module.exports = Barrager;