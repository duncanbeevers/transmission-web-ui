require 'rubygems'
require 'sinatra'

# Load up rack components
$:.push(File.dirname(__FILE__)) unless $:.include?(File.dirname(__FILE__))
require 'sprocketizing_server'
require 'jsunittest_builder_server'
require 'work_server'

use SprocketizingServer
use JsUnitTestBuilderServer
use WorkServer

get '/' do
  haml :index
end

# SASS stylesheet
get '/stylesheets/style.css' do
  headers 'Content-Type' => 'text/css; charset=utf-8'
  sass :style
end
