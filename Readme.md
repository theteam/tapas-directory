# Tapas Directory

A Tapas (Team Application Platform And Services) module which provides a user directory API and admin interface.


## Dependencies

Dependencies are all managed from [nDistro](http://github.com/visionmedia/ndistro) so that all files are copied and executed in a relative directory, making the application self contained without requiring the need to add modules to the system.  This is desirable as we may have many applications requiring different versions on the same server.

A copy of [nDistro](http://github.com/visionmedia/ndistro) will need to be installed, instructions are on the project page.


## Build

This example uses [Apache Ant](http://ant.apache.org/) as a build script.  Currently this build script does the following:

* creates a build directory
* copies all relevant files into the build directory
* executes nDistro

This build script should also start the application, run tests against it and then shut the application down. It should generate appropriate reports and be executed in a continuous integration environment.


## The API

Tapas is heavily API driven and is intended to provide your applications with a performant API layer and a simple admin area to manage your content.  

## Running Directory

Authentication credentials are bootstrapped with username/password of admin/password.  This will allow you to create users to get you started.  This is currently hardcoded in src/controllers/auth.js

I run the app using the following command.

  ./bin/node index.js > /dev/null 2<&1 &
