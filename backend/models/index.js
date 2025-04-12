// models/index.js
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');
const db        = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.endsWith('.model.js'))
  .forEach(file => {
    const defineModel = require(path.join(__dirname, file));
    const model       = defineModel(sequelize, Sequelize.DataTypes);
    db[model.name]    = model;
  });

// Run all associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;