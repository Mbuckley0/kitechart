$(function() {
  // Data is expected to be in the form of {label: {label: value, drilldown: {label: value}}, label: {label: value, drilldown:{label: value}}}
  window.OneLevelDownChart = {
    mergeNames: function(arr) {
      return _.chain(arr).groupBy('name').mapValues(function(v) {
        return { name: v[0].name, y: _.sumBy(v, 'y'), drilldown: v[0].name };
      }).value();
    },

    mergeDrilldowns: function(arr) {
      return _.chain(arr).groupBy('name').mapValues(function(v) {
        var data = [];
        $.each(v, function(key, value) {
          data.push(_.flatten(value.data));
        });
        return { id: v[0].id, data: data, name: v[0].name };
      }).value();
    },


    displayChart: function(data, title, yAxisTitle, chartType, options) {
      var options = options || {};
      var chartData = OneLevelDownChart.formatTopLevelData(data);
      var drilldownData = OneLevelDownChart.formatDrilldownData(data);

      var newData = _.values(OneLevelDownChart.mergeNames(chartData));
      var newdrilldownData = _.values(OneLevelDownChart.mergeDrilldowns(drilldownData));

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
          series: newdrilldownData
        }
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data['data'], function(_key, value) {
        chartData.push({
          name: Object.values(value)[0],
          y: Object.values(value)[3],
          drilldown: Object.values(value)[0]
        });
      });
      return chartData;
    },

    formatDrilldownData: function(data) {
      var drilldownData = [];

      $.each(data['data'], function(key, value) {
        drilldownData.push({
          name: Object.values(value)[0].toString(),
          id: Object.values(value)[0].toString(),
          data: [
            [
              Object.values(value)[1].toString(),
              parseFloat(Object.values(value)[3])
            ]
          ]
        });
      });

      return drilldownData;
    }
  }
});
