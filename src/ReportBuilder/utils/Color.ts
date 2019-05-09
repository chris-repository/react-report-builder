// #region -------------- Interfaces -------------------------------------------------------------------

export interface IRgb {
  r: number;
  g: number;
  b: number;
}

// #endregion

// #region -------------- Constants -------------------------------------------------------------------

export const chartColors: IRgb[] = [
  { r: 145, g: 12, b: 46 },
  { r: 50, g: 61, b: 75 },
  { r: 219, g: 149, b: 92 },
];

const chartColorChangeWeight = 50;

// #endregion

// #region -------------- Functions -------------------------------------------------------------------

/**
 * Generates chart color
 */
export function generateChartColor(index: number): IRgb {
  const colorIndex = index % chartColors.length;
  const mainColor = chartColors[colorIndex];

  if (index === colorIndex) {
    return mainColor;
  }

  return {
    r: generateColorStrength(mainColor.r, chartColorChangeWeight),
    g: generateColorStrength(mainColor.g, chartColorChangeWeight),
    b: generateColorStrength(mainColor.b, chartColorChangeWeight),
  };
}

function generateColorStrength(themeColorStrength: number, changeWeight: number) {
  let minValue = themeColorStrength - changeWeight;
  let maxValue = themeColorStrength + changeWeight;

  if (minValue < 1) {
    minValue = 1;
  }

  if (maxValue > 255) {
    maxValue = 255;
  }

  return Math.floor(Math.random() * maxValue) + minValue;
}

/**
 * Gets rgba color from rgb
 */
export function getRgbaFromRgb(rgb: IRgb, opacity: number) {
  if (!rgb || !rgb.r || !rgb.g || !rgb.b) {
    return '';
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity ? opacity : 1})`;
}

// #endregion
