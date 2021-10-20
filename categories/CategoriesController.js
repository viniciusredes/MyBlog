const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify")
const adminAuth = require("../midlewares/adminAuth");


router.get("/categories", adminAuth, (req,res) => {
    res.send("ROTA de CATEGORIAS");
});

// router.get("/admin/categories/new", (req,res) => {
//     res.render('admin/categories/new');
// });

//Save category
router.post("/categories/save", adminAuth, (req,res) =>{
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title:title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect('/admin/categories');
    }
});

//Delete category
router.post("/categories/delete", adminAuth, (req,res) =>{
    var id=req.body.id;
    if(id!=undefined){
        if(!isNaN(id)){
           Category.destroy({
               where: {
                   id:id
               }
           }).then(() => {
            res.redirect('/admin/categories');
        });
        }else{
            res.redirect('/admin/categories');
        }
    }else{
        res.redirect('/admin/categories');
    }
});
//Update category
router.post("/categories/update", adminAuth, (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    Category.update({
        title:title, 
        slug: slugify(title)
    },{
        where: {
            id:id
        }
    }).then(() =>{
        res.redirect('/admin/categories');
    });
});

//Edit category
router.get("/categories/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/categories');
    }
    Category.findByPk(id).then(category_ => {
        if(id != undefined){
            res.render('admin/categories/edit', {category_:category_})
        }else{
            res.redirect('/admin/categories');
        }
    }).catch(erro => {
        res.redirect('/admin/categories');
    })
})
//list Category
router.get("/admin/categories", adminAuth, (req,res) => {    
    Category.findAll().then(categories => {
        res.render("admin/categories/", {categories:categories})
    });
})

module.exports = router;