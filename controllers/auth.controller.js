//importa el modelo que voy a utilizar v1
const User = require("../models/User.model");
const mongoose = require("mongoose");
//Para el password
const bcryptjs = require("bcryptjs");
const { clearRes, createJWT } = require("../utils/utils")

exports.signupProcess = (req, res, next) => {
  //params :id
  //query ?
  // frontend al back  body
  // vamos a sacar el role
  const { role, email, password, confirmPassword, ...restUser } = req.body;
  //validar campos vacios
  if (!email.length || !password.length || !confirmPassword.length)
    return res
      .status(400)
      .json({ errorMessage: "No debes mandar campos vacios!" });
  //Validar si el password >8 o con una regla regex

  //password coincide!
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ errorMessage: "La contraseñas no son iguales!" });

  //validar email existe! 1.1
  //{email:email} > {email:dylan.tc...}
  User.findOne({ email })
    .then((found) => {
      //validar email 1.2
      if (found)
        return res
          .status(400)
          .json({ errorMessage: "Ese correo ya fue tomado!" });

      return (
        bcryptjs
          .genSalt(10)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            //crearemos al nuevo usuario
            return User.create({
              email,
              password: hashedPassword,
              ...restUser,
            });
          })
          //then contiene al user ya con passwor hashed y guarado en la db
          //{…}
          .then((user) => {
            //regreamos al usuario para que entre a la pagina y ademas creamos su token de acceso
            const [header, payload, signature] = createJWT(user);

            //vamos a guardar estos datos en las cookies
            //res.cookie("key_como_se_va_guardar", "dato_que_voy_alamcernar",{opciones})
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
            /**
             *  user={
             *  firstName:…,
             *  lastName:…,
             *  password:56f12535612f536f12,
             * }
             *  toObject()
             *  {} Objecto || JSON
             *  {} BSON =>toObject() => Objecto ..., {perro,gato}, delete user.password
             */

            /**
             *  respues en frontend
             *  res.data = {
             *  result:{
             *      user:{…},
             *      listFriends:[{…},{…}]
             *  }
             * }
             */
            //vamos a limpar la respuesta de mongoose conviertiendo el BSON a objeto y eliminar data basura
            const newUser = clearRes(user.toObject());
            res.status(201).json({ user: newUser }); //{data:{ user:{} } }
          })
      );
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ errorMessage: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({
          errorMessage: "El correo electronico ya esta en uso",
        });
      }
      return res.status(500).json({ errorMessage: error.message });
    });
};


exports.loginProcess = (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password || !email.length || !password.length ) return res
    .status(400)
    .json({ errorMessage: "No debes mandar campos vacios!" }); 

    //validar el password > 8 o colocar el regex

    User.findOne({email})
    .then(user=>{
        //ver si el correo existe
        if(!user)return res
        .status(400)
        .json({ errorMessage: "Credenciales invalidas!" }); 

        //ver si la contraseña es correcta
        return bcryptjs.compare(password,user.password)
            .then(match=>{
                if(!match) return res
                .status(400)
                .json({ errorMessage: "Credenciales invalidas!" }); 

                //crear nuestro jwt 
                const [header,payload,signature] = createJWT(user)

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
                //vamos  limpiar el responde del usuario
                  const newUser = clearRes( user.toObject() );
                  res.status(200).json({user:newUser})
            })
    })
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: "El correo electronico ya esta en uso",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
}; 


exports.logoutProcess = (req,res,next)=>{
    res.clearCookie('headload');
    res.clearCookie('signature')
    res.status(200).json({successMessage:"Saliste todo chido!!! regresa pronto :D "})
}