# Smartlighting
a smart light control system as web service featuring Philips Hue API and synaptic.js

<h1 align="center">
	<br>
	<img width="600" src="https://rawgit.com/ansteh/smartlighting/master/images/readme.JPG" alt="smartlighting">
	<br>
	<br>
	<br>
</h1>

# Dependencies
- [Node.js](https://nodejs.org/en/) (LTS)
- [NPM](https://docs.npmjs.com/cli/install)
- Google Account
- [Philips Hue Bulbs with Hue Bridge](http://www2.meethue.com/de-de/productdetail/philips-hue-white-sk-a19)

# Installation
- create a folder with content from smartlighting folder

## Google Calendar as external service
- Deploy script content in folder smartlighting/platforms/services/calendar/gs-project as a web app [Guide](https://developers.google.com/apps-script/guides/web#deploying_a_script_as_a_web_app)
- create a credentials.json file in smartlighting/platforms/services/calendar familiar to credentials-example.json and insert the web app key from the deployed web app

## Philips Hue
- First make sure your bridge is connected to your network and is functioning properly. [Guide](http://www.developers.meethue.com/documentation/getting-started)

## Deploy on server
- install node.js and NPM
- go to root folder of project and type: npm install
- with new router: delete smartlighting/platforms/physical-net/hue-control/philips-hue.json
- go to root folder of project and type: node index.js
- for the first time you might need to push the Philips Hue Bridge button to verify the bulbs, then restart
- open browser and visit [http://localhost:3000/](http://localhost:3000/)
