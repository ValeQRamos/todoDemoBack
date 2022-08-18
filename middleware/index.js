//aqui vamos a crear un middleware que verifique si mi usuario esta logeado y ademas otro que verifique el rol

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { clearRes } = require("../utils/utils");


exports.verifyToken = (req,res,next)=>{
    //1.- vamos a desctructurar las cookies
    const {headload,signature} = req.cookies

    if(!headload || !signature) return res.status(401).json({errorMessage:"No estas autorizado"});

    //jwt.verify(jwt, ELSECRETO, (err,decoded)=>{})
    jwt.verify(`${headload}.${signature}`,process.env.SECRET, (error,decoded)=>{
        if(error){
            return res.status(401).json({errorMessage:"No estas autorizado"});
        }

        //decoded = { userId,role,email...}
        //findById
        User.findById(decoded.userId)
        .then(user=>{
            req.user = clearRes(user.toObject())
            next()//el next da paso a mi siguiente accion en mi ruta
        })
        .catch(error=>{
            res.status(401).json({errorMessage:"peluquin"});
        })
    })//<- end verify
}

                //["Admin"] || ["Admin","Staff"]
exports.checkRole = (arrayRoles) => {

    return (req,res,next)=>{
        //voy a sacar el rol req.user
        const {role} = req.user

        //validar si esta este rol en el arreglo
        if(arrayRoles.includes(role)){
            next()
        }else{
            res.status(401).json({errorMessage:"No tienes permiso para realizar esta acción!"});
        }
    }
}