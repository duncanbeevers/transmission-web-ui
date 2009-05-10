require 'rubygems'
require 'sinatra'
require 'pathname'

class JsUnitTestBuilderServer < Sinatra::Default
  if !(defined?(APP_CONSTS))
    APP_CONSTS = true
    
    APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '../..'))
    TEST_ROOT = File.join(APP_ROOT, 'test/unit')
    TEST_ROOT_PATHNAME = Pathname.new(TEST_ROOT)
    TEST_LIB = File.join(APP_ROOT, 'test/lib')
  end
  
  set :public, TEST_LIB
  
  get '/test/*' do
    object_under_test               = params[:splat]
    object_under_test_file_name     = "#{object_under_test}.js"
    test_file_name                  = "#{object_under_test}_test.js"
    test_log                        = "#{object_under_test}_log"
    function_returning_test_methods = File.read(File.join(TEST_ROOT, test_file_name))
    
    to_test_path = Proc.new do |filename|
      trunc = Pathname.new(filename).relative_path_from(TEST_ROOT_PATHNAME).to_s.gsub(/\_test.js$/, '')
      href = '/test/' + trunc
      name = File.basename(trunc)
      { :href => href, :name => name }
    end
    
    model_tests                     = Dir[File.join(TEST_ROOT, 'models/**/*_test.js')].map(&to_test_path)
    controller_tests                = Dir[File.join(TEST_ROOT, 'controllers/**/*_test.js')].map(&to_test_path)
    
    haml :test,
      :layout => :test_layout,
      :locals => {
        :object_under_test               => object_under_test,
        :object_under_test_file_name     => object_under_test_file_name,
        :test_file_name                  => test_file_name,
        :test_log                        => test_log,
        :function_returning_test_methods => function_returning_test_methods,
        
        # Navigation
        :model_tests                     => model_tests,
        :controller_tests                => controller_tests
      }
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
