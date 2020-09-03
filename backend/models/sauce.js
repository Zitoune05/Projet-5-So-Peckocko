const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({                    // Schéma type d'une sauce
    userId : { type : String,required : true },
    name: { type : String, required : true},
    manufacturer: { type : String, required : true },
    description: { type : String, required : true },
    mainPepper: { type : String, required : true },
    imageUrl: { type : String, required : false },
    heat: { type : Number, required : true },
    likes: { type: Number,default: 0, },
    dislikes: { type: Number,default: 0, },
    usersLiked: { type: [String],default: [], },
    usersDisliked: { type: [String],default: [], }
});

module.exports = mongoose.model('sauce',sauceSchema)  //On exporte ce schéma