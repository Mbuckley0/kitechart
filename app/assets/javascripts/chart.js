$(function() {
  var getWithDefault = Kitechart.getWithDefault;

  window.Chart = {
    mergeNames: function(arr) {
      return _.chain(arr).groupBy('name').mapValues(function(v) {
        return { name: v[0].name, y: _.sumBy(v, 'y'), color: v[0].color, drilldown: v[0].name };
      }).value();
    },

    mergeDrilldowns: function(arr) {
      return _.chain(arr).groupBy('name').mapValues(function(v) {
        var data = [];
        $.each(v, function(key, value) {
          var item = _.find(data, { name: value.data[0].name });
          if (item !== undefined) {
            item.y = item.y + value.data[0].y;
          } else {
            data.push({
              name: value.data[0].name,
              y: value.data[0].y,
              color: v[0].color,
              drilldown: value.data[0].drilldown
            });
          }
        });
        return { id: v[0].id, data: data, name: v[0].name };
      }).value();
    },

    generateChart: function(title, data, yAxisTitle, chartType, options) {
      if (chartType == 'timeline') {
        TimelineChart.createChart(title, data, yAxisTitle, chartType, options)
      } else if (chartType == 'line') {
        LineChart.createChart(title, data, yAxisTitle, chartType, options)
      } else if (chartType == 'donut') {
        DonutChart.createChart(title, data, yAxisTitle, chartType, options)
      } else if (chartType == 'area') {
        AreaChart.createChart(title, data, yAxisTitle, chartType, options)
      } else {
        Chart.createChart(title, data, yAxisTitle, chartType, options)
      }
    },


    createChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var container = getWithDefault(options['container'], '#container');

      var chartData = Chart.formatTopLevelData(data);
      var drilldownData = Chart.formatDrilldownData(data);

      if (options['mergeNames'] === false) {
        var newData = chartData;
        var allDrilldownData = drilldownData;
      } else {
        var newData = _.values(Chart.mergeNames(chartData));
        var allDrilldownData = _.values(Chart.mergeDrilldowns(drilldownData));
      }

      $(container).highcharts({
        chart: {
          type: chartType,
          backgroundColor: getWithDefault(options['chart-backgroundColor'], 'white')
        },
        title: {
          text: title,
          style: {
            color: getWithDefault(options['title-style-color'], '#333333')
          }
        },
        subtitle: {
          text: getWithDefault(options['subtitle-text'], 'Click the columns to drill down.')
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
          },
          gridLineColor: getWithDefault(options['yAxis-gridLineColor'], '#e6e6e6')
        },
        exporting: {
          enabled: getWithDefault(options['exporting-enabled'], false)
        },
        plotOptions: {
          series: {
            lineWidth: getWithDefault(options['plotOptions-series-lineWidth'], 2),
            pointWidth: getWithDefault(options['plotOptions-series-pointWidth'], 15),
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
          pointFormat: getWithDefault(options['tooltip-pointFormat'], '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.2f}</b><br/>)')
        },
        series: [{
          point: {
            events: {
              click: getWithDefault(options['series-point-events-click'], '')
            }
          },
          colorByPoint: getWithDefault(options['series-colorByPoint'], true),
          data: newData
        }],
        drilldown: {
          series: allDrilldownData
        }
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data['data'], function(key, value) {
        var name = Chart.parseJSONorKeys(key)[0].toString();

        chartData.push({
          name: name,
          y: parseFloat(value),
          drilldown: name
        });
      });
      return chartData;
    },

    formatDrilldownData: function(data) {
      var drilldownData = [];
      var dataLength = _.size(Chart.parseJSONorKeys(Object.keys(data['data'])[0]));

      for (var i = 1; i <= dataLength - 1; i++) {
        $.each(data['data'], function(key, value) {
          var name = _.dropRight(Chart.parseJSONorKeys(key), dataLength - i);
          if (i !== dataLength - 1) {
            var drilldown = _.dropRight(Chart.parseJSONorKeys(key), dataLength - i - 1);
          }

          drilldownData.push({
            name: _.join(name, '-'),
            id: _.join(name, '-'),
            data: [
              {
                name: Chart.parseJSONorKeys(key)[i],
                y: parseFloat(value),
                drilldown: _.join(drilldown, '-')
              }
            ]
          });
        });
      }
      return drilldownData;
    },

    parseJSONorKeys: function(value) {
      try {
        return JSON.parse(value);
      } catch(e) {
        return [value];
      }
    }
  }
});
