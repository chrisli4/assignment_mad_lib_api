'use strict';

const bcrypt = require('bcrypt-nodejs');
const md5 = require('md5');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    token: { type: DataTypes.STRING}
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.generateToken = function(email) {
    return md5(`${ email }${ uuid() }`);
  };

  User.prototype.verifyPassword = function(password) {
    console.log('pass ' + password);
    console.log('this.pass ' + this.password);
    return bcrypt.compareSync(password, this.password);
  };
  
  User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  return User;
};
