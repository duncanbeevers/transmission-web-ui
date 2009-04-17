require 'rubygems'
require 'sinatra'

class JsUnitTestBuilderServer < Sinatra::Default
  if !(defined?(APP_ROOT))
    APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '../..'))
  end
  if !(defined?(TEST_ROOT))
    TEST_ROOT = File.join(APP_ROOT, 'test/unit')
  end
  
  get '/test/*' do
    @object_under_test = params[:splat]
    @object_under_test_file_name = "#{@object_under_test}.js"
    @test_file_name = "#{@object_under_test}_test.js"
    @test_log = "#{@object_under_test}_log"
    @function_returning_test_methods = File.read(File.join(TEST_ROOT, @test_file_name))
    haml :test, :layout => :test_layout
  end
  
  # Helper methods
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
end
