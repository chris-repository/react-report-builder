import { IOptimizedReportResponse } from 'peekdata-datagateway-api-sdk';
import React from 'react';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';
import { ButtonGroup, IButtonGroupButton } from 'src/ReportBuilder/components/ButtonGroup';
import { ChartTypes } from 'src/ReportBuilder/models/chart';
import { ISelectedGraphNode } from 'src/ReportBuilder/models/graph';
import { ITranslations } from 'src/ReportBuilder/models/translations';
import { colorizeChart, colorizeOvalChart, customizeOvalChartLabel, customizeRadarChartLabel, generateChartColors, getChartLabels, getDataIndexes, getDataSets } from 'src/ReportBuilder/utils/Chart';
import 'src/style/components/dashboards.scss';

// #region -------------- Interfaces -------------------------------------------------------------------

interface IProps {
  data: IOptimizedReportResponse;
  dimensions: ISelectedGraphNode[];
  metrics: ISelectedGraphNode[];
  t: ITranslations;
}

interface IState {
  selected: string;
}

// #endregion

// #region -------------- Component -------------------------------------------------------------------

export class Dashboards extends React.PureComponent<IProps, IState> {

  private preparedData = null;
  private chartBackgroundColor: string[] = [];
  private chartBorderColor: string[] = [];

  constructor(props: IProps) {
    super(props);

    this.state = {
      selected: ChartTypes.bar,
    };
  }

  public render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    return (
      <div className='rb-dashboards'>

        {this.renderChartSelector()}

        <div className='rb-chart-wrapper'>
          <div>
            {this.renderChart()}
          </div>
        </div>

      </div>
    );
  }

  // #region -------------- Chart selector -------------------------------------------------------------------

  private renderChartSelector = () => {
    const { selected } = this.state;

    return (
      <ButtonGroup
        buttons={this.getChartOptions()}
        selected={selected}
        onClick={this.onSelect}
      />
    );
  }

  private getChartOptions = (): IButtonGroupButton[] => {
    const { t } = this.props;

    return [
      { value: ChartTypes.bar, label: t.chartTypeBar },
      { value: ChartTypes.line, label: t.chartTypeLine },
      { value: ChartTypes.pie, label: t.chartTypePie },
      { value: ChartTypes.doughnut, label: t.chartTypeDoughnut },
      { value: ChartTypes.radar, label: t.chartTypeRadar },
    ];
  }

  private onSelect = (newSelected: string) => {
    this.setState({
      selected: newSelected,
    });
  }

  // #endregion

  // #region -------------- Chart -------------------------------------------------------------------

  private renderChart() {
    const { selected } = this.state;
    const { data, metrics, dimensions } = this.props;

    if (!this.preparedData) {
      const headers = data && data.columnHeaders;
      const rows = data && data.rows;

      const metricIndexes = getDataIndexes(metrics, headers);
      const dimensionIndexes = getDataIndexes(dimensions, headers);

      const labels = getChartLabels(rows, dimensionIndexes);
      const datasets = getDataSets(rows, headers, metricIndexes);

      this.preparedData = {
        labels,
        datasets,
      };

      const chartColors = generateChartColors(labels, datasets);

      this.chartBackgroundColor = chartColors && chartColors.backgroundColor;
      this.chartBorderColor = chartColors && chartColors.borderColor;
    }

    if (!this.preparedData) {
      return null;
    }

    if (selected === ChartTypes.pie || selected === ChartTypes.doughnut) {
      colorizeOvalChart(this.preparedData.datasets, this.chartBackgroundColor);
    } else {
      colorizeChart(this.preparedData.datasets, this.chartBackgroundColor, this.chartBorderColor);
    }

    const options = {
      scales: {
        xAxes: [{
          gridLines: {
            borderDash: [8, 4],
          },
        }],
        yAxes: [{
          gridLines: {
            borderDash: [8, 4],
          },
        }],
      },
    };

    const ovalChartOptions = {
      tooltips: {
        callbacks: {
          label: customizeOvalChartLabel,
        },
      },
    };

    if (selected === ChartTypes.line) {
      return <Line data={this.preparedData} options={options} />;
    }

    if (selected === ChartTypes.radar) {
      const radarOptions = {
        scales: {
          ticks: {
            beginAtZero: true,
          },
        },
        tooltips: {
          callbacks: {
            label: customizeRadarChartLabel,
          },
        },
      };

      return <Radar data={this.preparedData} options={radarOptions} />;
    }

    if (selected === ChartTypes.pie) {
      return <Pie data={this.preparedData} options={ovalChartOptions} />;
    }

    if (selected === ChartTypes.doughnut) {
      return <Doughnut data={this.preparedData} options={ovalChartOptions} />;
    }

    return <Bar data={this.preparedData} options={options} />;
  }

  // #endregion
}

// #endregion
