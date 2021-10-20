const express = require("express");
const router = express.Router();
const Article = require("./Article")
const slugify = require("slugify")
const Category = require('../categories/Category')
const adminAuth = require("../midlewares/adminAuth");

// List Articles
router.get("/admin/articles", adminAuth, (req,res) => {
    Article.findAll({
        include: [{model:Category}]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('admin/articles/index', {articles: articles, categories:categories})
        });        
    })
    
});

// New Article
// router.get("/admin/articles/new", (req,res) => {    
//     Category.findAll().then(categories => {
//         res.render('admin/articles/new', {categories:categories})
//     });
// })

// Save Article
router.post("/articles/save", adminAuth, (req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category; 
    if(title != undefined && body != undefined){
        Article.create({
            title:title,
            slug: slugify(title),
            body: body,
            categoryId:category
        }).then(() =>{
            res.redirect("/admin/articles")
        })
    }else{
        res.redirect("/admin/articles")
    }    
})

//Delete Article
router.post("/articles/delete", adminAuth, (req,res) =>{
    var id=req.body.id;
    if(id!=undefined){
        if(!isNaN(id)){
           Article.destroy({
               where: {
                   id:id
               }
           }).then(() => {
            res.redirect('/admin/articles');
        });
        }else{
            res.redirect('/admin/articles');
        }
    }else{
        res.redirect('/admin/articles');
    }
});

//Edit Article
router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/articles');
    }
    Article.findByPk(id).then(article => {        
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article:article, categories:categories})
            }).then(() =>{
                res.redirect('/admin/articles');
            });            
        }else{
            res.redirect('/admin/articles');
        }
    }).catch(err => {
        res.redirect("/")
    })
})

//Update Article
router.post("/articles/update", adminAuth, (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    Article.update({
        title:title, 
        slug: slugify(title),
        body: body,
        categoryId: category
    },{
        where: {
            id:id
        }
    }).then(() =>{
        res.redirect('/admin/articles');
    }).catch(err => {
        res.redirect("/")
    });
});
//Pagination
router.get("/admin/articles/page/:num", (req,res) => {
    var page = req.params.num;
    var offset = isNaN(page) || page == 1 ? 0 : (parseInt(page)-1) * 2;
    console.log(offset);
    Article.findAndCountAll({
        limit:2,
        offset: offset,
        order:[
            ['id','DESC']
        ] 
    }).then(articles => {        
        var next;
        if(offset + 2 >= articles.count){
            next = false;
        }else{
            next = true;
        }
        var result = {            
            page: parseInt(page),
            next:next,
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result:result, categories:categories})
        })
        //res.json(result);
    })
})
module.exports = router;