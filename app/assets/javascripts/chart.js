$(function () {
  window.Chart = {
    generateChart: function(title, data, yAxisTitle, chartType, options) {
      var options = options || {};

      if(Object.keys(data['data'][0]).length == 4) {
        TwoLevelDownChart.displayChart(data, title, yAxisTitle, chartType, options)
      }
      else if(Object.keys(data['data'][0]).length == 3) {
        OneLevelDownChart.displayChart(data, title, yAxisTitle, chartType, options)
      } else {
        TopLevelChart.displayChart(data, title, yAxisTitle, chartType, options)
      }
    },
  }
});
