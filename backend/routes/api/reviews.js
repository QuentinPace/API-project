const express = require('express');

const { Spot, User, SpotImage, ReviewImage,Review } = require('../../db/models');

const { Op } = require('sequelize');

const { validateReviewEdit } = require('../../utils/validationArrays')

const router = express.Router();


router.get('/current', async (req, res) => {
    const { user } = req
    //const response = {}
    if(user){
        const reviewsOfCurrent = await Review.findAll({
            where: {
                userId: user.id
            },
            include: {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city','state', 'country', 'lat', 'lng', 'name', 'price'],
                include: {
                    model: SpotImage,
                    attributes: ['url'],
                    where: {
                        preview: true
                    }
                }
            },
        })
        //getting the preview image for each spot

        console.log(reviewsOfCurrent)
        reviewsOfCurrent.forEach(review => {
            if(review.dataValues.Spot){
                const reviewImageUrl = review.dataValues.Spot.dataValues.SpotImages[0].url
                //console.log(reviewImageUrl)
                review.dataValues.Spot.dataValues.previewImage = reviewImageUrl
                delete review.dataValues.Spot.dataValues.SpotImages
            }
            else {
            }
        })


        for(let i = 0; i < reviewsOfCurrent.length; i++){


            //adding reviewImages
            const currReview = reviewsOfCurrent[i]
            console.log(currReview.dataValues.id)
            const reviewImages = await ReviewImage.findAll({
                where: {
                    reviewId: currReview.dataValues.id
                },
                attributes: ['id', 'url']
            })
            currReview.dataValues.ReviewImages = reviewImages


            //adding user key on each review
            currReview.dataValues.User = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName
            }
       
        }


        res.statusCode = 200


        return res.json({
            Reviews: reviewsOfCurrent
        })


    } else {
        res.statusCode = 401
        return res.json({
            "message": "Authentication required"
          })


    }


})


router.post('/:reviewId/images',async (req,res)=>{
    if(!req.user) {
        return res.json({
            "message": "Authentication required"
          })
    } else{
        const reviewId = parseInt(req.params.reviewId)
        const targetReview = await Review.findByPk(reviewId);
        if (!targetReview){
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        } else {
            if(targetReview.dataValues.userId !== req.user.id){
                res.statusCode = 403
                return res.json({
                    "message": "Forbidden"
                  })
            }
            const existingImages = await ReviewImage.findAll({
                where : {
                    reviewId
                }
            })
            if (existingImages.length>=10){
                res.status(403);
                res.json({
                    "message": "Maximum number of images for this resource was reached"
                })
            } else {
                const newReviewImage = await ReviewImage.create({
                    reviewId,
                    url:req.body.url
                })
                const { id, url } = newReviewImage;
                res.statusCode = 201;
                return res.json({id,url});
            }
        
        }
    }
})

router.delete('/:reviewId/',async (req,res) => {
    if (!req.user) {
        res.statusCode = 401
        return res.json({
            "message": "Authentication required"
          })
    } else {
        const reviewId = parseInt(req.params.reviewId);
        const targetReview = await Review.findByPk(reviewId)
        if (!targetReview) {
            res.status(404);
            return res.json({
                message: "Review couldn't be found"
              })
        } else{
            if(targetReview.dataValues.userId !== req.user.id){
                res.statusCode = 403
                return res.json({
                    "message": "Forbidden"
                  })
            }
            await targetReview.destroy()
            res.statusCode = 200
            return res.json({
                "message": "Successfully deleted"
            })
        }
    }
})

router.put('/:reviewId', validateReviewEdit, async (req,res) => {
    if (!req.user) {
        res.statusCode = 401
        return res.json({
            "message": "Authentication required"
          })
    } else {
        const reviewId = parseInt(req.params.reviewId);
        const targetReview = await Review.findByPk(reviewId)
        if (!targetReview) {
            res.status(404);
            return res.json({
                message: "Review couldn't be found"
              })
        } else{
            if(targetReview.dataValues.userId !== req.user.id){
                res.statusCode = 403
                return res.json({
                    "message": "Forbidden"
                  })
            }
            await Review.update(
                req.body, // attributes and values to update
                { where:
                    { id: reviewId}  // specific records to update
                }
            )
            const updatedReview = await Review.findByPk(reviewId);
            res.status(200);
            return res.json(updatedReview);

    }
    }

})

module.exports = router;