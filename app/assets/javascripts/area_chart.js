$(function() {
  window.AreaChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = options['container'] || '#container';

      $(container).highcharts({
        chart: {
          type: 'area',
          backgroundColor: options['chart-backgroundColor'] || 'white'
        },
        title: {
          text: title,
          x: -20,
          style: {
            color: options['title-style-color'] || '#333333'
          }
        },
        exporting: {
          enabled: options['exporting-enabled'] || false
        },
        xAxis: {
          categories: options['categories'] || ['Values']
        },
        yAxis: {
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: options['series-name'] || 'Data',
          data: data['data']
        }]
      });
    }
  }
});
