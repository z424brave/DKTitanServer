(function () {
    'use strict';

    const path = require("path");
    
    let TagModel = require('../tag/tag_model');

    const TITAN_GLOBALS = require("../../core/titan_global");
    
    const TitanModelController = require(`${ TITAN_GLOBALS.CORE}`.concat('/controllers/titan_model_controller'));
    const Logger = require(`${TITAN_GLOBALS.COMMON}`.concat('/logger'));

    class TagController extends TitanModelController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Tag",
                "PUT /:id"      : "Update an existing Tag",
                "DELETE /:id"   : "Deletes an existing Tag",
                "GET /:id"      : "Get the data for a specific Tag",
                "GET /list"     : "List all the existing Tags"
            });

            this.setModel(TagModel);

        }

        createTag() {
            Logger.info(`In createTag`);
            this.setModel(new TagModel(this.body()));
            this.create();
        }

        /**
         * Retrieves a single instance of the model using the _id value and sends the JSON back as a response.
         *
         * NB. the attribute "updated" is filtered out so that the value is not returned when performing an
         * update (based on the data returned from this get()) and therefore the Mongoose timestamps
         * functionality will step in and supply the updated value.
         *
         * Not sure this is the best way of doing this but if "updated" value is already set in the updated data
         * (from the get() data) then it is not overridden by the Mongoose timestamps functionality
         *
         */
        get() {
            Logger.info(`In get ${this.getModel().modelName} for ${this.id()}`);
            let populateObject = {};
            populateObject.path = 'lexicon';
            populateObject.select = 'name';
            this.getModel().findOne({"_id": this.id()})
                .select("-updated")
                .populate(populateObject)
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.notFound();
                    Logger.error(err);
                }
            );
        }

    }

    module.exports = TagController;

})();
