$(function () {
  window.Chart = {
    generateChart: function(title, yAxisTitle, chartType, options) {
      var options = options || {};
      if (options['thirdLevelData'] != undefined) {
        Chart.generateThirdLevelChart(options['topLevelData'], options['secondLevelData'], options['thirdLevelData'], title, yAxisTitle, chartType, options);
      } else if (options['secondLevelData'] != undefined) {
        Chart.generateSecondLevelChart(options['topLevelData'], options['secondLevelData'], title, yAxisTitle, chartType, options);
      } else if(options['topLevelData'] != undefined) {
        Chart.generateTopLevelChart(options['topLevelData'], title, yAxisTitle, chartType, options);
      }
    },

    generateTopLevelChart: function(topLevelData, title, yAxisTitle, chartType, options) {
      formattedData = topLevelData;
      $.each(topLevelData, function(key, value) {
        formattedData[key] = Math.round(value);
      });
      TopLevelChart.displayChart(formattedData, title, yAxisTitle, chartType, options);
    },

    generateSecondLevelChart: function(topLevelData, secondLevelData, title, yAxisTitle, chartType, options) {
      formattedData = topLevelData;
      $.each(topLevelData, function(key, value) {
        formattedData[key] = {label: Math.round(value)};
        formattedData[key]['drilldown'] = secondLevelData[key];
          $.each(formattedData[key]['drilldown'], function(drilldownKey, drilldownValue) {
            formattedData[key]['drilldown'][drilldownKey] = Math.round(drilldownValue)
          });
      });
      OneLevelDownChart.displayChart(formattedData, title, yAxisTitle, chartType, options);
    },

    generateThirdLevelChart: function(topLevelData, secondLevelData, thirdLevelData, title, yAxisTitle, chartType, options) {
      formattedData = topLevelData;
      $.each(topLevelData, function(key, value) {
        i = 0;
        formattedData[key] = {label: Math.round(value)};

        formattedData[key]['drilldown'] = { label: secondLevelData[key] };
        formattedData[key]['drilldown']['drilldown'] = [];
        $.each(formattedData[key]['drilldown']['label'], function(drilldownKey) {
          formattedData[key]['drilldown']['label'][drilldownKey] = Math.round(formattedData[key]['drilldown']['label'][drilldownKey]);
          formattedData[key]['drilldown']['drilldown'].push({ drilldownKey: thirdLevelData[key][drilldownKey] });

          $.each(formattedData[key]['drilldown']['drilldown'][i], function(secondDrilldownIDKey, secondDrilldownIDValue) {
            if(secondDrilldownIDValue != undefined) {
              $.each(secondDrilldownIDValue, function(secondDrilldownKey, secondDrilldownValue) {
                formattedData[key]['drilldown']['drilldown'][i][secondDrilldownIDKey][secondDrilldownKey] = Math.round(secondDrilldownValue);
              });
            }
          });
          i++
        });
      });
      TwoLevelDownChart.displayChart(formattedData, title, yAxisTitle, chartType, options);
    }
  }
});
