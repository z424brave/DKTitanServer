/**
 * Created by Damian.Kelly on 23/06/2016.
 */
(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;
    let Language = require('../language/language_model');

    let mediaSchema = new Schema (
        {
            language: Language.schema ,
            content: String
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

    let contentSchema = new Schema(
        {
            user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            media: [mediaSchema],
            translated: Boolean,
            sentForTranslation: Date,
            published: Date,
            versionNo: Number,
            versionMessage: String
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

    let nodeSchema = new Schema(
        {
            name: String,
            user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            content: [contentSchema],
            tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
            type: String,
            status: {type: String, default: 'active'}
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );

    let applicationSchema = new Schema(
        {
            name: {type: String, unique: true, required : true, dropDups: true},
            applicationType: {type:mongoose.Schema.Types.ObjectId, ref:'ApplicationType'},
            status: {type: String, default: 'active'},
            publishable: Boolean,
            user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
            nodes: [nodeSchema],
            applicationGroups: [
                {
                    name: String,
                    tags: [{type:mongoose.Schema.Types.ObjectId, ref:'Tag'}],
                    applications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Application'}]
                }
            ]
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );
    module.exports = mongoose.model("Application", applicationSchema);

})();
