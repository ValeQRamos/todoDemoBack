// importar el modelo que voy a utilizar v1
const User = require("../models/User.model");
const mongoose = require("mongoose");
// Para el password
const bcryptjs = require("bcryptjs");
const {clearRes, createJWT} = require('../utils/utils')

// solo estas 3
// login, signup, logout

// api mandamos data en post
// get solo llamamos data

// signup controller
exports.signupProcess = (req, res, next) => {
  //params : id - query ? - frontend body
  // vamos a sacar el rol
  const { role, email, password, confirmPassword, ...restUser } = req.body;
  // validar campos vacios
  if (!email.length || !password.length || !confirmPassword.length)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar campos vacios!" });
  // password coincide
  if (password !== confirmPassword)
    return restUser
      .status(400)
      .json({ errorMessage: "Las contrasenas no son iguales!" });
  //  validar que el email existe 1.1
  // {email:email}
  User.findOne({ email })
    .then((found) => {
      // validar emial 1.2
      if (found)
        return res
          .status(400)
          .json({ errorMessage: "Ese correo ya fue tomado!" });

      return (
        bcryptjs
          .genSalt(10)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            // crearemos al nuevo usario
            return User.create({
              email,
              password: hashedPassword,
              ...restUser,
            });
          })
          // then contiene al user ya con password hashed y guardado en la db
          .then((user) => {
            // regresamos al usuario para que entre a la pagina y ademas creamos su token de acceso
            const [header, payload, signature] = createJWT(user);

            // vamos a guardar estos datos con las cookies
            // res.cookie('keyComoSeVaAGuardar'," elDatoQueVoyAlmacenar", { opciones } )
            res.cookie("headload", `${header}.${payload}`, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });
            res.cookie("signature", signature, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });
            // vamos a limpiar la repsues de mongoose convirtiendo el BSON a objeto y elimintar data basura
            const newUser = clearRes(user.toObject());
            res.status(201).json({ user: newUser });
          })
      );
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "el correo electronico ya esta en uso.",
        });
      }
    });
};

exports.loginProcess = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || !email.length || !password.length)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar campos vacios" });
  //validar la contraseña que contenga 8 caracteres o REDEX
  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res.status(400).json({ errorMessage: "Credenciales invalidas" });
      //validar que la contraseña sea correcta
      return bcryptjs.compare(password, user.password).then((match) => {
        if (!match)
          return res
            .status(400)
            .json({ errorMessage: "Credenciales invalidas" });
        //crear nuestro jwt
        const [header, payload, signature] = createJWT(user);
        res.cookie("headload", `${header}.${payload}`, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        });
        res.cookie("signature", signature, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        });
        //vamos a limpiar el response del usuario
        const newUser = clearRes(user.toObject());
        res.status(200).json({ user: newUser });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "el correo electronico ya esta en uso.",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};

exports.logoutProcess = (req, res, next) => {
  res.clearCookie('headload')
  res.clearCookie('signature')
  res.status(200).json({successMessage:'Saliste todo chido!!!, regresa pronto :D'})
}