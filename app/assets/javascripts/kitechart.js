//= require lodash.min.js
//= require highcharts
//= require highcharts/modules/drilldown
//= require highcharts/highcharts-more
//= require highcharts/modules/exporting
//= require_self
//= require_tree .

window.Kitechart = {
  getWithDefault: function(value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    }
    return value;
  }
};
