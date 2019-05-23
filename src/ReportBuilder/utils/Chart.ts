import { IReportColumnHeader, IReportOptimizedDataRow } from 'peekdata-datagateway-api-sdk';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { generateChartColor, getRgbaFromRgb } from 'src/ReportBuilder/utils/Color';

/**
 * Returns data indexes
 * @param data
 * @param headers
 */
export function getDataIndexes(data: ISelectedGraphNode[], headers: IReportColumnHeader[]): number[] {
  if (!data || data.length === 0 || !headers || headers.length === 0) {
    return null;
  }

  const indexes = [];

  for (const item of data) {
    const index = headers.map(header => header && header.name).indexOf(item && item.value);

    if (index !== -1) {
      indexes.push(index);
    }
  }

  return indexes;
}

/**
 * Returns chart's data sets
 * @param rows
 * @param headers
 * @param indexes
 */
export function getDataSets(rows: IReportOptimizedDataRow[], headers: IReportColumnHeader[], indexes: number[]) {
  if (!rows || rows.length === 0 || !headers || headers.length === 0 || !indexes || indexes.length === 0) {
    return null;
  }

  const datasets = [];

  for (const index of indexes) {
    const dataset = [];

    for (const row of rows) {
      dataset.push(row[index]);
    }

    datasets.push({
      label: headers[index] && headers[index].title,
      data: dataset,
      borderWidth: 2,
    });
  }

  return datasets;
}

/**
 * Returns chart's labels
 * @param rows
 * @param indexes
 */
export function getChartLabels(rows: IReportOptimizedDataRow[], indexes: number[]) {
  if (!rows || rows.length === 0 || !indexes || indexes.length === 0) {
    return null;
  }

  const labels = [];

  for (const row of rows) {
    const rowLabels = [];

    for (const index of indexes) {
      rowLabels.push(row[index]);
    }

    labels.push(rowLabels.join(', '));
  }

  return labels;
}

/**
 * Customizes chart.js oval charts label
 * @param item
 * @param data
 */
export function customizeOvalChartLabel(item, data) {
  return `${data.labels[item.index]}. ${data.datasets[item.datasetIndex].label}: ${data.datasets[item.datasetIndex].data[item.index]}`;
}

/**
 * Customizes chart.js radar chart label
 * @param item
 * @param data
 */
export function customizeRadarChartLabel(item, data) {
  return `${data.datasets[item.datasetIndex].label}: ${data.datasets[item.datasetIndex].data[item.index]}`;
}

/**
 * Generated chart's colors
 * @param labels
 */
export function generateChartColors(labels, datasets) {
  if ((!labels || labels.length === 0) && (!datasets || datasets.length === 0)) {
    return null;
  }

  let generator = [];
  if (!labels) {
    generator = datasets;
  } else if (!datasets) {
    generator = labels;
  } else if (labels.length >= datasets.length) {
    generator = labels;
  } else {
    generator = datasets;
  }

  const backgroundColor = [];
  const borderColor = [];

  generator.forEach((item, index) => {
    const rgb = generateChartColor(index);

    backgroundColor.push(
      getRgbaFromRgb(rgb, 0.4),
    );

    borderColor.push(
      getRgbaFromRgb(rgb, 1),
    );
  });

  return {
    backgroundColor,
    borderColor,
  };
}

/**
 * Colorizes chart.js chart
 * @param datasets
 * @param backgroundColor
 * @param borderColor
 */
export function colorizeChart(datasets, backgroundColor, borderColor) {
  if (!datasets || datasets.length === 0 || !backgroundColor || !borderColor) {
    return;
  }

  datasets.forEach((dataset, index) => {
    dataset.backgroundColor = backgroundColor[index];
    dataset.borderColor = borderColor[index];
  });
}

/**
 * Colorizes chart.js oval charts
 * @param datasets
 * @param backgroundColor
 * @param borderColor
 */
export function colorizeOvalChart(datasets, backgroundColor, borderColor = '#fff') {
  if (!datasets || datasets.length === 0 || !backgroundColor) {
    return;
  }

  datasets.forEach((dataset) => {
    dataset.backgroundColor = backgroundColor;
    dataset.borderColor = borderColor;
  });
}
