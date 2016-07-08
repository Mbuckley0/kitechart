$(function () {
  // Data is expected to be in the form of {label: {label: value, drilldown: {label: value}}, label: {label: value, drilldown:{label: value}}}
  window.OneLevelDownChart = {
    displayChart: function (data, title, yAxisTitle, chartType) {
      var chartData = OneLevelDownChart.formatTopLevelData(data);
      var drilldownData = OneLevelDownChart.formatFirstDrilldownData(data);

      $('#container').highcharts({
        chart: {
          type: chartType
        },
        title: {
          text: title
        },
        subtitle: {
          text: 'Click the columns to drill down.'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: yAxisTitle
          }

        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y:,.0f}'
            }
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.2f}</b><br/>'
        },
        series: [{
          colorByPoint: true,
          data: chartData
        }],
        drilldown: {
          series: drilldownData
        }
      });
    },

    formatTopLevelData: function(data) {
      var chartData = [];

      $.each(data, function(key,value){
        chartData.push({
          name: key,
          y: value['label'],
          drilldown: key
        });
      });

      return chartData;
    },

    formatFirstDrilldownData: function(data) {
      var drilldownData = [];

      $.each(data, function(key, value) {
        objectData = [];
        for(var drilldownKey in value['drilldown']) {
          objectData.push([
            drilldownKey,
            value['drilldown'][drilldownKey]
          ]);
        }

        drilldownData.push({
          name: key,
          id: key,
          data: objectData
        });
      });
      return drilldownData;
    }
  }
});
