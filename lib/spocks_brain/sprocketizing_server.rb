require 'rubygems'
require 'sinatra'
require 'sprockets'

class SprocketizingServer < Sinatra::Default
  if !(defined?(APP_ROOT))
    APP_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '../..'))
  end
  if !(defined?(SRC_ROOT))
    SRC_ROOT = File.join(APP_ROOT, 'src')
  end
  
  # Routes
  get '/sprocketize/*' do
    headers 'Content-Type' => 'application/x-javascript'
    secretary(params[:splat]).concatenation.to_s
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
