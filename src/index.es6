import './index.css';

(() => {
  // defined Barrager
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

      const { elemId, height, width, texts, toLeft, sperateX, sperateY, lineHeight, fps } = obj;

      this._height = height || 300;          // 画布高，默认300px
      this._width = width || 400;            // 画布宽，默认400px
      this._texts = texts || [];             // 一行中每段文本的水平间隔，默认40px
      this._toLeft = toLeft || false;        // 行与行之间的间隔，默认40px
      this._sperateX = sperateX || 40;       // 文字的行高，默认80px
      this._sperateY = sperateY || 40;       // 移动方向是否向左，默认为false
      this._lineHeight = lineHeight || 80;   // 移动帧率 默认50
      this._fps = fps || 50;                 // 弹幕文本信息

      this._cvs = document.getElementById(elemId);
      this._ratio = this._getPixel(this._cvs);
      this._ctx = this._cvs.getContext('2d');
      this._cvs.width = this._width * this._ratio;
      this._cvs.height = this._height * this._ratio;
      this._cvs.style.width = this._width + 'px';
      this._cvs.style.height = this._height + 'px';
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
          prevTextWidth += this._sperateX;
        });
        item.lineW = prevTextWidth;
      });
    },
    _startFlow: function () {
      setInterval(() => {
        this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height)
        this._texts.forEach((item, index) => {
          const speed = this._cvs.width / ((item.time || 10) * this._fps) * (this._toLeft ? -1 : 1);
          item.text.forEach((val, i) => {
            let { content, style, color } = val
            this._ctx.font = style;
            this._ctx.fillStyle = color;
            this._ctx.textBaseline = "middle";
            this._ctx.textAlign = this._toLeft ? 'right' : 'left';
            val.pos += speed;
            this._judgeBack(val, item.lineW);
            this._ctx.fillText(content, val.pos, this._lineHeight * index + this._sperateY);
          });
        });
      }, 1000 / this._fps);
    },
    _judgeBack: function (text, limit) {
      const { pos, selfWith } = text;
      if (this._toLeft) {
        if (pos < 0 && (pos - selfWith) < -limit) {
          text.pos = this._cvs.width + selfWith;
        }
      } else {
        const rightOver = limit > this._cvs.width ? limit : this._cvs.width + limit;
        if (pos > this._cvs.width && (pos + selfWith) > rightOver) {
          text.pos = - selfWith;
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

  // use Barrager
  const options = {
    elemId: 'barrage',     // canvas id
    height: 300,           // 画布高，默认300px
    width: 400,            // 画布宽，默认400px
    sperateX: 40,          // 一行中每段文本的水平间隔，默认40px
    sperateY: 40,          // 行与行之间的间隔，默认40px
    lineHeight: 80,        // 文字的行高，默认80px
    toLeft: false,         // 移动方向是否向左，默认为false
    fps: 60,               // 移动帧率 默认50
    texts: [               // 弹幕文本信息
      {
        text: [
          { style: '28px Arial', color: 'red', content: '属性值的效果' },
          { style: '24px arial', color: 'white', content: '对齐的方法总结' },
          { style: '24px arial', color: 'blue', content: '激情' },
          { style: '26px arial', color: 'lightblue', content: '测量的文本' },
          { style: '20px arial', color: 'white', content: '绘图环境提供三个方法如' }
        ],
        time: 10,           // 文本移动时间， 默认10
      },
      {
        text: [
          { style: '25px arial', color: 'yellow', content: '工作狂' },
          { style: '22px arial', color: 'white', content: '不加班' },
          { style: '20px arial', color: 'purple', content: '宅' },
          { style: '26px arial', color: 'grey', content: 'coding虐你千百遍' },
          { style: '24px arial', color: 'white', content: '脚本之家' }
        ],
        time: 8,
      },
      {
        text: [
          { style: '28px arial', color: 'pink', content: '心标吗' },
          { style: '24px arial', color: 'white', content: '返个度量' }
        ],
        time: 7,
      },
    ]
  }

  new Barrager(options);
})();