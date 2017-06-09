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

    const { elemId, height, width, texts, toLeft, sperateX, sperateY, lineHeight, fps, loop, opacity, strokeColor } = obj;

    this._height = height || 300;          // 画布高，默认300px
    this._width = width || 400;            // 画布宽，默认400px
    this._texts = texts || [];             // 一行中每段文本的水平间隔，默认40px
    this._toLeft = toLeft || false;        // 行与行之间的间隔，默认40px
    this._sperateX = sperateX || 40;       // 文字的行高，默认80px
    this._sperateY = sperateY || 40;       // 移动方向是否向左，默认为false
    this._lineHeight = lineHeight || 80;   // 移动帧率 默认50
    this._fps = fps || 50;                 // 弹幕文本信息
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
        let fontSize = style.match(/\d+px/)[0];
        fontSize = fontSize ? parseInt(fontSize) : 20;
        val.style = style.replace(fontSize, fontSize * this._ratio);
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
    this._interval = setInterval(() => {
      this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height);
      if (!this._texts.length) {
        clearInterval(this._interval);
        return;
      }
      this._texts.forEach((item, index) => {
        const speed = this._cvs.width / ((item.time || 10) * this._fps) * (this._toLeft ? -1 : 1);
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
            this._ctx.strokeText(content, val.pos, this._lineHeight * index + this._sperateY);
          }
          this._ctx.fillText(content, val.pos, this._lineHeight * index + this._sperateY);
          if (!this._loop && this._judgeDispear(val, this._toLeft)) { // 是否循环
            item.text.splice(i, 1);
          }
        });
      });
    }, 1000 / this._fps);
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