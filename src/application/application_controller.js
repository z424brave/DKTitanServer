/**
 * Created by Damian.Kelly on 30/06/2016.
 */
(function () {
    'use strict';

    const path = require("path");

    let TITAN_GLOBALS = require("../core/titan_global");
    let TitanModelController = require(`${TITAN_GLOBALS.CORE}`.concat("/controllers/titan_model_controller"));
    let Logger  = require(`${TITAN_GLOBALS.COMMON}`.concat("/logger"));
    let s3Controller = require("../s3/s3_controller");

    let ApplicationModel = require('./application_model');

    class ApplicationController extends TitanModelController {

        constructor(req, res) {

            super(req, res);

            this.MODULE_ROOT = path.join(__dirname);
            this.MODULE_VIEWS = "views";
            this.CONTROLLER_ALLOWED_TYPES = ["json"];

            this.setReadme({
                "POST /"        : "Create a new Application",
                "PUT /:id"      : "Update an existing Application",
                "DELETE /:id"   : "Deletes an existing Application",
                "GET /:id"      : "Get the data for a specific Application",
                "GET /list"     : "List all the existing Applications"
            });

            this.setModel(ApplicationModel);

        }

        /**
         * Create an application
         */
        createApplication() {

            Logger.info(`create application - ${JSON.stringify(this.body())}`);
            this.setModel(new ApplicationModel(this.body()));
            super.create();

        }

        /**
         * Override the list() method to add the populate clause for application retrieval
         */
        list() {
            Logger.info(`ac : list() - calling model controller listWithPopulate()`);
            let populateArray = [];
            let populateObject = {};
            populateObject.path = 'applicationType';
            populateObject.select = 'name';
            populateArray.push(populateObject);
            let populateObject2 = {};
            populateObject2.path = 'user';
            populateObject2.select = 'name';
            populateArray.push(populateObject2);

            super.listWithPopulate(populateArray);
        }

        get() {
            Logger.info(`In get ${this.getModel().modelName} for ${this.id()}`);
            this.getModel().findOne({"_id": this.id()})
                .populate('applicationType', 'name')
                .then((data) => {
                    this.send(data);
                }).catch((err) => {
                    this.notFound();
                    Logger.error(err);
                }
            );
        }

        /**
         * Publish an application
         */
        publishApplication() {
            let applicationId = this.id();
            Logger.info(`publish application - ${applicationId}`);
            Logger.info(`publish application - ${JSON.stringify(this.body())}`);
            let s3Control = new s3Controller(this.req(), this.res());
            s3Control.createPublishFile();
            super.update();

        }
    }

    module.exports = ApplicationController;

})();
