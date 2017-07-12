var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocal = require('passport-local-mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    Campground = require('./models/campgrounds'),
    User = require('./models/user'),
    Comment = require('./models/comments'),
    commentRoutes = require('./routes/comments'),
    campRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/auth')
mongoose.connect('mongodb://localhost/yelp_camp')
mongoose.Promise = require('bluebird')
// mongoose.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);

var port= process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public/css'))
app.use(express.static('public/js'))
app.use(express.static('views/partials'))
app.use(methodOverride('_method'))
app.use(flash())

app.use(require('express-session')({
  secret: "Yes I'm coming with a brand name",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(function(req,res,next){
  res.locals.currentUser= req.user
  res.locals.message= req.flash('error')
  next()
})

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(commentRoutes)
app.use(authRoutes)
app.use(campRoutes)

app.get('*',function(req,res){
  res.send("The page you're looking for is not found")
})

app.listen(port,function(){
  console.log('Camping has started')
})

// Campground.create({
//   name: 'Cedarwood',
//   image: 'https://media.pitchup.co.uk/images/5/image/private/s--8hoLaBBx--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1491506898/meonside-camping/x230275.jpg.pagespeed.ic.5NCulPiHqq.jpg'
// },function(err,camp){
//   if(err) console.log(err)
//   else console.log(camp)
// })

// var camps = [
//   {
//     name: "Cannonball",
//     image: "https://images.theoutbound.com/contents/102919/assets/1431900161082?h=420&auto=format&q=50&h=600&w=900"
//   },
//   {
//     name: "Avalanche",
//     image: "http://www.campingmunicipal-otaporto.fr/images/photos/tente.jpg"
//   },
//   {
//     name: "Chuckwagon",
//     image: "https://media.pitchup.co.uk/images/5/image/private/s--Mw9uFgDp--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1423732840/einon-valley-camping-pods/xcalf-grazing-in-field-by-the-pods_einon-valley-camping-pods.jpg.pagespeed.ic.AUvXJhbzmI.jpg"
//   },
//   {
//     name: "Cedarwood",
//     image: "https://media.pitchup.co.uk/images/5/image/private/s--8hoLaBBx--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1491506898/meonside-camping/x230275.jpg.pagespeed.ic.5NCulPiHqq.jpg"
//   },
//   {
//     name: "Cannonball",
//     image: "https://images.theoutbound.com/contents/102919/assets/1431900161082?h=420&auto=format&q=50&h=600&w=900"
//   },
//   {
//     name: "Avalanche",
//     image: "http://www.campingmunicipal-otaporto.fr/images/photos/tente.jpg"
//   },
//   {
//     name: "Chuckwagon",
//     image: "https://media.pitchup.co.uk/images/5/image/private/s--Mw9uFgDp--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1423732840/einon-valley-camping-pods/xcalf-grazing-in-field-by-the-pods_einon-valley-camping-pods.jpg.pagespeed.ic.AUvXJhbzmI.jpg"
//   },
//   {
//     name: "Cedarwood",
//     image: "https://media.pitchup.co.uk/images/5/image/private/s--8hoLaBBx--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1491506898/meonside-camping/x230275.jpg.pagespeed.ic.5NCulPiHqq.jpg"
//   },
//   {
//     name: "Cannonball",
//     image: "https://images.theoutbound.com/contents/102919/assets/1431900161082?h=420&auto=format&q=50&h=600&w=900"
//   },
//   {
//     name: "Avalanche",
//     image: "http://www.campingmunicipal-otaporto.fr/images/photos/tente.jpg"
//   },
//   {
//     name: "Chuckwagon",
//     image: "https://media.pitchup.co.uk/images/5/image/private/s--Mw9uFgDp--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1423732840/einon-valley-camping-pods/xcalf-grazing-in-field-by-the-pods_einon-valley-camping-pods.jpg.pagespeed.ic.AUvXJhbzmI.jpg"
//   },
//   {
//     name: "Cedarwood",
//     image: "https://media.pitchup.co.uk/images/5/image/private/s--8hoLaBBx--/c_fill,h_600,w_800/e_improve,fl_progressive/q_jpegmini/v1491506898/meonside-camping/x230275.jpg.pagespeed.ic.5NCulPiHqq.jpg"
//   }
// ]



// app.post('/campgrounds/:id/comments',function(req,res){
//     Campground.findById(req.params.id,function(err,campground) {
//       if(err) console.log(err)
//       else {
//         Comment.create(req.body.comment,function(err,comment){
//           if(err) console.log(err)
//           else
//         {
//           // Campground.comments.push(req.body.comment)
//           // Campground.save()
//           Campground.comments.push(comment)
//           // res.redirect('/')
//           console.log('successflly updated!')
//       }
//       })
//       }
//       })
// })
