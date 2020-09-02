const bcrypt = require('bcrypt');                           // Package pour crypter le mot de passe
const jwt = require('jsonwebtoken');                        //Package pour créer des jetons uniques
const emailValidator = require('email-validator');          //plugin de validation d'email
const passWordValidator = require('password-validator');    //plugin de validation de mot de passe

const User = require('../models/user');

let schemaPassWord = new passWordValidator();   // variable de validation de mot de passe

schemaPassWord 
.is().min(8)                                    //longeur minimale 8
.is().max(50)                                   //longeur maximale 50
.has().uppercase()                              //Doit avoir des lettres majuscules
.has().lowercase()                              //Doit avoir des lettres minuscules
.has().digits(2)                                //Doit avoir au moins 2 chiffres
.has().not().spaces()                           //Les espaces sont interdits
.is().not().oneOf(['Passw0rd', 'Password123'])  //Liste noire de ces valeurs 

exports.signup = (req, res, next) => {          // Fonction d'inscription
    if (!emailValidator.validate(req.body.email) || !schemaPassWord.validate(req.body.password)) {              //Si l'email ou le mot de passe est invalide alors           
        res.status(400).json({ message : ' Votre email ou mot de passe est invalide. Veuillez réessayer !'});   // Affiche un status et message d'erreur
    } 
    else {
    bcrypt.hash(req.body.password, 10)          // Fonction de cryptage du mot de passe avec le mot de passé par le frontend et le solde de l'algorythme de hashage 
        .then( hash => {                        // On récupère le hash de mot de passe
            const user = new User({             // Création du nouvelle utilisateur  
            email: req.body.email,
            password: hash,
        });
        user.save()                             // méthode save pour enregistrer le nouvelle utilisateur dans la base de donnée
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
    })
        .catch(error => res.status(500).json({ error }));   
    }
};

exports.login = (req, res, next) => {           // Fonction de connexion
    User.findOne({ email: req.body.email })     // Méthode findOne pour trouver l'utilisateur dans la base de donnée correspondant à l'adresse mail envoyé dans la requête 
        .then(user => {
            if (!user) {                        // Si l'utilisateur n'est pas trouvé dans la base de donnée
            return res.status(401).json({ error: 'Utilisateur introuvable !' });    // Affiche un status et message d'erreur
        }
        bcrypt.compare(req.body.password, user.password)    //fonction pour comparer le mot de passe entré dans la requête avec le mot de passe dans la base de données
            .then(valid => {
                if (!valid) {                               //si le mot de passe est différent, renvoie un message d'erreur
                    return res.status(401).json({ error: 'Mot de passe incorrect !' }); 
                }
                res.status(200).json({                      // Requête validé avec un objet json contenant
                    userId: user._id,                       // L'identifiant de l'utilisateur dans la base de donnée
                    token: jwt.sign(                        // On génére un token valable pendant 24h
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' },
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));   //Erreur serveur
        })
        .catch(error => res.status(500).json({ error }));       //Erreur serveur
};

