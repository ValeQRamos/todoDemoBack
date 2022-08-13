const jwt = require("jsonwebtoken")
//para limpiar la respuesta de mongoose
exports.clearRes = (data)=>{
    const {password,createdAt,updatedAt,__v,...restData} = data
    return restData
}
//para crear el JSON web token
exports.createJWT = (user) =>{
    //jwt.sign({valorEncriptar},palabraSecreta,{opciones})
    // todo eso retorna => g63g1762g3712g37612.721y372y137y127y371.12831263612783 => [ "g63g1762g3712g37612", "721y372y137y127y371", "12831263612783"]
    return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role,//verificar si es necesario
        //username:user.username
    }, process.env.SECRET,{expiresIn:'24h'}).split(".")
}