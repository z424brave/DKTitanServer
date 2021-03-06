/**
 * Created by Damian.Kelly on 30/06/2016.
 */
(function () {
    'use strict';

    let express = require("express");
    let Controller = require("./application_controller");
    let authService = require("../auth/auth_service");

    let router = new express();

    router.get('/', (req,res) => (new Controller(req,res)).index());
    router.get('/api/list', (req, res) => (new Controller(req, res)).list());
    router.get('/list', authService.hasRole('user'), (req, res) => (new Controller(req, res)).list());
    router.get('/api/:id',  (req,res) => (new Controller(req,res)).get());
    router.get('/:id', authService.hasRole('user'), (req,res) => (new Controller(req,res)).get());
    router.post('/', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).createApplication());
    router.delete('/:id', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).delete());
    router.put('/:id', authService.hasRole('admin'), (req,res) => (new Controller(req,res)).update());
    router.put('/publish/:id', (req,res) => (new Controller(req,res)).publishApplication());

    module.exports = router;

})();
