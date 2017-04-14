$(function() {
  var getWithDefault = Kitechart.getWithDefault;
  
  window.DonutChart = {
    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = getWithDefault(options['container'], '#container');

      var chartData = DonutChart.formatTopLevelData(data);

      $(container).highcharts({
        chart: {
          type: 'pie',
          backgroundColor: getWithDefault(options['chart-backgroundColor'], 'white')
        },
        title: {
          text: title,
          style: {
            color: getWithDefault(options['title-style-color'], '#333333')
          }
        },
        subtitle: {
          text: getWithDefault(options['subtitle-text'], '')
        },
        xAxis: {
          type: getWithDefault(options['xAxis-type'], 'category'),
          labels: {
            enabled: getWithDefault(options['xAxis-labels-enabled'], true)
          }
        },
        yAxis: {
          title: {
            text: yAxisTitle
          },
          labels: {
            enabled: getWithDefault(options['yAxis-labels-enabled'], true)
          }
        },
        exporting: {
          enabled: getWithDefault(options['exporting-enabled'], false)
        },
        plotOptions: {
          pie: {
            borderColor: '#000000',
            innerSize: getWithDefault(options['plotOptions-pie-innerSize'], '60%'),
            borderWidth: getWithDefault(options['plotOptions-series-borderWidth'], 0),
            dataLabels: {
              style: {
                textOutline: getWithDefault(options['plotOptions-dataLabels-style-textOutline'], false)
              },
              enabled: getWithDefault(options['plotOptions-series-dataLabel-enabled'], true),
              format: getWithDefault(options['plotOptions-series-dataLabel-format'], '{point.y:,.0f}')
            }
          }
        },
        legend: {
          enabled: getWithDefault(options['legend-enabled'], false)
        },
        tooltip: {
          headerFormat: getWithDefault(options['tooltip-headerFormat'], ''),
          pointFormat: getWithDefault(options['tooltip-pointFormat'], '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.2f}</b><br/>')
        },
        credits: {
          enabled: false
        },
        series: [{
          point: {
            events: {
              click: getWithDefault(options['series-point-events-click'], '')
            }
          },
          colorByPoint: getWithDefault(options['series-colorByPoint'], true),
          data: chartData
        }]
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data['data'], function(key, value) {
        chartData.push({
          name: key,
          color: value['color'],
          y: value
        });
      });
      return chartData;
    }
  }
});
