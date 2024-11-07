// routes/rankItemRoutes.js
import express from 'express';
import RankItem from '../models/rankItem.js';

const router = express.Router();

// GET all rank items
router.get('/', async (req, res, next) => {
  try {
    const rankItems = await RankItem.find({}).sort({ rank: 1 });
    res.json(rankItems);
  } catch (error) {
    next(error);
  }
});

// POST - Créer un nouvel item
router.post('/', async (req, res) => {
  try {
    console.log('Données reçues:', req.body); // Debug

    // Vérification des données reçues
    if (!req.body.siteName) {
      return res.status(400).json({ message: 'Le nom du site est requis' });
    }

    const newRankItem = new RankItem(req.body);
    const savedItem = await newRankItem.save();
    
    // S'assurer qu'on renvoie bien du JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json(savedItem);
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    // S'assurer qu'on renvoie bien du JSON même en cas d'erreur
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      message: error.message || 'Erreur lors de la création de l\'item'
    });
  }
});

// GET a specific rank item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const rankItem = await RankItem.findById(req.params.id);
    if (!rankItem) {
      return res.status(404).json({ message: 'Rank item not found' });
    }
    res.json(rankItem);
  } catch (error) {
    next(error);
  }
});

// PUT (update) a specific rank item by ID
router.put('/:id', async (req, res, next) => {
  try {
    const updatedRankItem = await RankItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedRankItem) {
      return res.status(404).json({ message: 'Rank item not found' });
    }
    res.json(updatedRankItem);
  } catch (error) {
    next(error);
  }
});

// DELETE a specific rank item by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedRankItem = await RankItem.findByIdAndDelete(req.params.id);
    if (!deletedRankItem) {
      return res.status(404).json({ message: 'Rank item not found' });
    }
    res.json({ message: 'Rank item deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;