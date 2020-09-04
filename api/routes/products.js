const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../../models/Products')

router.get('/', (req, res, next) => {
    Product.find()
    .select('name age _id')
    .exec()
    .then(docs => {
        const response = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    name : doc.name,
                    age : doc.age,
                    request : {
                        method : 'GET',
                        url : 'http://localhost:3000/product/' + doc._id
                    }
                }
            })
        }
        res.status(200).json({
            message : 'data was fetched',
            dataProducts :response
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })  
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name age _id')
    .exec()
    .then(doc=> {
        console.log(doc);
        if(doc){
            res.status(200).json({
                message : 'data was fetched',
                dataProduct : {
                    name : doc.name,
                    age: doc.age,
                    request : {
                        method: 'GET',
                        url: 'http://localhost:3000/product/'
                    }
                }
            })
        }else{
            res.status(404).json({message : 'Product ID not found'})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

router.post('/',(req, res) => {
    const product = new Product({
        name: req.body.name,
        age: req.body.age,
    });
        product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                dataProduct: {
                    name : result.name,
                    age : result.age,
                    request : {
                        methods : 'GET',
                        url : 'http://localhost:3000/product/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error :err
            });
        })
    });

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propsName] = ops.value;
    }

    Product.update({ _id : id}, {$set: updateOps})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: 'Data updated',
            product : result   
    })
    .catch(err => console.log(err))
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id : id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : 'Data product was deleted',
            result : {
                body : {
                    name : 'String',
                    age : 'Number',
                },
                request : {
                    methods : 'POST',
                    url : 'http://localhost:3000/product/'
                }
            }
        })
    })
    .catch(err => console.log(err))
})

module.exports = router