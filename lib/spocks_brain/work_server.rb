require 'json'

class DateTime
  def to_json
    self.to_time.utc.to_s.to_json
  end
end

class WorkServer < Sinatra::Default
  # Data Storage
  require 'data_mapper'
  class WorkItem
    include Enumerable
    include DataMapper::Resource
    property :id, Serial
    property :url, String
    property :ts, Integer
  end

  if !(defined?(SPOCK_ROOT))
    SPOCK_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..'))
  end

  # An in-memory Sqlite3 connection:
  DataMapper.setup(:default, "sqlite3::memory:")
  DataMapper.auto_upgrade!
  # DataMapper::Logger.new(STDOUT, :debug)

  post '/work' do
    WorkItem.create(:url => params[:url], :ts => (Time.now.to_f * 1000).to_i)
  end

  get '/work' do
    since = params[:since].to_i
    scope = params[:since] ? WorkItem.all(:conditions => { :ts.gt => since }) : WorkItem.all

    work_items = scope.all(
      :order => [:ts.asc],
      :limit => 10,
      :conditions => { :ts.gte => since } )
    headers 'Content-Type' => 'application/json'
    work_items.to_json
  end
end
