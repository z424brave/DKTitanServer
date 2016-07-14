(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    // const Tag = require('../tag/tag_model');

    let lexiconSchema = new Schema(
        {
            name: {type: String, unique: true, required : true, dropDups: true},
            description: String,
            // tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
            status: {type: String, default: 'active'}
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }

    );

    module.exports = mongoose.model('Lexicon', lexiconSchema);

})();
