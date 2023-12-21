const express = require('express');
const use_route = express.Router();
const {save_publicacion,save_likes} = require("../controller/publicacion_update")
const {isAuthenticated} = require("../controller/autenticacion")


use_route.post("/nueva_publicacion",isAuthenticated,save_publicacion);
use_route.post("/save_like",isAuthenticated,save_likes)




module.exports = use_route;