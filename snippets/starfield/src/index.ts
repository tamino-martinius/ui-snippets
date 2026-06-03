import { GUI } from 'dat.gui'

declare var dat: any;

interface Star {
  x: number;
  y: number;
  size: number;
  angle: number;
  velocity: number;
}
const COUNT_MAX = 10000;
const PI2 = Math.PI * 2;

class Starfield {
  settings = {
    count: 1000,
    demo: true,
    colors: [
      '#B24A35',
      '#9CB235',
      '#36B24A',
      '#369DB2',
      '#4A35B2',
    ],
    size: {
      min: 0.1,
      range: 3,
    },
    speed: 100,
    cursor: {
      manual: false,
      clickDuration: 2000,
      clickSize: 2000,
      x: 0,
      y: 0,
      size: {
        radius: -300,
        range: 500,
      },
      impact: 10,
    },
  };

  positionOffset = 0;
  colorSwitchCount = 200;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  currentCount: number = 1000;
  currentSpeed: number = 100;
  stars: Star[] = [];
  canvas = document.getElementsByTagName('canvas')[0] || document.createElement('canvas');
  ctx!: CanvasRenderingContext2D;
  dx = 0;
  dy = 0;
  cursorPosition = 0;
  fW2 = 0;
  fH2 = 0;
  clickStart: number | undefined;

  constructor() {
    this.initCanvas();
    window.addEventListener('resize', () => this.initCanvas());
    window.addEventListener('mousemove', (e) => this.mouseMove(e));
    window.addEventListener('mousedown', (e) => this.mouseDown(e));
    this.initGui();
    this.initStarCount();
  }

  get starAttributes(): Star {
    return {
      size: Math.random(),
      x: Math.random(),
      y: Math.random(),
      angle: Math.random() * PI2,
      velocity: Math.random(),
    };
  }

  initCanvas() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw 'failed to get context';
    this.ctx = ctx;
  }

  initStarCount() {
    this.stars.push(...Array.from({ length: COUNT_MAX }).map(() => this.starAttributes));
  }

  initSpeed() {
    const oldPosition = Date.now() / this.currentSpeed;
    const newPosition = Date.now() / this.settings.speed;
    this.positionOffset += oldPosition - newPosition;
    this.currentSpeed = this.settings.speed;
  }

  mouseMove(e: MouseEvent) {
    if (this.settings.demo) {
      this.settings.demo = false;
    }
    if (!this.settings.cursor.manual) {
      this.settings.cursor.x = e.x;
      this.settings.cursor.y = e.y;
    }
  }

  mouseDown(e: MouseEvent) {
    this.clickStart = Date.now();
  }

  initGui() {
    const gui: GUI = new dat.GUI();
    gui.add(this.settings, 'count', 100, COUNT_MAX, 10).onChange(() => {
      this.currentCount = this.settings.count;
      this.colorSwitchCount = ~~(this.currentCount / 5);
    });
    gui.add(this.settings, 'speed', 1, 100, 1).onChange(() => {
      this.initSpeed();
    });
    const size = gui.addFolder('size');
    size.open();
    size.add(this.settings.size, 'min', 0.1, 2, 0.1);
    size.add(this.settings.size, 'range', 0, 5, 0.1);
    const cursor = gui.addFolder('cursor');
    cursor.open();
    cursor.add(this.settings.cursor, 'manual').listen();
    cursor.add(this.settings.cursor, 'x').listen();
    cursor.add(this.settings.cursor, 'y').listen();
    cursor.add(this.settings.cursor, 'clickDuration', 10, 5000);
    cursor.add(this.settings.cursor, 'clickSize', 0, 3000);
    cursor.add(this.settings.cursor.size, 'radius', -1000, 3000).listen();
    cursor.add(this.settings.cursor.size, 'range', 0, 1000).listen();
    cursor.add(this.settings.cursor, 'impact', 0, 20, 0.1);
    const colors = gui.addFolder('colors');
    colors.open();
    colors.addColor(this.settings.colors, '0');
    colors.addColor(this.settings.colors, '1');
    colors.addColor(this.settings.colors, '2');
    colors.addColor(this.settings.colors, '3');
    colors.addColor(this.settings.colors, '4');
    gui.add(this.settings, 'demo').listen();
  }

  demo() {
    if (Math.random() > 0.999) this.clickStart = Date.now();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let colorIndex = 0;
    const position = this.positionOffset + Date.now() / this.currentSpeed;
    const baseWidth = Math.ceil(position) * this.width;
    const baseHeight = Math.ceil(position) * this.height;
    if (this.settings.demo) {
      this.cursorPosition = position / 10;
      this.fW2 = this.width * 0.5;
      this.fH2 = this.height * 0.5;
      this.settings.cursor.x = ~~(this.fW2 + this.fW2 * Math.sin(this.cursorPosition) * Math.tan(Math.sin(this.cursorPosition * 1.5)));
      this.settings.cursor.y = ~~(this.fH2 + this.fH2 * Math.sin(this.cursorPosition * 2) * Math.tan(Math.cos(this.cursorPosition)));
    }

    for (let i = 0; i < this.currentCount; i += 1) {
      const star = this.stars[i];
      const x = (baseWidth + star.x * this.width + Math.sin(star.angle) * position) % this.width;
      const y = (baseHeight + star.y * this.height + Math.cos(star.angle) * position) % this.height;
      if (i % this.colorSwitchCount === 0) {
        this.ctx.fill();
        this.ctx.fillStyle = this.settings.colors[colorIndex];
        colorIndex += 1;
        this.ctx.beginPath();
      }
      let impact = 0;
      if (this.settings.cursor.impact > 0) {
        let cursorRadius = this.settings.cursor.size.radius;
        if (this.clickStart) {
          const elapsed = Date.now() - this.clickStart;
          if (this.settings.cursor.clickDuration < elapsed) {
            this.clickStart = undefined;
          } else {
            cursorRadius += (elapsed / this.settings.cursor.clickDuration) * this.settings.cursor.clickSize;
          }
        }
        const distance = Math.sqrt(Math.pow(x - this.settings.cursor.x, 2) + Math.pow(y - this.settings.cursor.y, 2));
        if (cursorRadius < distance && distance < cursorRadius + this.settings.cursor.size.range) {
          impact = this.settings.cursor.impact * Math.sin((distance - cursorRadius) * Math.PI / this.settings.cursor.size.range);
        }
      }
      this.ctx.moveTo(x, y);
      this.ctx.arc(x, y, star.size * this.settings.size.range + this.settings.size.min + impact, 0, 360);
    };
    this.ctx.fill();
  }
}

const starfield = new Starfield();
const draw = starfield.draw.bind(starfield);
const demo = starfield.demo.bind(starfield);

console.log(starfield);

function run() {
  requestAnimationFrame(run);
  demo();
  draw();
}

run();
