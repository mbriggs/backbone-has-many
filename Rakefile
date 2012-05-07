require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

task :build do
  Jammit.package!(config_path: "assets.yml",
                  output_folder: "build")
end
