'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = Schema({
    name: String,
    description: String,
    productos: [{type: Schema.Types.ObjectId, ref: 'Products'}]
});

module.exports = mongoose.model('Categorys', CategorySchema);