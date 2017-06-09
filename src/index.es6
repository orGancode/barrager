import './index.css';

(() => {
  const _screenWidth = document.documentElement.clientWidth;
  const _screenHeight = document.documentElement.clientHeight;
  let flowInterval = '';
  const sperateX = 40;
  const sperateY = 40;
  const lineHeight = 80;
  const pageTexts = [
    {
      text: [
        {style:'28px Arial',color: 'red',content:'属性值的效果'},
        {style:'24px arial',color: 'white',content:'对齐的方法总结'},
        {style:'24px arial',color: 'blue',content:'激情'},
        {style:'26px arial',color: 'lightblue',content:'测量的文本'},
        {style:'20px arial',color: 'white',content:'绘图环境提供三个方法如'}
      ],
      time: 10,
      lineW: 0,
    },
    {
      text: [
        {style:'25px arial',color: 'yellow',content:'工作狂'},
        {style:'22px arial',color: 'white',content:'不加班'},
        {style:'20px arial',color: 'purple',content:'宅'},
        {style:'26px arial',color: 'grey',content:'coding虐你千百遍'},
        {style:'24px arial',color: 'white',content:'脚本之家'}
      ],
      time: 8,
      lineW: 0,
    },
    {
      text: [
        {style:'28px arial',color: 'pink',content:'心标吗'},
        {style:'24px arial',color: 'white',content:'返个度量'}
      ],
      time: 7,
      lineW: 0,
    },
  ];
  initCvs('barrage', 300, 400, pageTexts, true);


  function rebuildTexts(ctx, texts, ratio, toLeft) {
    texts.forEach((item, index) => {
      let prevTextWidth = 0;
      item.text.forEach((val, i) => {
        let { content, style, color} = val
        let fontSize = style.match(/\d+px/)[0];
        fontSize = fontSize ? parseInt(fontSize) : 20;
        val.style = style.replace(fontSize, fontSize * ratio);
        ctx.font = val.style;
        val.selfWith = ctx.measureText(content).width + sperateX;
        if (toLeft) {
          prevTextWidth += val.selfWith;
          val.pos = prevTextWidth;
        } else {
          val.pos = prevTextWidth;
          prevTextWidth += val.selfWith;
        }
        prevTextWidth += sperateX;
      });
      item.lineW = prevTextWidth;
    });
  }

  function startFlow(cvs, ctx, ratio, texts, toLeft) {
    flowInterval = setInterval(() => {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      texts.forEach((item, index) => {
        const speed = cvs.width / (item.time * 50) * (toLeft ? -1 : 1);
        item.text.forEach((val, i) => {
          let { content, style, color} = val
          ctx.font = style;
          ctx.fillStyle = color;
          ctx.textBaseline = "middle";
          ctx.textAlign = toLeft ? 'right' : 'left';
          val.pos += speed;
          judgeBack(cvs, val, item.lineW, toLeft);
          ctx.fillText(content, val.pos, lineHeight * index + sperateY);
        });
      });
    },20);
  }

  function judgeBack(cvs, text, limit, toLeft) {
    const { pos, selfWith } = text;
    if (toLeft) {
      if (pos < 0 && (pos - selfWith) < -limit) {
        text.pos = cvs.width + selfWith;
      }
    } else {
      const rightOver = limit > cvs.width ? limit : cvs.width + limit;
      if (pos > cvs.width && (pos + selfWith) > rightOver) {
        text.pos = - selfWith;
      }
    }
  }

  function initCvs(elemId, height, width, texts, toLeft) {
    const cvs = document.getElementById(elemId);
    const ratio = getPixelRatio(cvs);
    const ctx = cvs.getContext('2d');
    cvs.width = width * ratio;
    cvs.height = height * ratio;
    cvs.style.width = width + 'px';
    cvs.style.height = height + 'px';
    rebuildTexts(ctx, pageTexts, ratio, toLeft);
    startFlow(cvs, ctx, ratio, texts, toLeft);
  }

  // get devices canvas ratio
  function getPixelRatio(context) {
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }

})();