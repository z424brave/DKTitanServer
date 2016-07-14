/**
 * Created by Damian.Kelly on 23/06/2016.
 */
(function(){
    "use strict";

    let mongoose = require('bluebird').promisifyAll(require('mongoose'));
    let Schema = require('mongoose').Schema;

    let applicationTypeSchema = new Schema(
        {
            name: {type: String, unique: true, required : true, dropDups: true},
            tags: [{
                name: {type:mongoose.Schema.Types.ObjectId, ref:'Tag'},
                value: String
            }],
            nodes: [{
                nodeName: String,
                nodeType: String,
                required: Boolean,
                tags: [{
                    name: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
                    value: String
                }]
            }],
            applications: [{
                applicationType: {type:mongoose.Schema.Types.ObjectId, ref:'ApplicationType'},
                minOccurs: Number,
                maxOccurs: Number,
                defaultNumber: Number
            }]
        },
        {
            timestamps : {createdAt: "created", updatedAt: "updated"}
        }
    );
    module.exports = mongoose.model("ApplicationType", applicationTypeSchema);

})();
