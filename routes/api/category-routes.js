const router = require('express').Router();
const { Category, Product } = require('../../models');

// category routes api endpoints 
router.get('/', (req, res) => {
    // gets all categories
    Category.findAll({
        include: {
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
    }) 
    .then(dbCatData => {
        if(!dbCatData) {
            res.status(404).json({message: 'Not categories found'});
            return;
        }
        res.json(dbCatData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.get('/:id', (req, res) => {
    // gets one category based on id
    Category.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
    }) 
    .then(dbCatData => {
        if(!dbCatData) {
            res.status(404).json({message: 'Not categories found'});
            return;
        }
        res.json(dbCatData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.post('/', (req, res) => {
    //posts new category
    Category.create({
        category_name: req.body.category_name
    })
    .then(dbCatData => res.json(dbCatData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    // puts category update
    Category.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbCatData => {
        if(!dbCatData) {
            res.status(404).json({message: 'No category found with this id'});
            return;
        }
        res.json(dbCatData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    // delete category by id value
    Category.destroy( {
        where: {
            id: req.params.id
        }
    })
    .then(dbCatData => {
        if(!dbCatData) {
            res.status(404).json({message: 'No category found with this id'});
            return;
        }
        res.json(dbCatData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;