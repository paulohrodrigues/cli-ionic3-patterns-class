#! /usr/bin/env node

//------------------------variaveis nativas--------------------------------------
var fs      = require('fs');
var FilterClass  = require('./src/filter.class.js');

//------------------------variaveis gerais---------------------------------------
var arguments = process.argv.splice(2, process.argv.length -1).join(' ');
var argumentsArray = arguments.split(" "); 
var type           = argumentsArray[0];
var model          = argumentsArray[2].split("=");
var nameFile       = argumentsArray[1]+'.ts';
    model          = model [0] === "model" ? model[1]+".ts.mdl" : null;

//------------------------remove the file ts-------------------------------------
function remove(){
  return new Promise((resolve)=>{
    fs.unlink(`${__dirname}/${nameFile}`, (err) => {
      save().then((result)=>{
        resolve(true);
      });
    });
  });
}

//------------------------save the file ts---------------------------------------
function save(){
  return new Promise((resolve)=>{
    fs.readFile(`${__dirname}/patterns/${type}/${model}`,'utf8', function(err, data) {

      var codeResult = new FilterClass(data,argumentsArray);

      fs.appendFile(nameFile, codeResult.filter(), function (err) {
        if (err) throw err;
        console.log(data);
        resolve(true);
      });
    });
  });
}

//--------------------------call functions---------------------------------------
remove().then((result)=>{
  if(result===true){
    console.log("Created with success!");
  }
});