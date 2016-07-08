$(function () {
  window.Chart = {
    generateChart: function(title, yAxisTitle, chartType, topLevelData, secondLevelData, thirdLevelData) {
      if (thirdLevelData != undefined) {
        Chart.generateThirdLevelChart(topLevelData, secondLevelData, thirdLevelData, title, yAxisTitle, chartType);
      } else if (secondLevelData != undefined) {
        Chart.generateSecondLevelChart(topLevelData, secondLevelData, title, yAxisTitle, chartType);
      } else if(topLevelData != undefined) {
        Chart.generateTopLevelChart(topLevelData, title, yAxisTitle, chartType);
      }
    },

    generateTopLevelChart: function(topLevelData, title, yAxisTitle, chartType) {
      formattedData = topLevelData;
      $.each(topLevelData, function(key, value) {
        formattedData[key] = Math.round(value);
      });
      TopLevelChart.displayChart(formattedData, title, yAxisTitle, chartType);
    },

    generateSecondLevelChart: function(topLevelData, secondLevelData, title, yAxisTitle, chartType) {
      formattedData = topLevelData;
      $.each(topLevelData, function(key, value) {
        formattedData[key] = {label: Math.round(value)};
        formattedData[key]['drilldown'] = secondLevelData[key];
          $.each(formattedData[key]['drilldown'], function(drilldownKey, drilldownValue) {
            formattedData[key]['drilldown'][drilldownKey] = Math.round(drilldownValue)
          });
      });
      OneLevelDownChart.displayChart(formattedData, title, yAxisTitle, chartType);
    },

    generateThirdLevelChart: function(topLevelData, secondLevelData, thirdLevelData, title, yAxisTitle, chartType) {
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
      TwoLevelDownChart.displayChart(formattedData, title, yAxisTitle, chartType);
    }
  }
});
