$(function() {
  var getWithDefault = Kitechart.getWithDefault;
  
  window.TimelineChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = getWithDefault(options['container'], '#container');

      var topLevelData = TimelineChart.formatTopLevelData(data);

      $(container).highcharts({
        chart: {
          type: 'columnrange',
          backgroundColor: getWithDefault(options['chart-backgroundColor'], 'white'),
          inverted: getWithDefault(options['chart-inverted'], true)
        },
        title: {
          text: title,
          style: {
            color: getWithDefault(options['title-style-color'], '#333333')
          }
        },
        scrollbar: {
          enabled: getWithDefault(options['scrollbar-enabled'], true)
        },
        exporting: {
          enabled: getWithDefault(options['exporting-enabled'], false)
        },
        xAxis: {
          categories: getWithDefault(options['categories'], ['Category']),
          labels: {
            enabled: getWithDefault(options['xAxis-labels-enabled'], true)
          }
        },
        yAxis: {
          type: 'datetime',
          title: {
            text: yAxisTitle
          },
          labels: {
            enabled: getWithDefault(options['yAxis-labels-enabled'], true)
          }
        },
        plotOptions: {
          columnrange: {
            pointWidth: getWithDefault(options['plotOptions-pointWidth'], 60),
            grouping: getWithDefault(options['plotOptions-grouping'], false)
          }
        },
        legend: {
          enabled: getWithDefault(options['legend-enabled'], true)
        },
        tooltip: {
          formatter: function () {
            return getWithDefault(options['tooltip-formatter'], '<b>' + this.x + ' - ' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%e %B %H:%M', this.point.low) + ' - ' + Highcharts.dateFormat('%B %e %H:%M', this.point.high) + '<br/>');
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
