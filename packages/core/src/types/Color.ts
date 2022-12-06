import {Color, ColorSpace, InterpolationMode, mix} from 'chroma-js';
import type {Type} from './Type';
import type {InterpolationFunction} from '../tweening';

export type SerializedColor = string;

export type PossibleColor =
  | SerializedColor
  | number
  | Color
  | {r: number; g: number; b: number; a: number};

declare module 'chroma-js' {
  interface Color extends Type {
    serialize(): string;
    lerp(
      to: ColorInterface | string,
      value: number,
      colorSpace?: ColorSpace,
    ): ColorInterface;
  }
  type ColorInterface = import('chroma-js').Color;
  type ColorSpace = import('chroma-js').InterpolationMode;
  interface ColorStatic {
    symbol: symbol;
    lerp(
      from: ColorInterface | string,
      to: ColorInterface | string,
      value: number,
      colorSpace?: ColorSpace,
    ): ColorInterface;
    createLerp(colorSpace: ColorSpace): InterpolationFunction<ColorInterface>;
  }
  interface ChromaStatic {
    Color: ColorStatic & (new (color: PossibleColor) => ColorInterface);
  }
}

Color.symbol = Color.prototype.symbol = Symbol.for(
  '@motion-canvas/core/types/Color',
);

Color.lerp = Color.prototype.lerp = (
  from: Color | string,
  to: Color | string,
  value: number,
  colorSpace: InterpolationMode = 'lch',
) => {
  return mix(from, to, value, colorSpace);
};

Color.createLerp = Color.prototype.createLerp =
  (colorSpace: InterpolationMode) =>
  (from: Color | string, to: Color | string, value: number) =>
    mix(from, to, value, colorSpace);

Color.prototype.toSymbol = () => {
  return Color.symbol;
};

Color.prototype.serialize = function (this: Color): SerializedColor {
  return this.css();
};

Color.prototype.lerp = function (
  this: Color,
  to: Color,
  value: number,
  colorSpace?: ColorSpace,
) {
  return Color.lerp(this, to, value, colorSpace);
};

export {Color};
