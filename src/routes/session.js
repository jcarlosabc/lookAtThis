const express = require('express');
const use_route = express.Router();
const {pag_register, registrando_usuario, noLogueado, login, logout} = require("../controller/autenticacion")

// => Rutas de registrar usuarios
use_route.get("/register", pag_register)
use_route.post("/registrar_usuario",registrando_usuario)

// => Rutas de Login
use_route.get("/login", noLogueado, (req, res) =>{
    res.render("login/login",{ alert:false});
});
use_route.post("/login", noLogueado, login );
use_route.get("/logout", logout);

module.exports = use_route;