import './index.css';
import Barrager from './barrage.es6';

(() => {
  const screenWidth = document.documentElement.clientWidth;
  const screenHeight = document.documentElement.clientHeight;
  // use Barrager
  const options = {
    elemId: 'barrage',
    height: screenHeight / 2,
    width: screenWidth / 2,
    fps: 50,
    loop: true,
    toLeft: true,
    opacity: 0.3,
    strokeColor: '#f00',
    texts: [
      {
        text: [
          { style: '28px Arial', color: 'red', content: '属性值的效果' },
          { style: '24px arial', color: 'white', content: '对齐的方法总结' },
          { style: '24px arial', color: 'blue', content: '激' },
          { style: '26px arial', color: 'lightblue', content: '测量的文本' },
          { style: '20px arial', color: 'white', content: '绘图环境提供三个方法如' }
        ],
        time: 10,           // 文本移动时间， 默认10
      },
      {
        text: [
          { style: '25px arial', color: 'yellow', content: '工作狂' },
          { style: '24px arial', color: 'purple', content: '宅有毒' },
          { style: '22px arial', color: 'white', content: '不加班' },
          { style: '26px arial', color: 'grey', content: '虐你千百遍' },
          { style: '24px arial', color: 'white', content: '脚本之家' }
        ],
        time: 8,
      },
      {
        text: [
          { style: '28px arial', color: 'pink', content: '心标吗' },
          { style: '24px arial', color: 'white', content: '返个度量返个度量返个度量返个度量返个度量返个度量' }
        ],
        time: 7,
      },
    ]
  }

  new Barrager(options);
})();