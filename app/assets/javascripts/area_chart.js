$(function() {
  var getWithDefault = Kitechart.getWithDefault;
  
  window.AreaChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = getWithDefault(options['container'], '#container');

      $(container).highcharts({
        chart: {
          type: 'area',
          backgroundColor: getWithDefault(options['chart-backgroundColor'], 'white')
        },
        title: {
          text: title,
          x: -20,
          style: {
            color: getWithDefault(options['title-style-color'], '#333333')
          }
        },
        exporting: {
          enabled: getWithDefault(options['exporting-enabled'], false)
        },
        xAxis: {
          categories: getWithDefault(options['categories'], ['Values']),
          labels: {
            enabled: getWithDefault(options['xAxis-labels-enabled'], true)
          }
        },
        yAxis: {
          labels: {
            enabled: getWithDefault(options['yAxis-labels-enabled'], true)
          },
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
          name: getWithDefault(options['series-name'], 'Data'),
          data: data['data']
        }]
      });
    }
  }
});
