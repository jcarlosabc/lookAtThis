const express = require('express');
const use_route = express.Router();
const {pag_index,pag_configurarPerfil /*pag_contact, pag_culture, pag_lifestyle*/} = require("../controller/logica_paginacion")
const {isAuthenticated} = require("../controller/autenticacion")

use_route.get("/", isAuthenticated, pag_index)
use_route.get("/confperfil",isAuthenticated,pag_configurarPerfil)


// use_route.get("/contact", pag_contact)
// use_route.get("/culture", pag_culture)
// use_route.get("/lifestyle", pag_lifestyle)

module.exports = use_route;