const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authencicate = require('../authenticate')
const cors = require('./cors')

const Dishes = require('../models/dishes')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus = 200
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.find(req.query)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish) //push the dish as the body of the response with json format
            }, (err) => next(err)) //handled the returned err
            .catch((err) => next(err)) //handle the err happened when getting 
    })
    .post(cors.corsWithOptions, authencicate.verifyUser, //use the fist middleware first to authenticate. If it false, passport will handle it
        authencicate.verifyAdmin,
        (req, res, next) => {
            Dishes.create(req.body)
                .then((dish) => {
                    console.log('Dish Created ', dish)
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish)
                }, (err) => next(err))
                .catch((err) => next(err))
        })
    .put(cors.corsWithOptions, authencicate.verifyUser, authencicate.verifyAdmin,
        (req, res, next) => {
            res.statusCode = 403
            res.end('PUT operrtion not supported on /dishes')
        })
    .delete(cors.corsWithOptions, authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus = 200
    })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('POST operrtion not supported on /dishes/' + req.params.dishId)
    })
    .put(cors.corsWithOptions, authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(cors.corsWithOptions, authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })



module.exports = dishRouter