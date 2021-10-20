const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../midlewares/adminAuth");

// List Users
router.get("/admin/users", adminAuth, (req,res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    })
})

// Create User
router.get("/admin/users/create", adminAuth, (req,res) => {
    res.render("admin/users/create")
})

//New User
router.post("/users/create", adminAuth, (req,res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;        

    if(name != undefined && email != undefined && password != undefined){

        User.findOne({where:{email:email}}).then(user => {
            
            if(user == undefined){
                
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                
                User.create({
                    name:name,
                    email: email,
                    password:hash,
                    
                }).then(() => {
                    res.redirect("/")
                }).catch(err => {
                    res.redirect("/")
                })
            
            }else{
                
                res.redirect("/admin/users")
            }
        })              
        
    }else{
        if(password != confirmpassword){
            
            res.send("Senhas não conferem")
        
        }else{
            
            res.send("faiou")
        
        }
        
    }
})
//Delete User
router.get("/admin/users/delete", (req,res) => {
    res.send("cria usuários");
})
//Edit User
router.get("/admin/users/edit/:id", (req,res) => {
    var id = res.params.id;
    res.send("cria usuários");
})
//Update User
router.get("/admin/users/update", (req,res) => {
    res.send("cria usuários");
})

//Login User
router.get("/login", (req,res) => {
    res.render("admin/users/login")
})

//logout User
router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/")
})

//Authenticate User
router.post("/authenticate", (req, res) => {
    var email = req.body.login;
    var password = req.body.password;
        
    User.findOne({where:{email: email}}).then(user => {
        console.log(user)
        if(user != undefined){ // Se existe um usuário com esse e-mail
            // Validar senha
            var correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            }else{
                res.send("senha errada")
                //res.redirect("/login"); 
            }

        }else{
            res.send("undefined")
            //res.redirect("/login");
        }
    });

});

//User.sync({force:false});

module.exports = router;