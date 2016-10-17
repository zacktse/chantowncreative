# Chantown.com
Theme files for chantown.com - a mobile-first, static homepage for Chantown Creative.

- Design:  Vickie Chan

- Development: Pete Richardson


## Chantown.com Build Details
Based on HTML5 boilerplate, Bourbon, Neat, Bitters, mustache templating, modular JS using browserify
Includes - Gulp tasks, templating, livereload (BrowserSync), Auto generation, minification and resizing of images using gulp-responsive-images, automated build & deploy tasks

Dependencies - you will need to have node.js and gulp installed to run the batch image resizing, build and deploy tasks listed below.

## Usage

1. Clone repo
2. run npm install
3. run "gulp" to setup local development environment with browsersync for live reload

## Deploying to staging   (www.chantown.com/newwebtest/)
run `gulp deploy-to-staging` .

## Deploying to live
run `gulp deploy-to-production`

## auto resizing images for different device widths
run `gulp responsive-imgs`
