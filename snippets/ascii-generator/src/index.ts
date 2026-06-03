import { GUI } from 'dat.gui'
import { url } from 'inspector';
declare var dat: any;
interface Dict<T> {
  [key: string]: T;
}

enum ColorPalette {
  Monochrome = 'none',
  Grey2Bit = 'grey2bit',
  Grey4Bit = 'grey4bit',
  Grey8Bit = 'grey8bit',
  Color3Bit = 'color3bit',
  Color4Bit = 'color4bit',
  ColorFull = 'color',
}

class AsciiArtGenerator {
  settings = {
    charSet: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~',
    url: '/avatar.png',
    charSamples: 1,
    size: 50,
    contrast: 0,
    brightness: 0,
    alpha: 0,
    ColorPalette: ColorPalette.Grey2Bit,
    debug: false,
    isDemoRunning: true,
    saveAsHtml: () => {
      this.asciiElement.style.setProperty('--width', this.width.toString());
      this.asciiElement.style.setProperty('--height', this.height.toString());
      const blob = new Blob([this.asciiElement.outerHTML]);
      this.exportElement.href = URL.createObjectURL(blob);
      this.exportElement.click();
    },
  };
  demoDirection = -1;
  demoSettings: { url: string, size: number, charSamples: number }[] = [
    {
      url: '/avatar.png',
      size: 50,
      charSamples: 1,
    },
    {
      url: '/slogan.png',
      size: 60,
      charSamples: 2,
    },
    {
      url: '/codepen.png',
      size: 120,
      charSamples: 2,
    },
  ];
  demoIndex = 0;
  isImageLoaded = false;
  charRegions: Dict<number[]> = {};
  colorMap: number[][] = [];
  valueMap: number[][] = [];
  normalizedMap: number[][] = [];
  width: number = 0;
  height: number = 0;
  cachedUrls: Dict<HTMLImageElement> = {};
  asciiElement: HTMLElement;
  exportElement: HTMLAnchorElement;
  debugImageElement: HTMLElement;
  debugCharsElement: HTMLElement;
  colorPalettes: Dict<number[][]> = {};

  constructor() {
    const elements = this.elements;
    this.asciiElement = elements.asciiElement;
    this.exportElement = elements.exportElement;
    this.debugImageElement = elements.debugImageElement;
    this.debugCharsElement = elements.debugCharsElement;

    this.initGui();
    this.generatePalettes();
    this.analyzeCharRegions();
    this.loadFromUrl();
    this.initDemo();
  }

  initDemo() {
    this.demo();
    const stopDemo = () => {
      this.settings.isDemoRunning = false;
      window.removeEventListener('mousedown', stopDemo);
    }
    window.addEventListener('mousedown', stopDemo)
  }

  initGui() {
    const gui: GUI = new dat.GUI();
    gui.add(this.settings, 'charSet').onChange(() => {
      this.analyzeCharRegions();
      this.generate();
    });
    gui.add(this.settings, 'url').listen().onChange(() => this.loadFromUrl());
    gui.add(this.settings, 'charSamples', 1, 3, 1).listen().onChange(() => {
      this.analyzeCharRegions();
      this.loadFromUrl();
    });
    gui.add(this.settings, 'size', 10, 150, 1).listen().onChange(() => this.loadFromUrl());
    gui.add(this.settings, 'contrast', -1, 1, 0.01).onChange(() => {
      this.normalizeValueMap();
      this.generate();
    });
    gui.add(this.settings, 'brightness', -1, 1, 0.01).listen().onChange(() => {
      this.normalizeValueMap();
      this.generate();
    });
    gui.add(this.settings, 'alpha', -1, 1, 0.01).onChange(() => this.generate());
    gui.add(this.settings, 'ColorPalette', ColorPalette).onChange(() => {
      this.generate();
    });
    gui.add(this.settings, 'debug').onChange(() => {
      this.analyzeCharRegions();
      this.loadFromUrl();
    });
    gui.add(this.settings, 'isDemoRunning').listen().onChange(() => {
      if (this.settings.isDemoRunning) {
        this.demo();
      }
    });
    gui.add(this.settings, 'saveAsHtml')
  }

  get elements() {
    const asciiElement = document.getElementById('ascii');
    if (!asciiElement) throw '#ascii Element is missing';
    const exportElement = document.getElementById('export') as HTMLAnchorElement;
    if (!exportElement) throw '#export Element is missing';
    const debugImageElement = document.getElementById('debug-image');
    if (!debugImageElement) throw '#debug-image Element is missing';
    const debugCharsElement = document.getElementById('debug-chars');
    if (!debugCharsElement) throw '#debug-chars Element is missing';
    return { asciiElement, exportElement, debugImageElement, debugCharsElement };
  }

  generatePalettes() {
    this.colorPalettes[ColorPalette.Grey2Bit] = [
      [0, 0, 0],
      [104, 104, 104],
      [184, 184, 184],
      [255, 255, 255],
    ];

    this.colorPalettes[ColorPalette.Grey4Bit] = [];
    for (let i = 0; i < 16; i += 1) {
      this.colorPalettes[ColorPalette.Grey4Bit].push([i * 17, i * 17, i * 17]);
    }

    this.colorPalettes[ColorPalette.Grey8Bit] = [];
    for (let i = 0; i < 256; i += 1) {
      this.colorPalettes[ColorPalette.Grey8Bit].push([i, i, i]);
    }
    this.colorPalettes[ColorPalette.Color3Bit] = [
      [0, 0, 0],
      [0, 249, 45],
      [0, 252, 254],
      [255, 48, 21],
      [255, 62, 253],
      [254, 253, 52],
      [16, 37, 251],
      [255, 255, 255],
    ];
    this.colorPalettes[ColorPalette.Color4Bit] = [...this.colorPalettes[ColorPalette.Color3Bit]];
    for (let i = 1; i < 8; i += 1) {
      this.colorPalettes[ColorPalette.Color4Bit].push([i * 32, i * 32, i * 32]);
    }
  }

  analyzeChar(char: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw 'context creation failed';
    ctx.font = '12px monospace';
    ctx.fillText(char, 2, 10);
    const data = ctx.getImageData(0, 0, 12, 12).data;
    const values: number[] = [];
    const size = 12 / this.settings.charSamples;
    for (let cellY = 0; cellY < this.settings.charSamples; cellY += 1) {
      for (let cellX = 0; cellX < this.settings.charSamples; cellX += 1) {
        let value = 0;
        for (let posY = 0; posY < size; posY += 1) {
          for (let posX = 0; posX < size; posX += 1) {
            value += data[(cellX * size + posX + (cellY * size + posY) * 12) * 4 + 3];
          }
        }
        values.push(value / (size * size) / 255);
      }
    }
    if (this.settings.debug) {
      this.debugCharsElement.appendChild(canvas);
      for (let cellX = 0; cellX < this.settings.charSamples; cellX += 1) {
        for (let cellY = 0; cellY < this.settings.charSamples; cellY += 1) {
          ctx.fillStyle = `rgba(255, 0, 255, ${values[cellX + cellY * this.settings.charSamples]})`;
          ctx.fillRect(cellX * size, cellY * size, size, size);
        }
      }
      console.log({ char, values });
    }
    this.charRegions[char] = values;
  }

  normalizeCharRegions() {
    let min = 1;
    let max = 0;
    for (const char in this.charRegions) {
      // let value = 0;
      for (const region of this.charRegions[char]) {
        if (min > region) min = region;
        if (max < region) max = region;
        // value += region;
      }
      // value /= this.settings.charSamples * this.settings.charSamples;
      // if (min > value) min = value;
      // if (max < value) max = value;
    }
    if (max > 0 && min != max) {
      const diff = max - min;
      for (const char in this.charRegions) {
        const regions = this.charRegions[char];
        for (let index = 0; index < regions.length; index += 1) {
          regions[index] = (regions[index] - min) * (1 / diff);
        }
      }
    }
    if (this.settings.debug) {
      console.log({ min, max, charRegions: this.charRegions });
    }
  }

  analyzeCharRegions() {
    this.clearElement(this.debugCharsElement);
    this.charRegions = {};
    for (const char of this.settings.charSet) {
      this.analyzeChar(char);
    }
    this.normalizeCharRegions();
  }

  loadFromUrl() {
    this.isImageLoaded = false;
    if (this.cachedUrls[this.settings.url]) {
      this.onImageLoaded(this.cachedUrls[this.settings.url]);
    } else {
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = this.settings.url;
      img.addEventListener('load', () => {
        this.cachedUrls[this.settings.url] = img;
        this.onImageLoaded(img);
      });
      img.addEventListener('error', () => {
        const urls = Object.keys(this.cachedUrls);
        if (urls.length > 0) {
          this.onImageLoaded(this.cachedUrls[urls[urls.length - 1]]);
        }
      });
    }
  }

  onImageLoaded(img: HTMLImageElement) {
    this.width = this.settings.size;
    this.height = ~~((img.height / img.width) * this.width / 1.9);
    const canvas = document.createElement('canvas');
    canvas.width = this.width * this.settings.charSamples;
    canvas.height = this.height * this.settings.charSamples;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw 'context creation failed';
    ctx.drawImage(img, 0, 0, this.width * this.settings.charSamples, this.height * this.settings.charSamples);
    this.clearElement(this.debugImageElement);
    if (this.settings.debug) {
      this.debugImageElement.appendChild(canvas);
      console.log({ img, width: this.width, height: this.height });
    }
    document.body.style.setProperty('--width', this.width.toString());
    document.body.style.setProperty('--height', this.height.toString());
    this.generateValueMap(ctx);
    this.isImageLoaded = true;
  }

  generateValueMap(ctx: CanvasRenderingContext2D) {
    this.valueMap = [];
    this.colorMap = [];
    const data = Array.from(ctx.getImageData(0, 0, this.width * this.settings.charSamples, this.height * this.settings.charSamples).data);
    const rowLength = this.width * this.settings.charSamples * 4;
    for (let cellY = 0; cellY < this.height; cellY += 1) {
      for (let cellX = 0; cellX < this.width; cellX += 1) {
        const cell = [];
        const pos = (cellX * this.settings.charSamples) * 4 + (cellY * this.settings.charSamples) * rowLength;
        this.colorMap.push(data.slice(pos, pos + 4));
        for (let posY = 0; posY < this.settings.charSamples; posY += 1) {
          for (let posX = 0; posX < this.settings.charSamples; posX += 1) {
            const pos = (cellX * this.settings.charSamples + posX) * 4 + (cellY * this.settings.charSamples + posY) * rowLength;
            const alpha = data[pos + 3] / 255;
            const values = data.slice(pos, pos + 3);
            const value = 1 - ((values[0] + values[1] + values[2]) / 765 * (alpha) + 1 - alpha);
            if (this.settings.debug) {
              ctx.fillStyle = `rgba(255, 0, 255, ${value})`;
              ctx.fillRect(cellX * this.settings.charSamples + posX, cellY * this.settings.charSamples + posY, 1, 1);
            }
            cell.push(value);
          }
        }
        this.valueMap.push(cell);
      }
    }
    if (this.settings.debug) {
      console.log({ valueMap: this.valueMap, colorMap: this.colorMap });
    }
    this.normalizeValueMap();
    this.generate();
  }

  normalizeValueMap() {
    let min = 1;
    let max = 0;
    for (const regions of this.valueMap) {
      // const value = 0;
      for (const region of regions) {
        if (min > region) min = region;
        if (max < region) max = region;
        // value += region;
      }
      // value /= this.settings.charSamples * this.settings.charSamples;
      // if (min > value) min = value;
      // if (max < value) max = value;
    }
    if (max > 0 && min != max) {
      const diff = max - min;
      this.normalizedMap = [];
      for (const regions of this.valueMap) {
        const normals = Array.from(regions);
        for (let index = 0; index < normals.length; index += 1) {
          normals[index] = (normals[index] - min) * (1 / diff);
          normals[index] = (this.settings.contrast + 1) * (normals[index] - 0.5) + 0.5 + this.settings.brightness;
        }
        this.normalizedMap.push(normals);
      }
    } else {
      this.normalizedMap = this.valueMap;
    }
    if (this.settings.debug) {
      console.log({ min, max, valueMap: this.valueMap });
    }
  }

  getClosestChar(values: number[]) {
    let minDiff = Number.MAX_VALUE;
    let minChar = '';
    for (const char in this.charRegions) {
      const regions = this.charRegions[char];
      let diff = 0;
      for (let index = 0; index < regions.length; index++) {
        diff += Math.abs(regions[index] - values[index]);
      }
      if (diff < minDiff) {
        minDiff = diff;
        minChar = char;
      }
    }
    return minChar;
  }

  clearElement(element: HTMLElement) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  arrayToRgba(color: number[]) {
    const r = color[3] > 0 ? ~~color[0] : 255;
    const g = color[3] > 0 ? ~~color[1] : 255;
    const b = color[3] > 0 ? ~~color[2] : 255;
    const a = Math.max(0, Math.min(1, color[3] / 255 + this.settings.alpha));
    return `rgba(${r},${g},${b},${a})`;
  }

  getCharColor(color: number[]) {
    if (this.settings.ColorPalette === ColorPalette.ColorFull) {
      return this.arrayToRgba(color);
    } else {
      let closestColor = [0, 0, 0];
      let minDiff = Number.MAX_VALUE;
      for (const paletteColor of this.colorPalettes[this.settings.ColorPalette]) {
        const diff = Math.abs(color[0] - paletteColor[0]) + Math.abs(color[1] - paletteColor[1]) + Math.abs(color[2] - paletteColor[2]);
        if (diff < minDiff) {
          minDiff = diff;
          closestColor = paletteColor;
        }
      }
      return this.arrayToRgba([...closestColor, color[3]]);
    }
  }

  generate() {
    this.clearElement(this.asciiElement);
    for (let cellY = 0; cellY < this.height; cellY += 1) {
      for (let cellX = 0; cellX < this.width; cellX += 1) {
        const cell = document.createElement('div');
        if (this.settings.ColorPalette !== ColorPalette.Monochrome) {
          cell.style.color = this.getCharColor(this.colorMap[cellX + cellY * this.width]);
        }
        cell.innerHTML = this.getClosestChar(this.normalizedMap[cellX + cellY * this.width]).replace(' ', '&nbsp;');
        this.asciiElement.appendChild(cell);
      }
    }
  }

  demo() {
    if (this.settings.isDemoRunning) {
      if (this.isImageLoaded) {
        this.settings.brightness += 0.05 * this.demoDirection;
        this.normalizeValueMap();
        this.generate();
        if (this.settings.brightness >= 0.5 || this.settings.brightness <= -1) {
          this.demoDirection *= -1;
        }
        if (this.settings.brightness <= -1) {
          this.demoIndex = (this.demoIndex + 1) % this.demoSettings.length;
          this.settings.url = this.demoSettings[this.demoIndex].url;
          this.settings.size = this.demoSettings[this.demoIndex].size;
          this.settings.charSamples = this.demoSettings[this.demoIndex].charSamples;
          this.analyzeCharRegions();
          this.loadFromUrl();
        }
      }
      requestAnimationFrame(() => this.demo());
    }
  }
}

const generator = new AsciiArtGenerator();
console.log(generator);
