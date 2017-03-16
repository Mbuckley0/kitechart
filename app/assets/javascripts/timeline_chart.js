$(function() {
  window.TimelineChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = options['container'] || '#container';

      var topLevelData = TimelineChart.formatTopLevelData(data);

      $(container).highcharts({
        chart: {
          type: 'columnrange',
          backgroundColor: options['chart-backgroundColor'] || 'white',
          inverted: options['chart-inverted'] || true
        },
        title: {
          text: title
        },
        scrollbar: {
          enabled: options['scrollbar-enabled'] || true
        },
        xAxis: {
          categories: options['categories'] || ['16/03/2017']
        },
        yAxis: {
          type: 'datetime',
          title: {
            text: yAxisTitle
          }
        },
        plotOptions: {
          columnrange: {
            grouping: false
          }
        },
        legend: {
          enabled: options['legend-enabled'] || true
        },
        tooltip: {
          formatter: function () {
            return options['tooltip-formatter'] || '<b>' + this.x + ' - ' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%e %B %H:%M', this.point.low) + ' - ' + Highcharts.dateFormat('%B %e %H:%M', this.point.high) + '<br/>';
          }
        },
        series: topLevelData
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data['data'], function(_key, value) {
        chartData.push({
          name: value[0],
          data: [{
            x: 0,
            low: new Date(value[1]).getTime(),
            high: new Date(value[2]).getTime()
          }]
        });
      });
      return chartData;
    }
  }
});
