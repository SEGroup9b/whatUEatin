'use strict';

var Request = require('request');      // for API calls
//var Promise = require('promise');      // for writing working code
var querystring = require('querystring');   // for constructing API calls easily.
var key = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';    // our USDA api key
var reportURL = 'http://api.nal.usda.gov/ndb/reports/?';  
var searchURL = 'http://api.nal.usda.gov/ndb/search/?';
var nutrientURL = 'http://api.nal.usda.gov/ndb/nutrients/?';

/* [===============[ Nutrient Id's ]===============]
  255 - water
  208 - energy (kcal's)
  203 - protien
  204 - total lipids (fat)
  205 - carbohydrates
  291 - fiber
  269 - sugar
  301 - calcium
  303 - iron
  306 - potassium
  307 - sodium
  606 - saturated fat
*/


/*
nutrify('butter', '01001', true, 291, true).then(function(result) {     
  console.log("Alternative food to [butter, whipped with salt]: ");
  console.log(result.healthiest);
  console.log("This value is " + result.difference + " less than the original");
});
*/


// Returns the most "healthy" ndbno alternative to a given ndbno; via PROMISES WOW WE LEAN BOYS.
exports.healthify = function(query, ndbno, same_fg, nut_id, minimize) {
  var orig;
  return new Promise(function(resolve, reject) {
    var promiseArray = [];
    exports.food_report(ndbno).then(function(report) {   
      var fg = report.group;
      orig = report;
      if (same_fg === false) {
        fg = ''; 
      }
      return exports.find_foods(query, fg);
    }).then(function(matches) {
      
      var alt_foods = [];
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].name.toLowerCase().indexOf(query.toLowerCase()) !== -1 && matches[i].ndbno !== ndbno) {
          alt_foods.push(matches[i]);    
        }
      }
      
      var alt_reports = [];
      var promiseArray = [];
      for (var j = 0; i < alt_foods.length; j++) {
        promiseArray.push(exports.food_report(alt_foods[j].ndbno));
      }
      return Promise.all(promiseArray);
      
    }).then(function(resultArray) {
      return find_healthiest(orig, resultArray, nut_id, minimize);
      
    }).then(function(conclusion) {
      resolve(conclusion);
      
    });
  });
};

function find_healthiest(orig_report, alt_reports, nutrient_id, minimize) {
  return new Promise(function(resolve, reject) {
    var base_val = orig_report.nutrients[nutrient_id].value;
    var min_val = base_val;
    var mindex = -1;
    var diff = 0;
    
    // Now we got the base value. 
    for (var i = 0; i < alt_reports.length; i++) {
      var alt_val = alt_reports[i].nutrients[nutrient_id].value;
      
      if (minimize == true) {
        if (alt_val < min_val) {
          mindex = i;
          min_val = alt_val;
          diff = base_val - min_val;
        }
      } else {
        if (alt_val > min_val) {
          mindex = i;
          min_val = alt_val;
          diff = min_val - base_val;
        }
      }
    }
    
    var best_report = mindex === -1 ? orig_report : alt_reports[mindex];
    var conclusion = {
      healthiest: best_report,
      difference: diff
    };
    resolve(conclusion);
  });
}




// Returns the nutrient report from a given ndbno; 
exports.food_report = function (ndbno) {
  return new Promise(function(resolve, reject) {
    var payload = {
      api_key: key,
      ndbno: ndbno,
      type: 'f', // we just need [b]asic. Ha jk we need full.
      format: 'json'
    };
    var url = reportURL + querystring.stringify(payload);
    new Request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {  
        var json_res = JSON.parse(body);
        var f = json_res.report.food;
        // Cut content from the report that we don't need. Why?
        // We need a standard defined format for the mongo db.
        
        var nuts = [];
        
        for (var i = 0; i < f.nutrients.length; i++) {
          var n = f.nutrients[i];
          var id = n.nutrient_id;
          if (id === 255 || id === 208 || id === 203 || 
            id === 204 || id === 205 || id === 291 || 
            id === 269 || id === 301 || id === 303 ||
            id === 306 || id === 307 || id === 606) {
            nuts.push({
              nutrient_id: n.nutrient_id,
              name: n.name,
              unit: n.unit,
              value: n.value // value per 100 grams.
            });
            console.log(JSON.stringify(nuts));
          }
        }
        var food = {
          name: f.name,
          ndbno: f.ndbno,
          group: f.fg,
          manu: f.manu,
          nutrients: nuts
        };
        console.log(JSON.stringify(food));
        
        resolve(food);
      } else {
        console.log('food_report() -> error: ', error, ', status code: ', response.statusCode);
        reject(error);
      }
    });
  });
};


// Returns a list of possible ndbno values matching a given query; via callback.
exports.find_foods = function (ing_name, food_group) {
  console.log('Inside nutrify finding food');
  return new Promise(function(resolve, reject) {
    if (food_group === undefined) food_group = '';
    var payload = {
      format: 'json',
      api_key: key,
      q: ing_name,
      sort: 'r', // sort by food [n]ame or [r]elevance.
      fg: food_group, // food group id. unknown.
      max: 20,
      offset: 0,
    };
    var url = searchURL + querystring.stringify(payload);
    console.log(url);
    new Request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var json_res = JSON.parse(body);
        resolve(json_res.list);            
      } else {
        console.log('find_foods() -> error: ', error, ', status code: ', response.statusCode);
        reject(response.statusCode);
      }
    });
  });
};