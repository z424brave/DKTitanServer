(function () {
    'use strict';

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    const Lexicon = require('../lexicon/lexicon_model');

    let tagSchema = new Schema({
        name: {type: String, unique: true, required : true, dropDups: true},
        description: String,
        lexicon: {type:mongoose.Schema.Types.ObjectId, ref:'Lexicon'},
        status: {type: String, default: 'active'},
        requiresValue: {type: Boolean, default: false}
    },
    {
        timestamps : {createdAt: "created", updatedAt: "updated"}
    }        
    );

    module.exports = mongoose.model('Tag', tagSchema);

})();
