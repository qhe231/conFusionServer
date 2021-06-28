const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Favourite = require('../models/favourite')
const Dishes = require('../models/dishes')


const favouriteRouter = express.Router()
favouriteRouter.use(bodyParser.json())

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus = 200
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.findOne({ 'user': req.user })
            .populate('user')
            .populate('dishes')
            .then((favourite) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favourite)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.findOne({ 'user': req.user })
            .then((favourite) =>
                favourite || Favourite.create({ user: req.user })
            )
            .then((favourite) => {
                req.body.forEach((dish) => {
                    favourite.dishes.push(dish._id)
                })
                favourite.save()
                    .then((favourite) => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(favourite)
                    })

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.findOneAndRemove({ 'user': req.user })
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

favouriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus = 200
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.findOne({ 'user': req.user })
            .then((favourite) => {
                if (favourite === null) {
                    Favourite.create({ user: req.user })
                        .then((favourite) => {
                            favourite.dishes.push(req.params.dishId)
                            favourite.save()
                                .then((favourite) => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(favourite)
                                })
                        })
                } else {
                    favourite.dishes.push(req.params.dishId)
                    favourite.save()
                        .then((favourite) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(favourite)
                        })
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourite.findOne({ 'user': req.user })
            .then((favourite) => {
                if (favourite !== null && Favourite.find({ 'dishes': { 'id': req.params.dishId } })) {
                    favourite.dishes.pull(req.params.dishId)
                    favourite.save()
                        .then((favourite) => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(favourite)
                        })
                } else if (favourite === null) {
                    err = new Error('No favourite dish is found!')
                    err.status = 404
                    return next(err)
                } else {
                    err = new Error('Dish ' + req.params.dishId + ' not in your favourite list!')
                    err.status = 404
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

module.exports = favouriteRouter