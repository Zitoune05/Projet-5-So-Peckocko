const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');               //plug-in pour s'assurer l'impossibilité d'utiliser deux fois la même adresse e-mail    

const userSchema = mongoose.Schema({                                        // Schéma type d'un utilisateur
    email : { type: String, require: true, unique: true },
    password : { type: String, require: true }
});

userSchema.plugin(uniqueValidator);                                         // validateur appliqué au schéma

module.exports = mongoose.model('User', userSchema);