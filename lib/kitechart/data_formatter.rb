module Kitechart
  class DataFormatter
    attr_reader :data, :columns, :aggregation_method, :aggregation_column

    def initialize(data, columns: [], aggregation_method: 'count', aggregation_column: 'id')
      @columns = columns
      @aggregation_method = aggregation_method
      @aggregation_column = aggregation_column
      @data = data
    end

    def get_data
      return format_data
    end

    def format_data
      query = if columns.length > 1
                columns.join(' IS NOT NULL AND ') + ' IS NOT NULL'
              else
                columns.join('') + ' IS NOT NULL'
              end
      aggregate(data.where(query).group(columns))
    end

    private

    def aggregate(query)
      if aggregation_method == 'count'
        query.count(aggregation_column)
      else
        query.sum(aggregation_column)
      end
    end
  end
end
