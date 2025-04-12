// scripts/debugModels.js
const path      = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');
const fs        = require('fs');

const db = {};
fs.readdirSync(path.join(__dirname, '../models'))
  .filter(f => f.endsWith('.model.js'))
  .forEach(file => {
    const defineModel = require(path.join(__dirname, '../models', file));
    const model       = defineModel(sequelize, Sequelize.DataTypes);
    db[model.name]    = model;
  });

console.log('Registered model names:', Object.keys(db));
process.exit(0);