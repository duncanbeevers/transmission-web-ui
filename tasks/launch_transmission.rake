PROJECT_PATH = File.expand_path(File.join(File.dirname(__FILE__), '..'))
TRANSMISSION_WEB_HOME = File.join(PROJECT_PATH, 'public')

desc 'Launch Transmission with this project as web ui'
task :launch_transmission do
  ENV['TRANSMISSION_WEB_HOME'] = TRANSMISSION_WEB_HOME
  system('open', '-a', 'Transmission')
end
task :lt => :launch_transmission
