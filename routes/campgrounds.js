var express = require('express')
var router  = express.Router()
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')

router.get('/',function(req,res){
  res.render('home.ejs')
})

router.get('/campgrounds',function(req,res){
  // console.log(req.user)
  Campground.find({},function(err,allCampgrounds) {
    if(err) console.log(err)
    else res.render('campgrounds.ejs',{camps: allCampgrounds,currentUser: req.user})
  })
})

router.get('/campgrounds/new',isLoggedIn,function(req,res){
  res.render('campgrounds/new.ejs')
})

router.post('/campgrounds',isLoggedIn,function(req,res){
  var name= req.body.name;
  var image= req.body.image;
  var description= req.body.description;
  var author= {
    id: req.user._id,
    username: req.user.username
  }
  Campground.create({name: name, image: image, description: description, author: author},function(err,newAdded){
    if(err) console.log(err)
    else res.redirect('/campgrounds')
  })
})

router.get('/campgrounds/show/:id',function(req,res){
  var postId= req.params.id
  Campground.findById(postId).populate('comments').exec(function(err,foundData){
    if(err) console.log(err + 'errfound')
    else res.render('campgrounds/show.ejs',{foundData: foundData})
  })
})

router.get('/campgrounds/:id/edit',findCampgroundOwner,function(req,res){
          Campground.findById(req.params.id,function(err,camp){
            if(err) {
              res.redirect('back')
            }
            else res.render('campgrounds/edit.ejs',{camp: camp})
          })
})

router.put('/campgrounds/:id',findCampgroundOwner,function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,camp){
    if(err) {
      res.redirect('/campgrounds')
    }
    else {
      res.redirect('/campgrounds/show/' + req.params.id)
    }
  })
})

router.delete('/campgrounds/:id',findCampgroundOwner,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    res.redirect('/campgrounds')
  })
})

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) return next();
  req.flash('error',"You need to Login first!")
  res.redirect('/login')
}

function findCampgroundOwner(req,res,next) {
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id,function(err,camp){
      if(err) {
        req.flash('error','Campground not found!')
        res.redirect('/campgrounds')
      }
      else {
        if(req.user._id.equals(camp.author.id)) next();
        else {
          req.flash('error',"You don't have permission to do that!")
          res.redirect('back')
        }
      }
    })
  }
      else res.redirect('/login')
}

module.exports = router
