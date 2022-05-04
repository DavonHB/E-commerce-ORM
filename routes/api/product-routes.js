const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// products routes api endpoint 

router.get('/', (req, res) => {
    // gets all product
    Product.findAll({
        attributes: ['id', 'product_name', 'price', 'stock'],
        include: [
            {
                model: Category,
                attributes: ['category_name']  
            },
            {
                model: Tag,
                attributes: ['tag_name']
            }
        ]
    }) 
    .then(dbProductData => res.json(dbProductData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.get('/:id', (req, res) => {
    // gets one prduct based on id
    Product.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'product_name', 'price', 'stock'],
        include: [
            {
                model: Category,
                attributes: ['category_name']  
            },
            {
                model: Tag,
                attributes: ['tag_name']
            }
        ]
    }) 
    .then(dbProductData => {
        if(!dbProductData) {
            res.status(404).json({message: 'Not product found'});
            return;
        }
        res.json(dbProductData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.post('/', (req, res) => {
    //posts new product
    Product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
        tagIds: req.body.tagIds
    })
    .then((product) => {
        if(req.body.tagIds.length) {
            const productTagIdArray = req.body.tagIds.map((tag_id) => {
                return {
                    product_id: product.id,
                    tag_id,
                };
            });
            return ProductTag.bulkCreate(productTagIdArray);
        }
        res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
    // puts product update
    Product.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then((product) => {
        // finds all tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
        // gets list of current tag_ids
        const productTagsIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
        .filter((tag_id) => {
            return {
                product_id: req.params.id,
                tag_id,
            };
        });
        // finds which to remove
        const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
        //run both actions
        return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags)
        ]);
    })
    .then(updatedProductTags => res.json(updatedProductTags))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
    // delete product by id value
    Product.destroy( {
        where: {
            id: req.params.id
        }
    })
    .then(dbProductData => {
        if(!dbProductData) {
            res.status(404).json({message: 'No category found with this id'});
            return;
        }
        res.json(dbProductData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;