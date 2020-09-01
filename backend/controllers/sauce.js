const Sauce = require('../models/sauce');           //On récupére le modèl type d'une sauce
const mongoose = require('mongoose');               //mongoose pour interagir avec la base de donnée


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
    sauce.save()
    .then(
      () => {
        res.status(201).json({
          message: 'Sauce bien crée'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error,
          message : "la sauce n'a pas pu etre crée"
        });
      }
    )
    .catch((error) => { res.status(500).json({error: error});});  
};
  
exports.getOneSauce= (req,res,next) => {
    Sauce.findOne({
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
  
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,  
    } : {...req.body };   
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id : req.params.id})
    .then(() => {res.status(201).json({message: 'Sauce updated successfully!' });})
    .catch((error) => { res.status(400).json({error: error });})
    .catch((error) => { res.status(500).json({error: error});});
};
        
          
exports.likeCtrl = (req,res,next) => {
  const userConcernate = req.body.userId;
  if(req.body.like == 1){
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => {
      sauce.usersLiked.push(userConcernate);
      sauce.likes += 1;
      sauce.save();  
      res.status(200).json({message : 'Sauce likée'})
    })
    .catch((error) => { res.status(400).json({error: error});})
    .catch((error) => { res.status(500).json({error: error});});
  } else if (req.body.like == 0 ){
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => { 
              const index = sauce.usersLiked.indexOf(userConcernate);            
              if(sauce.usersLiked.indexOf(userConcernate)>-1)
              {
                sauce.usersLiked.splice(index,1);                               
                                                                                
                sauce.likes -= 1;    
                                                      }      
            else if(sauce.usersDisliked.indexOf(userConcernate)>-1){         
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
      sauce.usersDisliked.push(userConcernate);
      sauce.dislikes += 1;
      sauce.save();
      res.status(200).json({message : 'Sauce dislikée'})
    })        
    .catch((error) => { res.status(400).json({error: error});})
    .catch((error) => { res.status(500).json({error: error});});
    }
};
    
    
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id}).then(
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
  
exports.getAllSauces = (req, res, next) => {
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