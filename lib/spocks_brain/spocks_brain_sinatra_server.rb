require 'rubygems'
require 'sinatra'
require 'ruby-debug'
require 'json'

$:.push(File.dirname(__FILE__)) unless $:.include?(File.dirname(__FILE__))
require 'sprocketizing_server'
use SprocketizingServer

class DateTime
  def to_json
    self.to_time.utc.to_s.to_json
  end
end

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

if !(defined?(APP_ROOT))
  APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '../..'))
end
if !(defined?(TEST_ROOT))
  TEST_ROOT = File.join(APP_ROOT, 'test/unit')
end
if !(defined?(SRC_ROOT))
  SRC_ROOT = File.join(APP_ROOT, 'src')
end

get '/' do
  # @tests = test_urls
  haml :index
end

get '/test/*' do
  @object_under_test = params[:splat]
  @object_under_test_file_name = "#{@object_under_test}.js"
  @test_file_name = "#{@object_under_test}_test.js"
  @test_log = "#{@object_under_test}_log"
  @function_returning_test_methods = File.read(File.join(TEST_ROOT, @test_file_name))
  haml :test, :layout => :test_layout
end

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

# SASS stylesheet
get '/stylesheets/style.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass :style
end
