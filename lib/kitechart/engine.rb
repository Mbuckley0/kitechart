module Kitechart
  class Engine < ::Rails::Engine
    initializer "precompile", group: :all do |app|
      if defined?(Sprockets) && Gem::Version.new(Sprockets::VERSION) >= Gem::Version.new("4.0.0.beta1")
        app.config.assets.precompile << "kitechart.js"
        app.config.assets.precompile << "chart.js"
        app.config.assets.precompile << "top_level_chart.js"
        app.config.assets.precompile << "one_level_down_chart.js"
        app.config.assets.precompile << "two_level_down_chart.js"
      else
        # use a proc instead of a string
        app.config.assets.precompile << proc { |path| path == "kitechart.js" }
        app.config.assets.precompile << proc { |path| path == "chart.js" }
        app.config.assets.precompile << proc { |path| path == "top_level_chart.js" }
        app.config.assets.precompile << proc { |path| path == "one_level_down_chart.js" }
        app.config.assets.precompile << proc { |path| path == "two_level_down_chart.js" }
      end
    end
  end
end
