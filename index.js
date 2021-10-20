const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

//import controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UserController")

//import models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//view engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret:"sessão_secreta_FBI_CIA",
    cookie: { maxAge: 3000000 }
}))

//Static
app.use(express.static('public')); 

/**
 * Body parser [deprecated]
 * app.use(bodyParser.urlencoded({extended:false}))
 * app.use(bodyParser.json());
 */
 
//Recurso nativo do Express [Atualização do biblioteca body-parser]
app.use(express.urlencoded({ extended: true })); 

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão Realizada com o Banco de Dados");
    }).catch((err) => {
        console.log(err);
    });

//Passando rotas do CategoriesController
app.use("/", categoriesController);
//Passando rotas do ArticlesController
app.use("/", articlesController);
//Passando rotas do UserController
app.use("/",usersController);

//List Articles in home
app.get ('/', (req,res) => {
    Article.findAll({
        limit:2,
        order:[
            ['id','DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories:categories});
        })        
    })    
});

app.get('/:slug', (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug:slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories:categories});
            })
        }else{
            res.redirect("/");
        }
        
    }).catch(err => {
        res.redirect("/");
    })
})

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug;
    Category.findOne({        
        where: {
            slug:slug
        },
        include: [{model: Article, limit:2}]
    }).then(category => {
        if(category != undefined){
            Category.findAll({                
            }).then(categories => {
                res.render("index", {articles:category.articles, categories: categories})
            })
        }else{
            res.redirect("/") 
        }
    }).catch(err => {
        res.redirect("/");
    })
})
// app.get("/:find", (req,res) => {
//     var find = req.params.find;
//     Article.findAll({
//         where: {
//             title: { [Op.like]: `%${find}%` } 
//         }        
//     }).then(articles => {
//         if(articles != undefined){
//             res.render("index", {articles: articles})
//         }else{
//             res.render("index", {articles : 'Conteúdo não encontrado'})
//         }
//     })
// })

app.listen(8080, () => {
    console.log("O servidor está rodando!");
});