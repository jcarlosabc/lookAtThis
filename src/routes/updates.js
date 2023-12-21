const express = require('express');
const use_route = express.Router();
const {pag_register} = require("../controller/autenticacion");


// => Rutas de registrar usuarios
use_route.get("/register", pag_register)
use_route.post("/configurarPerfil")



module.exports = use_route;