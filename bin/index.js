#! /usr/bin/env node

//------------------------variaveis nativas--------------------------------------
var fs      = require('fs');
var FilterClass  = require('./src/filter.class.js');

//------------------------variaveis gerais---------------------------------------
var filesName           = [];
var arguments           = process.argv.splice(2, process.argv.length -1).join(' ');
var argumentsArray      = arguments.split(" "); 
    if(argumentsArray[2]==undefined && argumentsArray.length==2){
      argumentsArray.push("model=pattern1");
    }
var type                = argumentsArray[0];
var model               = argumentsArray[2].split("=");
var nameFile            = argumentsArray[1]+'.ts';
    model               = model [0] === "model" ? model[1]+".ts.mdl" : null;


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

//------------------------list files ts-------------------------------------------
function list(){
  return new Promise((resolve)=>{
    fs.readdir(`${__dirname}/patterns/${type}/`, (err, files) => {

      files.forEach(file => {
        filesName.push(file.split(".ts.mdl")[0]);
      });
      save().then((r)=>{
        resolve(true);
      });

    });
  });
}

//------------------------save the file ts---------------------------------------
function save(){
  return new Promise((resolve)=>{
    fs.readFile(`${__dirname}/patterns/${type}/${model}`,'utf8', function(err, data) {

      var codeResult = new FilterClass(data,filesName,argumentsArray);
      if(codeResult.validateInit==true){
        fs.writeFile(nameFile, codeResult.filter(), function (err) {
          if (err) throw err;
          resolve(true);
        });
      }
    });
  });
}

//--------------------------call functions---------------------------------------
list().then((result)=>{
  if(result===true){
    console.log("Created with success!");
  }
});