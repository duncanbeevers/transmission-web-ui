require 'rubygems'
require 'sinatra'
require 'sprockets'

class SprocketizingServer < Sinatra::Default
  # Routes
  get '/sprocketize/*' do
    headers 'Content-Type' => 'application/x-javascript'
    secretary(params[:splat]).concatenation.to_s
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

  def secretary source_files
    Sprockets::Secretary.new(
      :root => SRC_ROOT,
      :asset_root => SRC_ROOT,
      :load_path => [ File.join(SRC_ROOT, '**/*') ],
      :source_files => [ File.join(SRC_ROOT, *source_files) ]
    )
  end
end
