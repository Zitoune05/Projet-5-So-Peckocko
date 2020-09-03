const Sauce = require('../models/sauce');           //On récupére le modèl type d'une sauce
const mongoose = require('mongoose');               //mongoose pour interagir avec la base de donnée

exports.getAllSauces = (req, res, next) => {        // Récupère toutes les sauces dans la base de données pour les affichers
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  )
  .catch((error) => { res.status(500).json({error: error});});
};

exports.createSauce = (req, res, next) => {         // Création de sauce sur la base de données
    const sauceObject = JSON.parse(req.body.sauce); // On obtiens les informations par rapports aux valeurs d'entrée
    const sauce = new Sauce({                       // Ces valeurs d'entrée sont placées dans un élément sauce
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
    sauce.save()                                    // méthode save pour enregistrer la sauce dans la base de donnée
    .then(
      () => {
        res.status(201).json({                      
          message: 'Sauce bien créée !'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({                      // Affiche un status et message d'erreur
          error: error,
          message : "la sauce n'a pas pu etre créée !"  
        });
      }
    )
    .catch((error) => { res.status(500).json({error: error});});  //Erreur serveur
};
  
exports.getOneSauce= (req,res,next) => {            // Charge les informations de la sauce selectionnée
    Sauce.findOne({                                 // Méthode findOne pour trouver la sauce dans la base de donnée 
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    )
    .catch((error) => { res.status(500).json({error: error});});
};
  
exports.modifySauce = (req, res, next) => {         // Modification de la sauce sélectionnée
    const sauceObject = req.file ?                  // On obtiens les informations de la sauce 
    {
      ...JSON.parse(req.body.sauce),
      imageUrl : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,  
    } : {...req.body };   
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id : req.params.id})    // On push dans la base de données les informations modifiées
    .then(() => {res.status(201).json({message: 'Sauce updated successfully!' });})
    .catch((error) => { res.status(400).json({error: error });})
    .catch((error) => { res.status(500).json({error: error});});
};
               
exports.likeCtrl = (req,res,next) => {              // Pour liker/disliker
  const userCible = req.body.userId;                
  if(req.body.like == 1){
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => {
      sauce.usersLiked.push(userCible);
      sauce.likes += 1;
      sauce.save();  
      res.status(200).json({message : 'Sauce likée'})
    })
    .catch((error) => { res.status(400).json({error: error});})
    .catch((error) => { res.status(500).json({error: error});});
  } else if (req.body.like == 0 ){
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => { 
              const index = sauce.usersLiked.indexOf(userCible);            
              if(sauce.usersLiked.indexOf(userCible)>-1)
              {
                sauce.usersLiked.splice(index,1);                               
                                                                                
                sauce.likes -= 1;    
                                                      }      
            else if(sauce.usersDisliked.indexOf(userCible)>-1){         
              sauce.usersDisliked.splice(index,1); 
              sauce.dislikes -= 1;
            }                                                                     
            sauce.save();
            res.status(200).json({message : 'Sauce likée'})
    })       
    .catch((error) => { res.status(400).json({error: error});})

    .catch((error) => { res.status(500).json({error: error});})
          
    }
  else if(req.body.like == -1){
      Sauce.findOne({_id: req.params.id}) 
    .then(sauce => {
      sauce.usersDisliked.push(userCible);
      sauce.dislikes += 1;
      sauce.save();
      res.status(200).json({message : 'Sauce dislikée'})
    })        
    .catch((error) => { res.status(400).json({error: error});})
    .catch((error) => { res.status(500).json({error: error});});
    }
};
     
exports.deleteSauce = (req, res, next) => {         // Pour supprimer une sauce
    Sauce.deleteOne({_id: req.params.id})           // On sélectionne l'Id de la sauce à supprimer
    .then(     
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    )
    .catch((error) => { res.status(500).json({error: error});});
};
  
