const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// tag routes api endpoints 
router.get('/', (req, res) => {
    // gets all tags
    Tag.findAll({
        include: {
            model: Product,
            attributes: ['product_name', 'price', 'stock', 'category_id']
        }
    }) 
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.get('/:id', (req, res) => {
    // gets one Tag based on id
    Tag.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Product,
            attributes: ['product_name', 'price', 'stock', 'category_id']
        }
    }) 
    .then(dbTagData =>res.json(dbTagData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.post('/', (req, res) => {
    //posts new tag
    Tag.create({
        tag_name: req.body.tag_name
    })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    // puts tag update
    Tag.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbTagData => {
        if(!dbTagData) {
            res.status(404).json({message: 'No tag found with this id'});
            return;
        }
        res.json(dbTagData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    // delete tag by id value
    Tag.destroy( {
        where: {
            id: req.params.id
        }
    })
    .then(dbTagData => {
        if(!dbTagData) {
            res.status(404).json({message: 'No tag found with this id'});
            return;
        }
        res.json(dbTagData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;