import { GUI } from 'dat.gui';
import Konva from 'konva';

// Render at >= 2x device pixels so the path text stays crisp and moves
// smoothly (sub-pixel) even on non-retina displays.
Konva.pixelRatio = Math.max(2, window.devicePixelRatio || 1);

const PI2 = Math.PI / 2;

interface Point {
  x: number;
  y: number;
  /** Origin (resting) position the point is pulled back toward. */
  ox: number;
  oy: number;
  /** Velocity. */
  vx: number;
  vy: number;
}

interface Touch {
  x: number;
  y: number;
  z: number;
  force: number;
}

interface BlobLayer {
  points: Point[];
  viscosity: number;
  mouseForce: number;
  forceLimit: number;
  /** The Konva shape this layer renders into; assigned once during setup. */
  line?: Konva.Line;
  /** Colored layers fill a closed blob; text layers stroke a path instead. */
  color?: string;
  /** Where along the border the text path starts. */
  offset?: number;
  reverse?: boolean;
  text?: Konva.TextPath;
}

interface BusinessCardOptions {
  firstName?: string;
  position?: string;
  company?: string;
  tension?: number;
  width?: number;
  height?: number;
  radius?: number;
  margin?: number;
  hoverFactor?: number;
  gap?: number;
  forceFactor?: number;
  noise?: number;
}

class BusinessCard {
  name: string;
  position: string;
  company: string;
  tension: number;
  width: number;
  height: number;
  radius: number;
  margin: number;
  hoverFactor: number;
  gap: number;
  forceFactor: number;
  noise: number;

  stage: Konva.Stage;
  layer: Konva.Layer;
  nameText: Konva.TextPath;
  positionText: Konva.TextPath;
  companyText: Konva.TextPath;
  layers: BlobLayer[];
  touches: Touch[] = [];
  /** While true, a simulated cursor circles the card. Off on first real input. */
  demo = true;

  constructor(options: BusinessCardOptions = {}) {
    this.name = options.firstName ?? 'Tamino Martinius';
    this.position = options.position ?? 'Staff Software Engineer';
    this.company = options.company ?? 'ServiceNow';
    this.tension = options.tension ?? 0.4;
    this.width = options.width ?? 400;
    this.height = options.height ?? 250;
    this.radius = Math.min(options.radius ?? 12, this.width / 2, this.height / 2);
    this.margin = options.margin ?? 50;
    this.hoverFactor = options.hoverFactor ?? 0;
    this.gap = options.gap ?? 2;
    this.forceFactor = options.forceFactor ?? 0.2;
    this.noise = options.noise ?? 0;

    this.stage = new Konva.Stage({
      container: 'business-card',
      width: this.width + this.margin * 2,
      height: this.height + this.margin * 2,
    });
    // A layer always tracks its stage's size, so it needs no explicit dimensions.
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.on('mousemove', this.mousemove);
    this.stage.on('mouseout', this.mouseout);

    this.nameText = new Konva.TextPath({
      text: this.name,
      data: '',
      y: 40,
      fill: '#fff',
      fontSize: 24,
      fontFamily: 'Arial',
    });
    this.positionText = new Konva.TextPath({
      text: this.position,
      data: '',
      y: 80,
      fill: '#fff',
      fontSize: 16,
      fontFamily: 'Arial',
    });
    this.companyText = new Konva.TextPath({
      text: this.company,
      data: '',
      y: -40,
      fill: '#fff',
      fontSize: 24,
      fontFamily: 'Arial',
    });

    this.layers = [
      {
        points: [],
        viscosity: 0.35,
        mouseForce: 50,
        forceLimit: 1,
        offset: 10,
        text: this.nameText,
      },
      {
        points: [],
        viscosity: 0.15,
        mouseForce: 25,
        forceLimit: 0.5,
        offset: 10,
        text: this.positionText,
      },
      {
        points: [],
        viscosity: 0.35,
        mouseForce: 50,
        forceLimit: 1,
        offset: 145,
        reverse: true,
        text: this.companyText,
      },
      { points: [], color: '#E7E8ED', viscosity: 0.5, mouseForce: 100, forceLimit: 2 },
      { points: [], color: '#545A6C', viscosity: 0.65, mouseForce: 150, forceLimit: 3 },
      { points: [], color: '#44BB44', viscosity: 0.8, mouseForce: 200, forceLimit: 4 },
    ];

    // Lines (the blobs) are added first so the text paths sit on top of them.
    for (const layer of this.layers) {
      layer.line = new Konva.Line({ points: [], closed: true });
      this.layer.add(layer.line);
    }
    this.layer.add(this.nameText);
    this.layer.add(this.positionText);
    this.layer.add(this.companyText);

    this.initOrigins();
    this.animate();
  }

  mousemove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // First real cursor movement ends the demo and hands control to the user.
    this.demo = false;
    this.touches = [{ x: e.evt.offsetX, y: e.evt.offsetY, z: 0, force: 1 }];
  };

  mouseout = () => {
    if (!this.demo) this.touches = [];
  };

  /** A point looping clockwise around a rectangle 15px outside the card border. */
  demoTouch(): Touch {
    const offset = 15;
    const period = 8000; // ms for one full lap
    const left = this.margin - offset;
    const top = this.margin - offset;
    const w = this.width + offset * 2;
    const h = this.height + offset * 2;
    const perimeter = 2 * (w + h);
    const d = ((Date.now() % period) / period) * perimeter;
    let x: number;
    let y: number;
    if (d < w) {
      // Top edge, left → right.
      x = left + d;
      y = top;
    } else if (d < w + h) {
      // Right edge, top → bottom.
      x = left + w;
      y = top + (d - w);
    } else if (d < w + h + w) {
      // Bottom edge, right → left.
      x = left + w - (d - w - h);
      y = top + h;
    } else {
      // Left edge, bottom → top.
      x = left;
      y = top + h - (d - w - h - w);
    }
    return { x, y, z: 0, force: 1 };
  }

  line(pointA: number[], pointB: number[]) {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
      length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
      angle: Math.atan2(lengthY, lengthX),
    };
  }

  controlPoint(
    current: number[],
    previous: number[] | undefined,
    next: number[] | undefined,
    reverse?: boolean,
  ): [number, number] {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = this.line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
  }

  bezierCommand(point: number[], i: number, a: number[][]): string {
    const [cpsX, cpsY] = this.controlPoint(a[i - 1], a[i - 2], point);
    const [cpeX, cpeY] = this.controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
  }

  svgPath(points: number[][]): string {
    return points.reduce(
      (acc, point, i, a) =>
        i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${this.bezierCommand(point, i, a)}`,
      '',
    );
  }

  update() {
    if (this.demo) this.touches = [this.demoTouch()];
    for (const layer of this.layers) {
      for (const point of layer.points) {
        const dx = point.ox - point.x + (Math.random() - 0.5) * this.noise;
        const dy = point.oy - point.y + (Math.random() - 0.5) * this.noise;
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = d * this.forceFactor;
        point.vx += f * (dx / d || 0);
        point.vy += f * (dy / d || 0);
        for (const touch of this.touches) {
          let mouseForce = layer.mouseForce;
          if (
            touch.x > this.margin &&
            touch.x < this.margin + this.width &&
            touch.y > this.margin &&
            touch.y < this.margin + this.height
          ) {
            mouseForce *= -this.hoverFactor;
          }
          const mx = point.x - touch.x;
          const my = point.y - touch.y;
          const md = Math.sqrt(mx * mx + my * my);
          const mf = Math.max(
            -layer.forceLimit,
            Math.min(layer.forceLimit, (mouseForce * touch.force) / md),
          );
          point.vx += mf * (mx / md || 0);
          point.vy += mf * (my / md || 0);
        }
        point.vx *= layer.viscosity;
        point.vy *= layer.viscosity;
        point.x += point.vx;
        point.y += point.vy;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => {
      this.update();
      this.draw();
      this.animate();
    });
  }

  draw() {
    for (const { line, points, color, offset, text, reverse } of this.layers) {
      if (color) {
        line?.points(points.flatMap((point) => [point.x, point.y]));
        line?.tension(this.tension);
        line?.fill(color);
      } else {
        const data = reverse ? [...points].reverse().slice(offset) : points.slice(offset);
        text?.data(this.svgPath(data.map((point) => [point.x, point.y])));
      }
    }
    this.stage.draw();
  }

  createPoint(x: number, y: number): Point {
    return { x, y, ox: x, oy: y, vx: 0, vy: 0 };
  }

  initOrigins() {
    this.stage.width(this.width + this.margin * 2);
    this.stage.height(this.height + this.margin * 2);
    const borderLength = this.radius * PI2;

    for (const layer of this.layers) {
      const points: Point[] = [];
      // Top edge.
      for (let x = this.radius; x < this.width - this.radius; x += this.gap) {
        points.push(this.createPoint(this.margin + x, this.margin));
      }
      // Top-right corner.
      if (borderLength > this.gap) {
        for (let alpha = 0; alpha < borderLength; alpha += this.gap) {
          const angle = (alpha / borderLength) * PI2;
          points.push(
            this.createPoint(
              Math.sin(angle) * this.radius + this.margin + this.width - this.radius,
              (1 - Math.cos(angle)) * this.radius + this.margin,
            ),
          );
        }
      }
      // Right edge.
      for (let y = this.radius; y < this.height - this.radius; y += this.gap) {
        points.push(this.createPoint(this.margin + this.width, this.margin + y));
      }
      // Bottom-right corner.
      if (borderLength > this.gap) {
        for (let alpha = borderLength; alpha >= 0; alpha -= this.gap) {
          const angle = (alpha / borderLength) * PI2;
          points.push(
            this.createPoint(
              Math.sin(angle) * this.radius + this.margin + this.width - this.radius,
              Math.cos(angle) * this.radius + this.margin + this.height - this.radius,
            ),
          );
        }
      }
      // Bottom edge.
      for (let x = this.width - this.radius; x >= this.radius; x -= this.gap) {
        points.push(this.createPoint(this.margin + x, this.margin + this.height));
      }
      // Bottom-left corner.
      if (borderLength > this.gap) {
        for (let alpha = 0; alpha < borderLength; alpha += this.gap) {
          const angle = (alpha / borderLength) * PI2;
          points.push(
            this.createPoint(
              (1 - Math.sin(angle)) * this.radius + this.margin,
              Math.cos(angle) * this.radius + this.margin + this.height - this.radius,
            ),
          );
        }
      }
      // Left edge.
      for (let y = this.height - this.radius; y >= this.radius; y -= this.gap) {
        points.push(this.createPoint(this.margin, this.margin + y));
      }
      // Top-left corner.
      if (borderLength > this.gap) {
        for (let alpha = borderLength; alpha >= 0; alpha -= this.gap) {
          const angle = (alpha / borderLength) * PI2;
          points.push(
            this.createPoint(
              (1 - Math.sin(angle)) * this.radius + this.margin,
              (1 - Math.cos(angle)) * this.radius + this.margin,
            ),
          );
        }
      }
      layer.points = points;
    }
  }
}

const card = new BusinessCard();

const redraw = () => {
  card.initOrigins();
};

const gui = new GUI();
gui.add(card, 'gap', 1, 20, 1).onChange(redraw);
gui.add(card, 'radius', 0, 50, 1).onChange(redraw);
gui.add(card, 'width', 50, 500, 1).onChange(redraw);
gui.add(card, 'height', 10, 500, 1).onChange(redraw);
gui.add(card, 'margin', 10, 100, 1).onChange(redraw);
gui.add(card, 'tension', 0, 1, 0.01);
gui.add(card, 'forceFactor', -1, 1, 0.01);
gui.add(card, 'hoverFactor', -1, 1, 0.01);

const nameLayer = card.layers[0];
const nameFolder = gui.addFolder('Name');
nameFolder.add(card, 'name').onChange((value: string) => card.nameText.text(value));
nameFolder.add(nameLayer, 'viscosity', 0, 1, 0.01);
nameFolder.add(nameLayer, 'mouseForce', -200, 200, 1);
nameFolder.add(nameLayer, 'forceLimit', -10, 10, 0.1);
nameFolder.add(nameLayer, 'offset', 0, 20, 1);

const positionLayer = card.layers[1];
const positionFolder = gui.addFolder('Position');
positionFolder.add(card, 'position').onChange((value: string) => card.positionText.text(value));
positionFolder.add(positionLayer, 'viscosity', 0, 1, 0.01);
positionFolder.add(positionLayer, 'mouseForce', -200, 200, 1);
positionFolder.add(positionLayer, 'forceLimit', -10, 10, 0.1);
positionFolder.add(positionLayer, 'offset', 0, 200, 1);

const companyLayer = card.layers[2];
const companyFolder = gui.addFolder('Company');
companyFolder.add(card, 'company').onChange((value: string) => card.companyText.text(value));
companyFolder.add(companyLayer, 'viscosity', 0, 1, 0.01);
companyFolder.add(companyLayer, 'mouseForce', -200, 200, 1);
companyFolder.add(companyLayer, 'forceLimit', -10, 10, 0.1);
companyFolder.add(companyLayer, 'offset', 0, 200, 1);

// Colored blobs (array indices 3–5) are numbered from 1 in the UI, so e.g.
// index 4 shows as "Layer 2".
for (let layerIndex = 3; layerIndex < card.layers.length; layerIndex++) {
  const layer = card.layers[layerIndex];
  const folder = gui.addFolder(`Layer ${layerIndex - 2}`);
  folder.addColor(layer, 'color');
  folder.add(layer, 'viscosity', 0, 1, 0.01);
  folder.add(layer, 'mouseForce', -200, 200, 1);
  folder.add(layer, 'forceLimit', -10, 10, 0.1);
}

if (window.innerWidth < 1000) {
  gui.close();
}
