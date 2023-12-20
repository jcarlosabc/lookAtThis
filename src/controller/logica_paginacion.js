const conection = require("../database/db") //establecer coneccion con la bd
const pc = require("picocolors") 

// => Renderizando el nombre de usuario de la pagina principal
exports.pag_index = async (req, res) => {
  let userInfo = await conection.query("SELECT ru.* FROM usuario u JOIN registro_usuarios ru ON u.id = ru.id WHERE u.id = ? LIMIT 1", [req.user.id]);
  userInfo = userInfo[0]
  const nombre_apellido = userInfo.nombres + " " + userInfo.apellidos
  
    res.render("index",{user: req.user, nombre_apellido, alert:false});
};





















// exports.pag_nosotros = async(req, res) =>{

//     res.render("nosotros",{});
// };

// exports.pag_chato = async(req, res) =>{

//     res.render("chat",{});
// };

// exports.pag_contact = async(req, res)=>{

//     res.render("contact",{});
// }

// exports.pag_lifestyle = async(req,res)=>{
//     res.render("lifestyle",{});
// }

// exports.pag_culture = async(req,res)=>{
//     res.render("culture",{});
// }

