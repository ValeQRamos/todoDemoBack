const jwt = require('jsonwebtoken')
// para limpiar la respuesta de mongoose
exports.clearRes = (data) => {
  const { password, createdAt, updatedAt, __v, ...restData } = data;
  return restData;
};

exports.createJWT = (user) => {
  //jwt.sign( {valorAEncriptar, palabraSecreta, {opciones}} )
  //  toodo eso retorna => 12312123.ef34r3r23.4e32wefw
  return jwt
    .sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
        // username:user.user name  <--- todo lo que queramos almacenar
      },
      proces.env.SECRET,
      { expiresIn: "24h" }
    )
    .split(".");
};