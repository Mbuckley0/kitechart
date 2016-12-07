$(function() {
  window.TwoLevelDownChart = {
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


    displayChart: function(data, title, yAxisTitle, chartType, options) {
      var options = options || {};
      var chartData = TwoLevelDownChart.formatTopLevelData(data);
      var drilldownData = TwoLevelDownChart.formatFirstDrilldownData(data);
      var SecondDrilldownData = TwoLevelDownChart.formatSecondDrilldownData(data);

      var newData = _.values(TwoLevelDownChart.mergeNames(chartData));
      var newdrilldownData = _.values(TwoLevelDownChart.mergeDrilldowns(drilldownData));
      var newSecondDrilldownData = _.values(TwoLevelDownChart.mergeDrilldowns(SecondDrilldownData));

      var allDrilldownData = newdrilldownData.concat(newSecondDrilldownData);

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
          y: parseFloat(Object.values(value)[3]),
          drilldown: Object.values(value)[0].toString()
        });
      });
      return chartData;
    },

    formatFirstDrilldownData: function(data) {
      var drilldownData = [];

      $.each(data['data'], function(key, value) {
        drilldownData.push({
          name: Object.values(value)[0].toString(),
          id: Object.values(value)[0].toString(),
          data: [
            {
              name: Object.values(value)[1].toString(),
              y: parseFloat(Object.values(value)[3]),
              drilldown: Object.values(value)[0].toString() + Object.values(value)[1].toString(),
            }
          ]
        });
      });

      return drilldownData;
    },

    formatSecondDrilldownData: function(data) {
      var drilldownData = [];

      $.each(data['data'], function(key, value) {
        drilldownData.push({
          name: Object.values(value)[0].toString() + Object.values(value)[1].toString(),
          id: Object.values(value)[0].toString() + Object.values(value)[1].toString(),
          data: [
            {
              name: Object.values(value)[2].toString(),
              y: parseFloat(Object.values(value)[3])
            }
          ]
        });
      });

      return drilldownData;
    }
  }
});
