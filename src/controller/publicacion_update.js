const { log } = require("console");
const conection = require("../database/db"); //establecer coneccion con la bd
const { promisify } = require('util');
const pc = require("picocolors") 

exports.save_publicacion = async (req, res) => {

  const {titulo,publiText} = req.body
  let fecha = new Date().toLocaleDateString("es-CO");
  const publicacion = {id_autor:req.user.id,titulo:titulo, descripcion:publiText,fecha:fecha}

  await conection.query("INSERT INTO publicaciones SET ?",[publicacion])

  res.redirect('/confperfil')
}

exports.save_likes = async (req, res) => {

  const {like, id_Publicacion} = req.body  
  console.log(pc.bgBlue("id_Publicacion : ") , pc.bgGreen(id_Publicacion))
  let cont_like = await conection.query("SELECT likes FROM publicaciones WHERE id = ?",[id_Publicacion])

  cont_like = cont_like[0]
  const total_like = parseInt(cont_like.likes) + like
  

  const likeData = {id_autor:req.user.id, likes:total_like}
  await conection.query("UPDATE publicaciones SET ? WHERE id = ?",[likeData, id_Publicacion])
  
  res.send(true)
}
