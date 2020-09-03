const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require ('helmet');
const xss = require('xss-clean')
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

require('dotenv').config(); 

const app = express();

const limiteur = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 3 requêtes par fenêtre
});

app.use(limiteur);

mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@cluster0.ocrqz.gcp.mongodb.net/Database?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(xss());

app.use((req, res, next) => {                                                        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());
app.use('/image', express.static(path.join(__dirname,'images')));
app.use(bodyParser.json());                     //Transforme le corp de la requête en object Javascript utilisable 
app.use('/api/auth' ,userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;