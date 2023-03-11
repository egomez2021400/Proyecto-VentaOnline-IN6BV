'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'Users'
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId, ref: 'Products',
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ],
    total: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Bills', BillSchema);