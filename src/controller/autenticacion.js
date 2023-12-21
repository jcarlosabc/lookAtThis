
const conection = require("../database/db"); //establecer coneccion con la bd
const hashear = require("bcryptjs"); // llamamos la api de hashear
const jwt = require("jsonwebtoken");
const { promisify } = require('util');
const pc = require("picocolors") 

// => Renderiza la vista de registro de usuarios
exports.pag_register = async(req,res)=>{
    res.render("login/register", {alert:false});
};

// => Registrando usuarios
exports.registrando_usuario = async(req,res)=>{
    try {
        const { correo } = req.body 
        if( correo ){
            conection.query('SELECT correo FROM usuario WHERE correo = ?',[correo], async(error, results)=>{
                if (results[0]) {
                    if((results[0].correo) == correo){
                        res.render("login/register",{
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "El correo esta actualmente en uso",
                            alertIcon: "error",
                            showConfirmButton: true,
                            timer: false,
                            ruta: "register"
                        })
                    }
                } else {
                    const { nombres, apellidos, correo, clave } = req.body //llamando el contenido del formulario
                    //const salt ="80zzm081sr@nd0m";
                    //const passHash = createHash("sha256")
                    //.update(password)
                    //.update(createHash("sha256").update(salt, "utf8").digest("hex"))
                   // .digest("hex");
                
                    const passHash = await hashear.hash(clave,12) //hash para encryptar las constraseñas
                    const registroData = {nombres:nombres, apellidos: apellidos, correo:correo, clave:passHash} // Enpaquetando la info
                    const usuarioData = {correo:correo, clave:passHash}
        
                    await conection.query("INSERT INTO registro_usuarios SET ?",[registroData]) //ingresando los valores a la base de datos
                    await conection.query("INSERT INTO usuario SET ?",[usuarioData])
        
                    //para redireccionar a la pag de inicio
                    res.render("login/login",{
                        alert: true,
                        alertTitle: "Exitoso",
                        alertMessage: "Se Registro Correctamente",
                        alertIcon: "success",
                        showConfirmButton: true,
                        timer: false,
                        ruta: "login"
                    } )
                }
            })
        }         
    }catch (error) {
     console.log(error);
    }
}

// => Validar usuarios al iniciar sesion
exports.login = async(req,res) =>{
    try {
        const { correo, clave } = req.body 
        if( !correo || !clave ){
            res.render("login/login",{
                alert: true,
                alertTitle: "Error",
                alertMessage: "ingrese un usuario y/o contraseña",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: "login"
            })
        }else {
            conection.query("SELECT * FROM usuario WHERE correo = ?", [correo], async (error, results)=>{
                if(results.length == 0 || !(await hashear.compare(clave, results[0].clave))){
                    res.render("login/login",{
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o ontraseña incorrecta",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: false,
                        ruta: "login"
                    })
                }else{
                        //inicio de sesión OK
                        const id = results[0].id
                        const token = jwt.sign({ id: id }, 'super_secret_LookAThis')

                        const cookiesOptions = {
                            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        res.cookie('jwt', token, cookiesOptions)

                        let options = {
                            alert: true,
                            alertTitle: "¡Bienvenido!",
                            alertMessage: "",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: false,
                            ruta: './'
                        }
                        res.render('login/login', options)
                } 
            }) 
        }
    } catch (error) {
        console.log(error);
    }
}

// => Autenticando y obteniendo datos del que inicio sesion
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret_LookAThis');
            conection.query('SELECT u.*, ru.nombres, ru.apellidos FROM usuario u JOIN registro_usuarios ru ON u.id = ru.id WHERE u.id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0];
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}

// => Cerrar sesion o destruir sesion
exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

// => Validando proceso de inicio de sesion
exports.noLogueado = async (req, res, next) => {
    if (!req.cookies.jwt) {
        return next()
    } else {
        res.redirect('/')
    }
}

