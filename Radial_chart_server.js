/*
# +--------- Minute (0-59)                    | Output Dumper: >/dev/null 2>&1
# | +------- Hour (0-23)                      | Multiple Values Use Commas: 3,12,47
# | | +----- Day Of Month (1-31)              | Do every X intervals: X  -> Example: 15 * * * *  Is every 15 minutes
# | | | +--- Month (1 -12)                    | Aliases: @reboot -> Run once at startup; @hourly -> 0 * * * *;
# | | | | +- Day Of Week (0-6) (Sunday = 0)   | @daily -> 0 0 * * *; @weekly -> 0 0 * * 0; @monthly ->0 0 1 * *;
# | | | | |                                   | @yearly -> 0 0 1 1 *;
*/

var http = require('http'),
    express = require('express'),
    jade = require('jade'),
    url = require('url'),
    jsdom = require('jsdom'),
    child_proc = require('child_process'),
    w,
    h,
    scripts = ["d3.min.js",
                "d3.v2.js",
               "d3.layout.min.js",
               "RadialScriptMobileServ.js",
               "RadialScriptMobile.js"];

    var htmlStub = '<!DOCTYPE html><div id="RadialScriptMobileServ"></div>',
   querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    path = require('path'),
    request = require('request')
    svgsrc = '',
    svgAxesSrc = '';

// Globals for cronjobs...
    var cronJob = require('cron').CronJob;
    new cronJob('50 15 * * *', function(){
    console.log('You will see this message every hour');
    }, function() {
      // called when stopped
    },
 true, 
 "America/Los_Angeles"
 );
    
/*
var job = new cronJob('9 15 * * *', function(){
    // Runs every weekday (Monday through Friday)
    // at 11:30:00 AM. It does not run on Saturday
    // or Sunday.
    console.log("running");
  }, function () {
    // This function is executed when the job stops
    console.log("stopped");
  }, 
  true
);
*/



//create an app server
var app = require('express').createServer();
//set path to the views (template) directory
app.set('views', __dirname + '/views');
//set path to static files
app.use(express.static(__dirname + '/../public'));
//handle GET requests on /
app.get('/', function(req, res){

  w = (url.parse(req.url, true).query['width']);
  h = (url.parse(req.url, true).query['height']);

request("http://dcaps-staging.media.mit.edu:8080/api/reality_analysis_service/get_reality_analysis_data?document_key=radialData&bearer_token=8e2f9e3129", function (err, result, json) {
    
    json = JSON.parse(json);
    //console.log("my radial data: ",json.radialData.data);

    jsdom.env({features:{QuerySelector:true}, html:htmlStub, scripts:scripts, done:function(errors, window) {

    svgsrc = window.insertRadial("#RadialScriptMobileServ",w,h,json).innerHTML;
   // console.log(svgsrc) ;
   console.log("DIRNAME: ",__dirname);
          res.render(__dirname + '/Jade_radial.jade', {
        locals: {
                svgsrc: svgsrc}, setHeight: h, setWidth : w});
     }})
    })


});
//listen on localhost:3000
app.listen(3000);

console.log('Radial Canvas running at http://127.0.0.1:3000/');