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
  },

  parseJSONorKeys: function(value) {
    try {
      return JSON.parse(value);
    } catch(e) {
      return [value];
    }
  },

  parseValue: function(value) {
    if (isNaN(value['count'])) {
      return value
    } else {
      return value['count']
    }
  }
};
