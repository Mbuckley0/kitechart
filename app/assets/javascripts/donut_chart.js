$(function() {
  window.DonutChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = options['container'] || '#container';

      var chartData = DonutChart.formatTopLevelData(data);

      $(container).highcharts({
        chart: {
          type: 'pie',
          backgroundColor: options['chart-backgroundColor'] || 'white'
        },
        title: {
          text: title,
          style: {
            color: options['title-style-color'] || '#333333'
          }
        },
        subtitle: {
          text: options['subtitle-text'] || ''
        },
        xAxis: {
          type: options['xAxis-type'] || 'category',
          labels: {
            enabled: options['xAxis-labels-enabled'] || true
          }
        },
        yAxis: {
          title: {
            text: yAxisTitle
          },
          labels: {
            enabled: options['yAxis-labels-enabled'] || true
          }
        },
        exporting: {
          enabled: options['exporting-enabled'] || false
        },
        plotOptions: {
          pie: {
            borderColor: '#000000',
            innerSize: options['plotOptions-pie-innerSize'] || '60%'
          },
          series: {
            borderWidth: options['plotOptions-series-borderWidth'] || 0,
            dataLabels: {
              style: {
                textOutline: options['plotOptions-dataLabels-style-textOutline'] || false
              },
              enabled: options['plotOptions-series-dataLabel-enabled'] || true,
              format: options['plotOptions-series-dataLabel-format'] || '{point.y:,.0f}'
            }
          }
        },
        legend: {
          enabled: options['legend-enabled'] || false
        },
        tooltip: {
          headerFormat: options['tooltip-headerFormat'] || '',
          pointFormat: options['tooltip-pointFormat'] || '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.2f}</b><br/>'
        },
        series: [{
          point: {
            events: {
              click: options['series-point-events-click'] || ''
            }
          },
          colorByPoint: options['series-colorByPoint'] || true,
          data: chartData
        }]
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data['data'], function(key, value) {
        chartData.push([
          key,
          value
        ]);
      });
      return chartData;
    }
  }
});
