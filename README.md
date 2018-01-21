# Chantown.com
Theme files for chantown.com - a mobile-first, static homepage for Chantown Creative.

- Design:  Vickie Chan

- Development: Pete Richardson


## Chantown - front end
Front end built using a combo of HTML5 boilerplate, Bourbon, Neat, Bitters, mustache templating, browserify and SASS.

## Chantown - back end - datoCMS / Netlify
Website content and images are managed and hosted on DatoCMS. 
Content amends are made in datoCMS. 
Any new publish tasks from datoCMS integrate with Netlify to run the build steps which genereate the static site and netlify handles the deployment to either the staging or live environments.


## Deploying updates to staging   
(http://chantown-staging.netlify.com)

### Making content updates to the staging site
Make your content amends using the datocms admin area. 

Click status button (top right) -> then click "publish to staging" to generate a new preview on the staging site.

### Preview SASS/JS or template changes on staging

clone this github repo locally.

Add your updates and commit your updates to the **staging** branch of this repo. 
Push to origin>staging `$ git push origin staging`
After any new changes are pushed to the origin>staging branch, netlify will trigger a new build and deploy the changes to the staging site.

## Deploying to live
(http://www.chantown.com/)

### Making content updates on the live site
Make your content amends using the datocms admin area. 

Click status button (top right) -> then click "publish to LIVE" to send your content changes to the live site.

### Add CSS/JS/template cahnges to the live website

**Make sure you have added and tested your changes on the staging branch and website first. (see steps above)**

1. Commit and test your changes on the staging branch/site first
1. Log in to github>chantowncreative repo
2. Create a new pull request from staging branch to the master branch.
3. When the new pull request is merged into the master branch netlify will trigger a new build and deployment to the live site.

# Setting up local dev environment to make template, CSS or JS changes

1. Clone repo
2. Make sure you have node.js and gulp installed on your system.
3. Run `$ npm install` to install the project dependencies
4. Switch to the staging branch `$ git checkout staging`  (make sure to make any new changes in this branch first)
5. Run "gulp" to startup a local development environment with browsersync for live reloading