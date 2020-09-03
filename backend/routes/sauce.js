const express = require('express');                 
const router = express.Router();                            //Création d'un router avec la méthode .Router() d'express

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/',auth, sauceCtrl.getAllSauces );              // Création des routes pour différentes requêtes 
router.post('/',auth, multer, sauceCtrl.createSauce );
router.post('/:id/like',auth,sauceCtrl.likeCtrl );
router.get('/:id',auth, sauceCtrl.getOneSauce );
router.put('/:id',auth, multer, sauceCtrl.modifySauce );
router.delete('/:id',auth, multer, sauceCtrl.deleteSauce );

module.exports = router;