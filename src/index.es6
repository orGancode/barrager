import './index.css';
import Barrager from './barrage.es6';

(() => {
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
    loop: true,
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