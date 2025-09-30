export function getRandomDarkHexColor() {
  // 1. HSL 색상을 먼저 생성합니다. (명도를 낮게 유지)
  const hue = Math.floor(Math.random() * 361);
  const saturation = Math.floor(Math.random() * 31) + 70; // 70% ~ 100%
  const lightness = Math.floor(Math.random() * 31) + 20; // 20% ~ 50%

  // 2. HSL을 HEX로 변환합니다.
  // HSL -> RGB -> HEX
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= hue && hue < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= hue && hue < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= hue && hue < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= hue && hue < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= hue && hue < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= hue && hue < 360) {
    r = c; g = 0; b = x;
  }
  
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  const red = toHex(r + m);
  const green = toHex(g + m);
  const blue = toHex(b + m);

  return `#${red}${green}${blue}`;
}