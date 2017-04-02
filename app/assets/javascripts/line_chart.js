$(function() {
  window.LineChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = options['container'] || '#container';

      $(container).highcharts({
        chart: {
          backgroundColor: options['chart-backgroundColor'] || 'white'
        },
        title: {
          text: title,
          x: -20,
          style: {
            color: options['title-style-color'] || '#333333'
          }
        },
        xAxis: {
          categories: options['categories'] || ['Values'],
          labels: {
            enabled: options['xAxis-labels-enabled'] || true
          }
        },
        yAxis: {
          labels: {
            enabled: options['yAxis-labels-enabled'] || true
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        exporting: {
          enabled: options['exporting-enabled'] || false
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: data['data']
      });
    }
  }
});
