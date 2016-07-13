(function () {
    'use strict';

    const path = require("path");

    const TITAN_GLOBALS = require("../../core/titan_global");

    const TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));

    const Logger = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));

    let LexiconModel = require('./lexicon_model');

    class LexiconController extends TitanModelController {

        constructor(req, res) {
            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Lexicon",
                "PUT /:id"      : "Update an existing Lexicon",
                "DELETE /:id"   : "Deletes an existing Lexicon",
                "GET /:id"      : "Get the data for a specific lexicon",
                "GET /list"     : "List all the existing Lexicons"
            });

            this.setModel(LexiconModel);

        }

        createLexicon() {
            Logger.info(`In createLexicon`);
            this.setModel(new LexiconModel(this.body()));
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
            populateObject.path = 'tags';
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

        /**
         * Override the list() method to add the populate clause for node retrieval
         */
        list() {
            Logger.info(`Lexicon Controller : list() - calling model controller listWithPopulate()`);
            let populateObject = {};
            populateObject.path = 'tags';
            populateObject.select = 'name description';
            super.listWithPopulate(populateObject);
        }
    }

    module.exports = LexiconController;

})();
