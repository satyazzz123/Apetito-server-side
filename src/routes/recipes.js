import express from 'express';

import {RecipeModel} from '../models/Recipes.js'
import { userModel } from '../models/Users.js';
import { verifytoken } from './users.js';

const router=express.Router();

router.get("/",async(req,res)=>{
    try {
        const response=await RecipeModel.find({});
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})
router.post("/",verifytoken,async(req,res)=>{

    const recipe= new RecipeModel(req.body)
    try {
        const response=await recipe.save()
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})
router.put("/",verifytoken,async(req,res)=>{


  
    try { 
    const recipe=await RecipeModel.findById(req.body.recipeId);
    const user=await userModel.findById(req.body.userId)
     user.savedRecipes.push(recipe)
     await user.save()
     res.json({savedRecipess:user.savedRecipes})
        
    } catch (error) {
        res.json(error)
    }
})
// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
    try {
      const result = await RecipeModel.findById(req.params.recipeId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //Post a search for recipes through name
  router.post("/search",async(req,res)=>{
    try {
      const{name}=req.body
      const result=await RecipeModel.find({name});
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(err);
    }
  })
  

router.get("/savedRecipes/ids/:userId", async (req, res) => {
    try {
      const user = await userModel.findById(req.params.userId);
      res.status(201).json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
router.get("/savedRecipes/:userId",async(req,res)=>{
    try {
        const user=await userModel.findById(req.params.userId)
        const savedRecipes=await RecipeModel.find({_id:{$in:user.savedRecipes}})
        res.json({savedRecipes})
    } catch (error) {
        res.json(error)
    }
})
router.post("/delete",async(req,res)=>{
  try {
    const user = await userModel.findById(req.params.userId);


  } catch (error) {
    console.log(error);
  }
})
export {router as recipesRouter}