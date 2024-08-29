// cretion de API REST 
const express = require('express');
const mongoose = require('mongoose');
const app2 = express();
const PORT = process.env.PORT || 3000;
// Configuration de CORS
app2.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app2.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/sidyBD')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));

// Définition du modèle Product
const productSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    inStock: Boolean
});

const Product = mongoose.model('Product', productSchema);

// Routes

// GET /api/products
app2.get('/api/products', (req, res) => {
    Product.find()
        .then(products => res.status(200).json({ products }))
        .catch(error => res.status(400).json({ error }));
});

// GET /api/products/:id
app2.get('/api/products/:id', (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            if (product) {
                res.status(200).json({ product });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(error => res.status(400).json({ error }));
});

// POST /api/products
app2.post('/api/products', (req, res) => {
    const product = new Product(req.body);
    product.save()
        .then(product => res.status(201).json({ product }))
        .catch(error => res.status(400).json({ error }));
});

// PUT /api/products/:id
app2.put('/api/products/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(product => {
            if (product) {
                res.status(200).json({ message: 'Modified!' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(error => res.status(400).json({ error }));
});

// DELETE /api/products/:id
app2.delete('/api/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (product) {
                res.status(200).json({ message: 'Deleted!' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(error => res.status(400).json({ error }));
});


module.exports = app2;