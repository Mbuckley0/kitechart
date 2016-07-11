# Kitechart
A data formatter and highcharts drilldown wrapper gem

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'kitechart', git: 'https://github.com/Mbuckley0/kitechart.git', branch: :master
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install kitechart

Then add this line to your application.js file

```
//= require kitechart
```

## Useage

To setup a two level drilldown highchart add the following code to your project.

This is the code contained in the view file

```
<div id="container" class="ui container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
```

This is the code contained in the views javascript file

```
$(function () {
  'use strict';
  window.Kites = {
    getData: function () {
      $.getJSON($(location).attr('href')+'kites.json').then(function (data) {
        Chart.generateChart('Kites By Color', 'Count', 'column', data['colors'], data['size'], data['material']);
      });
    }
  };
});
```

This is the code contained in the controller file

```
class KitesController < ApplicationController
  def index
    @kites = Kite.all

    respond_to do |format|
      format.html
      format.json do
        colors, size, material = get_json_data
        render json: { colors: colors, size: size, material: material }
      end
    end
  end

  private

  def get_json_data
    Kitechart::DataFormatter.new(@kites,
                                 'color',
                                 'size',
                                 'material').get_data
  end
end
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/mbuckley0/kitechart.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

