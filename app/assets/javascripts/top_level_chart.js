$(function () {
  // Data is expected to be in the form of {label: value, label: value, label: value}
  window.TopLevelChart = {
    displayChart: function (data, title, yAxisTitle, chartType) {
      var chartData = TopLevelChart.formatData(data);

      $('#container').highcharts({
        chart: {
          type: chartType
        },
        title: {
          text: title
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          min: 0,
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
        }]
      });
    },

    formatData: function (data) {
      var chartData = [];
      $.each(data, function(key, value){
        chartData.push({
          name: key,
          y: value
        });
      });
      return chartData;
    }
  }
});
