$(function() {
  var getWithDefault = Kitechart.getWithDefault;

  window.Chart = {
    mergeNames: function(arr) {
      var holder = {};
      arr.forEach(function(d) {
        if (holder.hasOwnProperty(d.name)) {
          holder[d.name] = holder[d.name] + d.y;
        } else {
          holder[d.name] = d.y;
        }
      });

      var obj2 = [];
      for (var prop in holder) {
        obj2.push({ name: prop, y: holder[prop], drilldown: prop });
      }

      return obj2;
    },

    mergeDrilldowns: function(arr) {
      var obj3 = [];

      arr.forEach(function(d) {
        var holder = {};
        d.data.forEach(function(a) {

          var drilldown = d['name'] + '-' + a.name;
          if (holder.hasOwnProperty(a.drilldown)) {
            holder[drilldown] = holder[a.drilldown] + a.y;
          } else {
            holder[ drilldown] = a.y;
          }
        });

        var obj2 = [];
        for (var prop in holder) {
          var names = prop.split('-');
          var name = names[names.length - 1];

          if (d['data'][0]['drilldown'].split('-').length !== names.length) {
            obj2.push({ name: name, y: holder[prop], drilldown: undefined });
          } else {
            obj2.push({ name: name, y: holder[prop], drilldown: names.slice(0, names.length).join('-') });
          }
        }

        d['data'] = obj2;
        obj3.push(d);
      });

      return obj3;
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
        var newData = Chart.mergeNames(chartData);
        var allDrilldownData = Chart.mergeDrilldowns(drilldownData);
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
            rotation: getWithDefault(options['xAxis-labels-rotation'], 0),
            enabled: getWithDefault(options['xAxis-labels-enabled'], true),
            format: getWithDefault(options['xAxis-labels-format'], '{value}')
          }
        },
        yAxis: {
          title: {
            text: yAxisTitle
          },
          labels: {
            rotation: getWithDefault(options['yAxis-labels-rotation'], 0),
            enabled: getWithDefault(options['yAxis-labels-enabled'], true),
            format: getWithDefault(options['yAxis-labels-format'], '{value}')
          },
          gridLineColor: getWithDefault(options['yAxis-gridLineColor'], '#e6e6e6'),
          gridLineDashStyle: getWithDefault(options['yAxis-gridLineDashStyle'], 'solid')
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
        var name = Kitechart.parseJSONorKeys(key)[0].toString();

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
      var dataLength = JSON.parse(Object.keys(data['data'])[0]).length;

      for (var i = 1; i <= dataLength - 1; i++) {
        $.each(data['data'], function(key, value) {
          var name = JSON.parse(key).slice(0, -(dataLength - i));
          var drilldown = JSON.parse(key).slice(0, -(dataLength - i - 1));

          drilldownData.push({
            name: name.join('-'),
            id: name.join('-'),
            data: [
              {
                name: JSON.parse(key)[i],
                y: parseFloat(value),
                drilldown: drilldown.join('-')
              }
            ]
          });
        });
      }
      return drilldownData;
    }
  }
});
