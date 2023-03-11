'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: {type: Schema.Types.ObjectId, ref: 'Categorys'}
});

module.exports = mongoose.model('Products', ProductSchema);