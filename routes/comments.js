var express = require('express')
var router  = express.Router()
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')

router.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err) console.log(err)
      else res.render('comments/new.ejs',{campground:campground})
    })
})
router.post('/campgrounds/:id/comments',isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err) {
      req.flash('error',"something went wrong!")
      res.redirect('/campgrounds')
    }
    else {
      Comment.create({text: req.body.text, author: req.body.author},function(err,comment){
        if(err) console.log(err)
        else {
          comment.author.id= req.user._id
          comment.author.username= req.user.username
          comment.save()
          campground.comments.push(comment)
          campground.save()
          req.flash('sucess','Comment created successflly!')
          res.redirect('/campgrounds/show/'+ req.params.id)
        }
      })
    }
  })
})

router.get('/campgrounds/:camp_id/comments/:comment_id/edit',findCommentOwner,function(req,res){
  Campground.findById(req.params.camp_id,function(err,campground){
    Comment.findById(req.params.comment_id,function(err,comment){
      res.render('comments/edit.ejs',{campground:campground,comment:comment})
    })
 })
})

router.put('/campgrounds/:camp_id/comments/:comment_id',findCommentOwner,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err) res.redirect('back')
    else res.redirect('/campgrounds/show/' + req.params.camp_id)
  })
})

router.delete('/campgrounds/:camp_id/comments/:comment_id',findCommentOwner,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err) res.redirect('back')
    else {
      req.flash('success','Comment deleted!')
      res.redirect('/campgrounds/show/' + req.params.camp_id)
    }
  })
})

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) return next();
  req.flash('error','You need to Login first!')
  res.redirect('/login')
}

function findCommentOwner(req,res,next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id,function(err,comment){
      if(err) res.redirect('/campgrounds')
      else {
        if(req.user._id.equals(comment.author.id)) next();
        else {
          req.flash('error',"You don't have permissionto do that!")
          res.redirect('back')
        }
      }
    })
  }
      else {
        req.flash('error','You need to Login first!')
        res.redirect('/login')
      }
}

module.exports = router
