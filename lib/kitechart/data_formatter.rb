module Kitechart
  class DataFormatter
    def initialize(data, first_column: nil, second_column: nil, third_column: nil, aggregation_method: 'count', aggregation_column: 'id')
      @first_column = first_column
      @second_column = second_column
      @third_column = third_column
      @aggregation_method = aggregation_method
      @aggregation_column = aggregation_column
      @data = data
    end

    def get_data
      top_level_hash = top_level_data if first_column
      second_level_hash = second_level_data if second_column
      third_level_hash = third_level_data if third_column

      [top_level_hash, second_level_hash, third_level_hash]
    end

    private

    attr_reader :data, :first_column, :second_column, :third_column, :aggregation_method, :aggregation_column

    def top_level_data
      aggregate(data.where("#{first_column} IS NOT NULL").group(first_column))
    end

    def second_level_data
      second_level_data = {}
      top_level_data.each do |top_level|
        table_second_level = data.where("#{first_column} = ? AND #{second_column} IS NOT NULL", top_level[0])
        second_level_data[top_level[0]] = aggregate(table_second_level.group(second_column))
      end
      second_level_data
    end

    def third_level_data
      third_level_data = {}
      second_level_data.each do |first_level|
        top_level = first_level.first
        third_level_data[top_level] = {}
        first_level.second.each do |second_level|
          second_level = second_level[0]
          third_level_data = third_level_data_invoices(top_level, second_level, third_level_data)
        end
      end
      third_level_data
    end

    def third_level_data_invoices(top_level, second_level, third_level_data)
      table_third_level = data.where(
        "#{first_column} = ? AND #{second_column} = ?", top_level, second_level)

      third_level_data[top_level].merge(third_level_data_hash(second_level))

      third_level_data = third_level_data_count(top_level,
                                                second_level,
                                                third_level_data,
                                                table_third_level)

      third_level_data
    end

    def third_level_data_count(top_level, second_level, third_level_data, table_third_level)
      third_level_data[top_level][second_level] =
        aggregate(table_third_level.group(third_column))
      third_level_data
    end

    def third_level_data_hash(second_level)
      {second_level => Hash.new { |hash, key| hash[key] = 0 }}
    end

    def aggregate(query)
      if aggregation_method == 'count'
        query.count(aggregation_column)
      else
        query.sum(aggregation_column)
      end
    end
  end
end
