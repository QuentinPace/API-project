const express = require('express')
const { fn, col } = require('sequelize');

const { Spot, User, SpotImage, Review, ReviewImage } = require('../../db/models');


const { validateSpotCreate, validateSpotEdit, validateReviewCreate, validateQuery } = require('../../utils/validationArrays')


const router = express.Router()

router.get('/current', async(req,res) => {
    const { user } = req;
    if (user) {
        const allSpots = await Spot.findAll({
        where : {ownerId : user.id}
        })
        res.status(200)
        return res.json(allSpots)  
    } else {
        res.status(403)
        return res.json({
            "message": "Authentication required"
          });
    }
})

router.post('/:spotId/reviews', validateReviewCreate, async (req, res) => {
    const spotId = parseInt(req.params.spotId)
    const { user } = req
    if(user) {
        const spot = await Spot.findByPk(spotId)
        if(!spot){
            res.statusCode = 404
            return res.json({
                "message": "Spot couldn't be found"
              })
        }
        const allReviewsForSpot = await Review.findAll({
            where: {
                spotId: spotId
            }
        })
        for(let i = 0; i < allReviewsForSpot.length; i++){
            const currRev = allReviewsForSpot[i].dataValues
            if(currRev.userId === user.id){
                res.statusCode = 500
                return res.json({
                    "message": "User already has a review for this spot"
                  })
            }

        }
        const createdReview = await Review.create({
            ...req.body,
            userId: user.id,
            spotId: spot.dataValues.id
        })
        res.statusCode = 201
        return res.json(createdReview)
    }
    else {
        res.statusCode = 401
        return res.json({
            "message": "Authentication required"
          })
    }

})

router.get('/:spotId/reviews', async (req,res) => {
    const spotId = parseInt(req.params.spotId);
    const targetSpot = await Spot.findByPk(spotId);
    if (!targetSpot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
          })
    } else {
        const reviews = await Review.findAll({
            where : {
                spotId
            },
            include:[
                {
                    model:User,
                    attributes: ['id','firstName', 'lastName']
                },
                {
                    model:ReviewImage,
                    attributes: ['id','url']
                }
            ]
        })
        res.status(200);
        return res.json(reviews);
    }
})

router.post('/:spotId/images', async(req, res) => {
    const { user } = req
    if (user) {
        const spotFound = await Spot.findOne({
            where: {
                id: parseInt(req.params.spotId)
            }
        })
        if(spotFound.dataValues.ownerId !== user.id){
            res.statusCode = 403
            return res.json({
                "message": "Forbidden"
              })
        }
        if(!spotFound){
            res.statusCode = 404
            return res.json({
                message: "Spot couldn't be found"
            })
        }
        else{
            const newSpotImage = await SpotImage.create({
                ...req.body,
                spotId: parseInt(req.params.spotId)
            })
            const { id, url, preview } = newSpotImage
            res.statusCode = 201

            return res.json({
                id,
                url,
                preview
            })
        }    
    } else {
        res.status(403)
        return res.json({
            "message": "Authentication required"
          });

    }


})



router.get('/:spotId', async(req, res) => {
    const spotById = await Spot.findAll({
        where: {
            id: parseInt(req.params.spotId)
        }
    })
    console.log(spotById)
    if(!spotById.length){
        res.statusCode = 404
        return res.json({
            message: "Spot Couldn't be found"
        })
    }
    const ownerId = spotById[0].dataValues.ownerId
    const owner = await User.findOne({
        where: {
            id: ownerId
        },
        attributes: ['id', 'firstName', 'lastName']
    })

    const spotImages = await SpotImage.findAll({
        where: {
            spotId: parseInt(req.params.spotId)
        }
    })

    const imagesArr = []
    spotImages.forEach(spot => {
        const imageObj = {}
        imageObj.id = spot.dataValues.id
        imageObj.url = spot.dataValues.url
        imageObj.preview = spot.dataValues.preview
        imagesArr.push(imageObj)
    })
    const response = {
        ...spotById[0].dataValues,
        SpotImages: imagesArr,
        Owner: owner
    }
    res.statusCode = 200
    return res.json(response)
})


router.put('/:spotId', validateSpotEdit, async (req, res,next ) => {
    if(!req.user) {
        res.status = 403;
        res.json({
            "message": "Authentication required"
          })
    } else {
        const spotId= parseInt(req.params.spotId);
        const targetSpot = await Spot.findByPk(spotId);
        
            if(!targetSpot) {
                res.status(404);
                return res.json({
                    "message": "Spot couldn't be found"
                })
            } else {
                if(targetSpot.dataValues.ownerId !== req.user.id){
                    res.statusCode = 403
                    return res.json({
                        "message": "Forbidden"
                      })
                }
                await Spot.update(
                    req.body, // attributes and values to update
                    { where:
                        { id: spotId}  // specific records to update
                    }
                )
                const updatedSpot = await Spot.findByPk(spotId);
                res.status(200);
                return res.json(updatedSpot);
            }
    }
})

router.delete('/:spotId', async (req, res) => {
    const spotId = parseInt(req.params.spotId)
    if(!req.user){
        res.status(401)
        return res.json({
            "message": "Authentication required"
          })
    }
    else{
        const targetSpot = await Spot.findByPk(spotId);
        if(targetSpot.dataValues.ownerId !== req.user.id){
            res.statusCode = 403
            return res.json({
                "message": "Forbidden"
              })
        }
        if(!targetSpot){
            res.status(404)
            return res.json({
                "message": "Spot couldn't be found"
              })
        }else {
            await targetSpot.destroy()
            res.statusCode = 200
            return res.json({
                "message": "Successfully deleted"
              })
        }
    }

})




router.get('/', validateQuery, async(req, res) => {
    try {

        //getting page and size
        const page = req.query.page ? req.query.page : 1
        const size = (req.query.size && req.query.size <= 20 ) ? req.query.size : 20
        console.log(`\npage:${page}\nsize:${size}\n`)

        const query = {
            attributes: {
                include: [
                    [fn('AVG', col('Reviews.stars')), 'avgRating']  
                ]
            },
            include: [
                {
                    model: Review,
                    attributes: [],  
                    required :false
                },
                {
                    model: SpotImage,
                    where :{ preview: true},
                    attributes:[['url','previewImage']],
                    required :false
                }
            ],
            limit: size,
            offset: size * (page - 1),
            group: ['Spot.id'],  // Group by SpotId
        }

        console.log(query)
      

        const querysArr = Object.keys(req.query)

        //where i will do the filters for the query
        if(querysArr.length){
            for(let i = 0; i < querysArr.length; i++){
                //query.where[querysArr[i]] = req.params
            }
        }
        const spots = await Spot.findAll(query);
        
        const formattedSpots = spots.map(spot => {
            let previewImage = spot.dataValues.SpotImages.length > 0 ? spot.dataValues.SpotImages[0].dataValues.previewImage : null; 
            delete spot.dataValues.SpotImages;
            return {
                ...spot.get(),
                previewImage,  
            };
        });


        res.statusCode = 200
        return res.json(formattedSpots); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching spots.' });
    }
    

    // res.statusCode = 200
    // return res.json(allSpots)
})


router.post('/', validateSpotCreate, async(req, res) => {
    const { user } = req;
    //const { address, city, state, country, lat, lng, name, description, price } = req.body
    if (user) {
        const newSpot = await Spot.create({
            ownerId: user.id,
            ...req.body
        })
        res.status(201)
        return res.json(newSpot)
    } else {
        res.status(403)
        return res.json({
            "message": "Authentication required"
          });
    }

})


module.exports = router;