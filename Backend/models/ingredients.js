const mongoose = require('mongoose');
const { accessLog } = require('../startup/logging');

const IngredientsSchema = new mongoose.Schema({
    title: String,
    amount: Number
}, { versionKey: false, timestamps: true });

const Ingredients = mongoose.model('Ingredient', IngredientsSchema);
module.exports = { Ingredients }