$(function () {
  // Data is expected to be in the form of {label: {label: value, drilldown: {label: value}}, label: {label: value, drilldown:{label: value}}}
  window.TwoLevelDownChart = {
    displayChart: function (data, title, yAxisTitle, chartType, options) {
      var options = options || {};
      var chartData = TwoLevelDownChart.formatTopLevelData(data);
      var drilldownData = TwoLevelDownChart.formatDrilldownData(data);

      $('#container').highcharts({
        chart: {
          type: chartType
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
          colorByPoint: options['series-colorByPoint'] || true,
          data: chartData
        }],
        drilldown: {
          series: drilldownData
        }
      });
    },

    formatTopLevelData: function (data) {
      var chartData = [];

      $.each(data, function(key, value) {
        chartData.push({
          name: key,
          y: value['label'],
          drilldown: key
        });
      });
      return chartData;
    },

    formatDrilldownData: function (data) {
      var drilldownData = [];

      $.each(data, function(key, value) {
        firstObjectData = [];
        i = 0;
        $.each(value['drilldown']['label'], function(firstDrilldownKey, firstDrilldownValue) {
          secondObjectData = [];
          firstObjectData.push({
            name: firstDrilldownKey,
            y: firstDrilldownValue,
            drilldown: key + '_' + firstDrilldownKey
          });


          $.each(value['drilldown']['drilldown'][i], function(secondDrilldownIDKey, secondDrilldownIDValue) {
            if(secondDrilldownIDValue != undefined) {
              $.each(secondDrilldownIDValue, function(secondDrilldownKey, secondDrilldownValue) {
                secondObjectData.push([
                  secondDrilldownKey,
                  data[key]['drilldown']['drilldown'][i][secondDrilldownIDKey][secondDrilldownKey]
                ]);
              });
            }
          });

          if (secondObjectData.length >= 1) {
            drilldownData.push({
              name: firstDrilldownKey,
              id: key + '_' + firstDrilldownKey,
              data: secondObjectData
            });
          }
          i++;
        });

        if (firstObjectData.length >= 1) {
          drilldownData.push({
            name: key,
            id: key,
            data: firstObjectData
          });
        }
      });
      return drilldownData;
    }
  }
});
