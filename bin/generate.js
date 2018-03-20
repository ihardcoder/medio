require('module-alias/register');

const _    = require('lodash');
const Inquirer = require('inquirer');
const Utils = require('@libs/utils');
const Generator = require('@libs/generator');

const AppName = process.argv[2];

if(!AppName||/[^\w]/.test(AppName)){
  Inquirer.prompt([{
    type: 'input',
    name: 'appname',
    message: 'Invalid appname, please enter again:',
    validate(val){
      return !/[^\w]/.test(val);
    }
  }]).then(answer => {
    Generator(answer.appname);
  }).catch(err => {
    Utils.Log.Error(err);
  });
}else{
  Generator(AppName);
}