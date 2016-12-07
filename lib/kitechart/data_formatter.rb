module Kitechart
  class DataFormatter
    attr_reader :data, :first_column, :second_column, :third_column, :aggregation_method, :aggregation_column

    def initialize(data, first_column: nil, second_column: nil, third_column: nil, aggregation_method: 'count', aggregation_column: 'id')
      @first_column = first_column
      @second_column = second_column
      @third_column = third_column
      @aggregation_method = aggregation_method
      @aggregation_column = aggregation_column
      @data = data
    end

    def get_data
      return third_level_data if third_column
      return second_level_data if second_column
      top_level_data if first_column
    end

    def top_level_data
      data_group = aggregate(data.where("#{first_column} IS NOT NULL").group(first_column))
      data_count = data_group.map do |value|
        {color: value.first, count: value.second}
      end
      data_count
    end

    def second_level_data
      data_group = aggregate(data.where("#{first_column} IS NOT NULL AND #{second_column} IS NOT NULL").group(first_column, second_column))
      data_count = data_group.map do |value|
        {color: value.first.first, size: value.first.second, count: value.second}
      end
      data_count
    end

    def third_level_data
      data_group = data.where("#{first_column} IS NOT NULL AND #{second_column} IS NOT NULL AND #{third_column} IS NOT NULL").group(first_column, second_column, third_column).count

      data_count = data_group.map do |value|
        {color: value.first.first, size: value.first.second, material: value.first.third, count: value.second}
      end
      data_count
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
