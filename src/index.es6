import './index.css';

(() => {
  const _screenWidth = document.documentElement.clientWidth;
  const _screenHeight = document.documentElement.clientHeight;
  let flowInterval = '';
  const pageTexts = [
    {
      text: [
        {style:'28px Arial',color: 'red',content:'属性值的效果'},
        {style:'24px arial',color: 'white',content:'对齐的方法总结'},
        {style:'24px arial',color: 'blue',content:'激情'},
        {style:'26px arial',color: 'lightblue',content:'测量的文本'},
        {style:'20px arial',color: 'white',content:'绘图环境提供三个方法如'}
      ],
      time: 8,
    },
    {
      text: [
        {style:'25px arial',color: 'yellow',content:'工作狂'},
        {style:'22px arial',color: 'white',content:'不加班'},
        {style:'20px arial',color: 'purple',content:'宅'},
        {style:'26px arial',color: 'grey',content:'coding虐你千百遍'},
        {style:'24px arial',color: 'white',content:'脚本之家'}
      ],
      time: 9,
    },
    {
      text: [
        {style:'28px arial',color: 'pink',content:'心的坐标吗'},
        {style:'24px arial',color: 'white',content:'返回一个度量'}
      ],
      time: 7,
    },
  ];
  initCvs('barrage', 300, 400, pageTexts);


  /**
   * 开始流动
   * @param cvs 画布
   * @param ctx 画笔
   * @param ratio
   * @param textArr 弹幕数组
   * @param toLeft 是否向左流动
   */
  function startFlow(cvs, ctx, ratio, texts, toLeft) {
    // flowInterval = setInterval(() => {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      texts.forEach((item, index) => {
        let prevWidth = 0;
        item.text.forEach((val, i) => {
          let { content, style, color} = val
          let fontSize = style.match(/\d+px/)[0];
          fontSize = fontSize ? parseInt(fontSize) : 20;
          //按ratio缩放字体
          ctx.font = style.replace(fontSize, fontSize * ratio);
          ctx.fillStyle = color;
          ctx.textBaseline = "middle";
          ctx.fillText(content, prevWidth, 80 * index + 40);
          prevWidth += (ctx.measureText(content).width + 40);
        });
      });
    // },20);
  }

  /**
   * 初始画布，返回画布信息
   * @param elemId canvas的id
   * @param height 画布的高
   * @param width 画布的宽
   */
  function initCvs(elemId, height, width, texts) {
    const cvs = document.getElementById(elemId);
    const ratio = getPixelRatio(cvs);
    const ctx = cvs.getContext('2d');
    cvs.width = width * ratio;
    cvs.height = height * ratio;
    cvs.style.width = width + 'px';
    cvs.style.height = height + 'px';
    startFlow(cvs, ctx, ratio, texts)
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