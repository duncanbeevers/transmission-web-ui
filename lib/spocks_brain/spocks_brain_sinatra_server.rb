require 'rubygems'
require 'sinatra'
require 'sprockets'
require 'ruby-debug'
require 'json'

if !(defined?(APP_ROOT))
  APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '../..'))
end
if !(defined?(TEST_ROOT))
  TEST_ROOT = File.join(APP_ROOT, 'test/unit')
end
if !(defined?(SRC_ROOT))
  SRC_ROOT = File.join(APP_ROOT, 'src')
end

def test_url_for_file filename
  match = /^#{Regexp.escape(TEST_ROOT)}(.*)_test\.js/.match(filename)
  return unless match
  '/test' + match[1]
end

def test_urls
  Dir[File.join(TEST_ROOT, '**/*_test.js')].map do |f|
    test_url_for_file(f)
  end.compact
end

get '/' do
  @tests = test_urls
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

get '/sprocketize/*' do
  secretary = Sprockets::Secretary.new(
    :root => SRC_ROOT,
    :asset_root => SRC_ROOT,
    :load_path => [ File.join(SRC_ROOT, '**/*') ],
    :source_files => [ File.join(SRC_ROOT, *params[:splat]) ]
  )

  headers 'Content-Type' => 'application/x-javascript'
  secretary.concatenation.to_s
end

# SASS stylesheet
get '/stylesheets/style.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass :style
end
