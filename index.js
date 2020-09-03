const express=require("express")
const mongoose=require("mongoose")
const ShortUrl=require('./models/shorturl')
const app=express();

mongoose.connect('mongodb://localhost/urlshortner',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
app.set("view engine",'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/',async function(req,res){
    const shortUrl=await ShortUrl.find()
    res.render('index',{
        shortUrl:shortUrl
    })

});

app.post("/shorturl",async (req,res)=>{

   await  ShortUrl.create({
        full:req.body.fullUrl
    })
    res.redirect('/')
});


app.get("/:short",async (req,res)=>{

   const shorturl=await  ShortUrl.findOne({short:req.params.short})

   if(shorturl==null){
       return res.sendStatus(404);
   }

   shorturl.clicks++
   shorturl.save()

   res.redirect(shorturl.full)
})
var port =process.env.PORT || 1337;
app.listen(port, ()=>{
    console.log(`SERVER STARTED AT ${port}`)
});