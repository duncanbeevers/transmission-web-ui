TEST_CHANGES_SINCE = Time.now - 600

namespace :test do
  namespace :recent do
    desc "Open recently modified files into browser"
    task :javascript do
      require 'rubygems'
      gem 'activesupport'
      require 'active_support'
      require 'rest_client'
      
      since = TEST_CHANGES_SINCE
      
      touched = FileList[ 'test/unit/**/*_test.*', 'src/**/*.js' ].select do |path|
        File.mtime(path) > since
      end.map do |filename|
        match = /^test\/unit\/(.*)_test\.js$/.match(filename)
        next filename unless match
        'src/' + match[1] + '.js'
      end.uniq.map do |filename|
        match = /^src\/(.*).js$/.match(filename)
        next filename unless match # This shouldn't really happen
        match[1]
      end
      
      next if touched.blank?
      
      touched.each do |url|
        RestClient.post 'http://localhost:4567/work', :url => '/test/' + url
      end
      
    end
  end
end
