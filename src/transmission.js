//= require "lib/prototype"

/* Transmission establishes a top-level namespace for all application objects
    in order to isolate them from external libraries.
*/
Transmission = { Version: '%<= APP_VERSION %>' };
Transmission.Version = '<%= APP_VERSION %>';

//= require "util/extend"
