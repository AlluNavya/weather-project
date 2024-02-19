const express=require("express");
const path=require("path");
const hbs=require("hbs");
const app=express();
const port=3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");


app.set('view engine','hbs');
app.set('views',template_path);
hbs.registerPartials(partials_path);

app.use(express.static(static_path));

app.get("",(req,res)=>{
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/index', (req, res) => {
    res.render('index')
})


app.get("/about",(req,res)=>{
    res.render('about');
})

app.get("/weather",(req,res)=>{
    res.render('weather');
})

app.get("*",(req,res)=>{
    res.render('404error',{
        errorMsg:'Oops! Page Not Found'
    });
})

const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/LoginForm")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('LogInCollection',logInSchema);

app.post('/signup', async (req, res) => {
    
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    //const checking = await LogInCollection.findOne({ name: req.body.name })

   try{
    //if (checking.name === req.body.name && checking.password===req.body.password) {
        //res.send("user details already exists")
    //}
   // else{
        await LogInCollection.insertMany([data])
   // }
   }
   catch(e){
    res.send("wrong inputs")
   }

    res.render("index");
});
app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("index", { naming: `${req.body.password}+${req.body.name}` })
        }
        else {
            res.send("incorrect password")
        }
    } 
    catch (e) {
        res.send("wrong details");
    }
})


app.listen(port,()=>{
    console.log(`Listening to the port at ${port}`);
})
