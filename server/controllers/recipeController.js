require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');



// get the homepage

exports.homepage = async (req, res) => {

    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const african = await Recipe.find({ 'category': 'African' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

        const food = { latest, african, american, chinese };
        res.render('index', { title: 'Cooking Blog - Home', categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occures" })
    }



}

// get the chathome

exports.chatpage = async(req, res)=> {
  res.render('index1');
}

// get the chatroom

// exports.chatroom = async(req, res)=> {
//   res.render('chat');
// }


//get categoeies

exports.exploreCategories = async (req, res) => {

    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occures" })
    }


}

//get category by id

exports.exploreCategoriesById = async (req, res) => {

    try {

        let categoryId = req.params.id;

        const limitNumber = 20;
        const categoryById = await Recipe.find({'category': categoryId }).limit(limitNumber);
        res.render('categories', { title: 'Cooking Blog - Categories', categoryById });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" })
    }


}

//get recipe with the id

exports.exploreRecipe = async (req, res) => {

    try {

        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Cooking Blog - Recipe', recipe});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occures" })
    }


}

// searchRecipe

exports.searchRecipe = async (req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search:searchTerm, $diacriticSensitive:true}});
        res.render('search', { title: 'Cooking Blog - Search', recipe});
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occures" }) 
    }
}

//explore latest
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  
  /**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  
/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }
  
  /** 
   * POST /submit-recipe
   * Submit Recipe
  */
  exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
  }
  
  

// async function insertDummyCategoryData() {
//     try {
//         await Category.insertMany(
//             [
//                 {
//                     "name": "Thai",
//                     "image": "thai-food.jpg"
//                 },
//                 {
//                     "name": "American",
//                     "image": "american-food.jpg"
//                 },
//                 {
//                     "name": "Chinese",
//                     "image": "chinese-food.jpg"
//                 },
//                 {
//                     "name": "Mexican",
//                     "image": "mexican-food.jpg"
//                 },
//                 {
//                     "name": "Indian",
//                     "image": "indian-food.jpg"
//                 },
//                 {
//                     "name": "Spanish",
//                     "image": "spanish-food.jpg"
//                 }
//             ]
//         );
//     } catch (error) {
//         console.log('err', + error)
//     }
// }

// insertDummyCategoryData();

// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany(
            // {
            //     "name": "Silky squash risotto",
            //     "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
            //     "email": "powellhabwe@gmail.com",
            //     "ingredients": [
            //         "1 butternut or acorn squash , (1.2kg)",
            //         "1 bunch of fresh marjoram , (20g)",
            //         " olive oil",
            //         "1.2 litres quality vegetable or chicken stock",
            //         "1 onion",
            //         "1 stick of celery",
            //         " 150 ml dry white wine",
            //         " 200 g Tenderstem broccoli",
            //         " ½ a lemon",
            //         " 50 g Parmesan cheese,"
            //     ],
            //     "category": "American",
            //     "image": "stir-fried-vegetables.jpg"

            // },
            // {
            //     "name": "Silky squash risotto",
            //     "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
            //     "email": "powellhabwe@gmail.com",
            //     "ingredients": [
            //         "1 butternut or acorn squash , (1.2kg)",
            //         "1 bunch of fresh marjoram , (20g)",
            //         " olive oil",
            //         "1.2 litres quality vegetable or chicken stock",
            //         "1 onion",
            //         "1 stick of celery",
            //         " 150 ml dry white wine",
            //         " 200 g Tenderstem broccoli",
            //         " ½ a lemon",
            //         " 50 g Parmesan cheese,"
            //     ],
            //     "category": "Thai",
            //     "image": "stir-fried-vegetables.jpg"

            // },
            // {
            //     "name": "Silky squash risotto",
            //     "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
            //     "email": "powellhabwe@gmail.com",
            //     "ingredients": [
            //         "1 butternut or acorn squash , (1.2kg)",
            //         "1 bunch of fresh marjoram , (20g)",
            //         " olive oil",
            //         "1.2 litres quality vegetable or chicken stock",
            //         "1 onion",
            //         "1 stick of celery",
            //         " 150 ml dry white wine",
            //         " 200 g Tenderstem broccoli",
            //         " ½ a lemon",
            //         " 50 g Parmesan cheese,"
            //     ],
            //     "category": "Mexican",
            //     "image": "stir-fried-vegetables.jpg"

            // },
            // {
            //     "name": "Silky squash risotto",
            //     "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
            //     "email": "powellhabwe@gmail.com",
            //     "ingredients": [
            //         "1 butternut or acorn squash , (1.2kg)",
            //         "1 bunch of fresh marjoram , (20g)",
            //         " olive oil",
            //         "1.2 litres quality vegetable or chicken stock",
            //         "1 onion",
            //         "1 stick of celery",
            //         " 150 ml dry white wine",
            //         " 200 g Tenderstem broccoli",
            //         " ½ a lemon",
            //         " 50 g Parmesan cheese,"
            //     ],
            //     "category": "Indian",
            //     "image": "stir-fried-vegetables.jpg"

            // },
            // {
            //     "name": "Silky squash risotto",
            //     "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
            //     "email": "powellhabwe@gmail.com",
            //     "ingredients": [
            //         "1 butternut or acorn squash , (1.2kg)",
            //         "1 bunch of fresh marjoram , (20g)",
            //         " olive oil",
            //         "1.2 litres quality vegetable or chicken stock",
            //         "1 onion",
            //         "1 stick of celery",
            //         " 150 ml dry white wine",
            //         " 200 g Tenderstem broccoli",
            //         " ½ a lemon",
            //         " 50 g Parmesan cheese,"
            //     ],
            //     "category": "Chinese",
            //     "image": "stir-fried-vegetables.jpg"

            // },
//             {
//                 "name": "thai1",
//                 "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
//                 "email": "powellhabwe@gmail.com",
//                 "ingredients": [
//                     "1 butternut or acorn squash , (1.2kg)",
//                     "1 bunch of fresh marjoram , (20g)",
//                     " olive oil",
//                     "1.2 litres quality vegetable or chicken stock",
//                     "1 onion",
//                     "1 stick of celery",
//                     " 150 ml dry white wine",
//                     " 200 g Tenderstem broccoli",
//                     " ½ a lemon",
//                     " 50 g Parmesan cheese,"
//                 ],
//                 "category": "Thai",
//                 "image": "thai1.jpg"

//             },

//             {
//                 "name": "Thai2",
//                 "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
//                 "email": "powellhabwe@gmail.com",
//                 "ingredients": [
//                     "1 butternut or acorn squash , (1.2kg)",
//                     "1 bunch of fresh marjoram , (20g)",
//                     " olive oil",
//                     "1.2 litres quality vegetable or chicken stock",
//                     "1 onion",
//                     "1 stick of celery",
//                     " 150 ml dry white wine",
//                     " 200 g Tenderstem broccoli",
//                     " ½ a lemon",
//                     " 50 g Parmesan cheese,"
//                 ],
//                 "category": "Thai",
//                 "image": "thai2.jpg"

//             },
//             {
//                 "name": "thai3",
//                 "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
//                 "email": "powellhabwe@gmail.com",
//                 "ingredients": [
//                     "1 butternut or acorn squash , (1.2kg)",
//                     "1 bunch of fresh marjoram , (20g)",
//                     " olive oil",
//                     "1.2 litres quality vegetable or chicken stock",
//                     "1 onion",
//                     "1 stick of celery",
//                     " 150 ml dry white wine",
//                     " 200 g Tenderstem broccoli",
//                     " ½ a lemon",
//                     " 50 g Parmesan cheese,"
//                 ],
//                 "category": "Thai",
//                 "image": "thai3.jpg"

//             },
//             {
//                 "name": "Thai4",
//                 "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
//                 "email": "powellhabwe@gmail.com",
//                 "ingredients": [
//                     "1 butternut or acorn squash , (1.2kg)",
//                     "1 bunch of fresh marjoram , (20g)",
//                     " olive oil",
//                     "1.2 litres quality vegetable or chicken stock",
//                     "1 onion",
//                     "1 stick of celery",
//                     " 150 ml dry white wine",
//                     " 200 g Tenderstem broccoli",
//                     " ½ a lemon",
//                     " 50 g Parmesan cheese,"
//                 ],
//                 "category": "Thai",
//                 "image": "thai4.jpg"

//             },
//             {
//                 "name": "Silky squash risotto",
//                 "description": "Slow-roasted sweet squash, aromatic marjoram and nutty Parmesan come together to create this oozy, cheesy, sumptuous risotto that’s packed with glorious flavour. Source: https://www.jamieoliver.com/recipes/rice-recipes/silky-squash-risotto/",
//                 "email": "powellhabwe@gmail.com",
//                 "ingredients": [
//                     "1 butternut or acorn squash , (1.2kg)",
//                     "1 bunch of fresh marjoram , (20g)",
//                     " olive oil",
//                     "1.2 litres quality vegetable or chicken stock",
//                     "1 onion",
//                     "1 stick of celery",
//                     " 150 ml dry white wine",
//                     " 200 g Tenderstem broccoli",
//                     " ½ a lemon",
//                     " 50 g Parmesan cheese,"
//                 ],
//                 "category": "Thai",
//                 "image": "stir-fried-vegetables.jpg"

//             },






//         );
//     } catch (error) {
//         console.log('err', + error)
//     }
// }

// insertDummyRecipeData();

// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany(

 
//         );
//     } catch (error) {
//         console.log('err', + error)
//     }
// }

// insertDummyRecipeData();