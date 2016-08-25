$(function () {
  // Data is expected to be in the form of {label: value, label: value, label: value}
  window.TopLevelChart = {
    displayChart: function (data, title, yAxisTitle, chartType, options) {
      var options = options || {};
      var chartData = TopLevelChart.formatData(data);

      $('#container').highcharts({
        chart: {
          type: chartType,
          backgroundColor: options['chart-backgroundColor'] || 'white'
        },
        title: {
          text: title
        },
        subtitle: {
          text: options['subtitle-text'] || ''
        },
        xAxis: {
          type: options['xAxis-type'] || 'category'
        },
        yAxis: {
          min: 0,
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
