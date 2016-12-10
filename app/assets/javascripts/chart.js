$(function() {
  window.Chart = {
    mergeNames: function(arr) {
      return _.chain(arr).groupBy('name').mapValues(function(v) {
        return { name: v[0].name, y: _.sumBy(v, 'y'), drilldown: v[0].name };
      }).value();
    },

    mergeDrilldowns: function(arr) {
      return _.chain(arr).groupBy('name').mapValues(function(v) {
        var data = [];
        $.each(v, function(key, value) {
          data.push({ name: value.data[0].name, y: value.data[0].y, drilldown: value.data[0].drilldown });
        });
        return { id: v[0].id, data: data, name: v[0].name };
      }).value();
    },


    generateChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};
      var chartData = Chart.formatTopLevelData(data);
      var drilldownData = Chart.formatDrilldownData(data);

      var newData = _.values(Chart.mergeNames(chartData));
      var allDrilldownData = _.values(Chart.mergeDrilldowns(drilldownData));

      $('#container').highcharts({
        chart: {
          type: chartType,
          backgroundColor: options['chart-backgroundColor'] || 'white'
        },
        title: {
          text: title
        },
        subtitle: {
          text: options['subtitle-text'] || 'Click the columns to drill down.'
        },
        xAxis: {
          type: options['xAxis-type'] || 'category'
        },
        yAxis: {
          title: {
            text: yAxisTitle
          }

        },
        plotOptions: {
          series: {
            borderWidth: options['plotOptions-series-borderWidth'] || 0,
            dataLabels: {
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
          data: newData
        }],
        drilldown: {
          series: allDrilldownData
        }
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data['data'], function(_key, value) {
        chartData.push({
          name: Object.values(value)[0].toString(),
          y: parseFloat(_.last(Object.values(value))),
          drilldown: Object.values(value)[0].toString()
        });
      });
      return chartData;
    },

    formatDrilldownData: function(data) {
      var drilldownData = [];
      var dataLength = _.size(data['data'][0]);

      for (var i = 1; i < dataLength - 1; i++) {
        $.each(data['data'], function(_key, value) {
          var name = _.dropRight(Object.values(value), dataLength - i);
          var drilldown = _.dropRight(Object.values(value), dataLength - i - 1);

          drilldownData.push({
            name: _.join(name, '-'),
            id: _.join(name, '-'),
            data: [
              {
                name: Object.values(value)[i],
                y: parseFloat(_.last(Object.values(value))),
                drilldown: _.join(drilldown, '-')
              }
            ]
          });
        });
      }
      return drilldownData;
    },
  }
});
