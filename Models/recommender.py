from firebase_setup import db
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import random
from datetime import datetime
import logging
import openai
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecipeRecommender:
    def __init__(self, user_id):
        self.user_id = user_id
        self.user_data = self.get_user_data()
        self.recipes = self.get_recipes()
        # Initialize OpenAI client (make sure to set OPENAI_API_KEY in environment)
        self.openai_client = openai.OpenAI()

    def get_user_data(self):
        doc = db.collection("users").document(self.user_id).get()
        data = doc.to_dict() if doc.exists else {
            "preferences": ["low-carb"],
            "history": [],
            "email": "",
            "height_cm": 170,
            "weight_kg": 70,
            "activity_level": "moderate",
            "age": 30,
            "gender": "not_specified"
        }
        logger.info(f"User data loaded: {json.dumps(data, indent=2)}")
        return data

    def get_recipes(self, limit=1000):
        docs = db.collection("recipes").limit(limit).stream()
        recipes = [{**doc.to_dict(), "recipe_id": doc.id} for doc in docs]
        logger.info(f"Loaded {len(recipes)} recipes from database")
        return recipes

    def calculate_bmi(self):
        height_m = self.user_data.get("height_cm", 170) / 100
        weight_kg = self.user_data.get("weight_kg", 70)
        bmi = weight_kg / (height_m ** 2)
        logger.info(f"Calculated BMI: {bmi:.1f}")
        return bmi

    def get_health_profile(self):
        bmi = self.calculate_bmi()
        if bmi < 18.5:
            return "underweight", ["high-protein", "high-calorie", "nutrient-dense"]
        elif bmi < 25:
            return "normal", ["balanced", "moderate", "healthy"]
        elif bmi < 30:
            return "overweight", ["low-carb", "low-calorie", "high-protein"]
        else:
            return "obese", ["low-carb", "low-calorie", "high-protein"]

    def estimate_calorie_needs(self):
        height = self.user_data.get("height_cm", 170)
        weight = self.user_data.get("weight_kg", 70)
        age = self.user_data.get("age", 30)
        gender = self.user_data.get("gender", "not_specified")
        activity = self.user_data.get("activity_level", "moderate")

        # Mifflin-St Jeor Equation
        if gender == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        elif gender == "female":
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        else:
            # Use average for unspecified gender
            bmr = 10 * weight + 6.25 * height - 5 * age - 78

        multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        
        daily_calories = bmr * multipliers.get(activity, 1.55)
        meal_calories = daily_calories / 3  # Divide by 3 for per-meal calories
        
        logger.info(f"Estimated daily calories: {daily_calories:.0f}, per meal: {meal_calories:.0f}")
        return meal_calories

    def generate_recipe_with_llm(self, ingredients, target_calories):
        health_status, health_tags = self.get_health_profile()
        
        prompt = f"""Create a healthy recipe with these requirements:
        - Main ingredients: {', '.join(ingredients)}
        - Target calories: {target_calories:.0f} kcal
        - Health profile: {health_status} (BMI-based)
        - Health tags: {', '.join(health_tags)}
        - User preferences: {', '.join(self.user_data['preferences'])}

        Format the response as JSON with these fields:
        {{
            "title": "Recipe name",
            "ingredients": ["list", "of", "ingredients", "with", "amounts"],
            "instructions": ["Step 1", "Step 2", ...],
            "nutrition": {{
                "calories": int,
                "protein": int,
                "carbs": int,
                "fat": int
            }},
            "tags": ["list", "of", "applicable", "tags"]
        }}"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            recipe_data = json.loads(response.choices[0].message.content)
            recipe_id = f"gen_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}"
            
            recipe = {
                "recipe_id": recipe_id,
                "title": recipe_data["title"],
                "ingredients": recipe_data["ingredients"],
                "instructions": recipe_data["instructions"],
                "nutrition": recipe_data["nutrition"],
                "tags": recipe_data["tags"] + health_tags,
                "generated": True,
                "timestamp": datetime.now().isoformat()
            }
            
            logger.info(f"Generated recipe: {json.dumps(recipe, indent=2)}")
            return recipe
            
        except Exception as e:
            logger.error(f"Error generating recipe with LLM: {str(e)}")
            return self.generate_fallback_recipe(ingredients, target_calories)

    def generate_fallback_recipe(self, ingredients, target_calories):
        """Fallback recipe generation when LLM fails"""
        logger.info("Using fallback recipe generation")
        health_status, health_tags = self.get_health_profile()
        
        protein_sources = ["chicken", "fish", "tofu", "eggs", "beans"]
        cooking_methods = ["baked", "grilled", "steamed", "stir-fried"]
        
        method = random.choice(cooking_methods)
        main_protein = next((ing for ing in ingredients if ing in protein_sources), random.choice(protein_sources))
        
        recipe = {
            "recipe_id": f"gen_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}",
            "title": f"{method.capitalize()} {main_protein.capitalize()} with {', '.join(ing for ing in ingredients if ing != main_protein)}",
            "ingredients": ingredients + ["olive oil", "salt", "pepper", "garlic"],
            "instructions": [
                f"1. Prepare {main_protein} and vegetables",
                f"2. {method.capitalize()} {main_protein} until cooked through",
                "3. Add remaining ingredients and cook until done",
                "4. Season to taste and serve"
            ],
            "nutrition": {
                "calories": target_calories,
                "protein": int(target_calories * 0.3 / 4),  # 30% protein
                "carbs": int(target_calories * 0.4 / 4),    # 40% carbs
                "fat": int(target_calories * 0.3 / 9)       # 30% fat
            },
            "tags": health_tags + [method, main_protein] + self.user_data["preferences"],
            "generated": True,
            "timestamp": datetime.now().isoformat()
        }
        
        return recipe

    def calculate_score(self, recipe, ingredients):
        # Vectorize ingredients for similarity calculation
        user_vec = self.vectorize_ingredients(ingredients)
        recipe_vec = self.vectorize_ingredients(recipe["ingredients"])
        ing_similarity = cosine_similarity([user_vec], [recipe_vec])[0][0]

        # Check for required ingredients
        missing_required = set(ingredients) - set(recipe["ingredients"])
        if missing_required:
            logger.info(f"Recipe {recipe['recipe_id']} missing required ingredients: {missing_required}")
            return 0  # Reject recipes missing required ingredients

        # Calculate preference match
        pref_match = sum(1 for p in self.user_data["preferences"] if p in recipe.get("tags", [])) / max(len(self.user_data["preferences"]), 1)

        # Calculate health score
        _, desired_health_tags = self.get_health_profile()
        health_match = sum(1 for tag in desired_health_tags if tag in recipe.get("tags", [])) / len(desired_health_tags)

        # Calculate calorie match
        target_calories = self.estimate_calorie_needs()
        recipe_calories = recipe.get("nutrition", {}).get("calories", target_calories)
        calorie_diff = abs(recipe_calories - target_calories)
        calorie_match = max(0, 1 - (calorie_diff / target_calories))

        # Weighted score calculation
        score = (
            0.4 * ing_similarity +    # Ingredient match
            0.2 * pref_match +        # User preferences
            0.2 * health_match +      # Health alignment
            0.2 * calorie_match       # Calorie target
        )

        logger.info(f"Score for {recipe['recipe_id']}: {score:.2f} "
                   f"(ing_sim={ing_similarity:.2f}, pref={pref_match:.2f}, "
                   f"health={health_match:.2f}, cal={calorie_match:.2f})")
        return score

    def recommend(self, ingredients, top_n=5):
        logger.info(f"Starting recommendation for ingredients: {ingredients}")
        target_calories = self.estimate_calorie_needs()
        
        # Get existing recipes
        scored_recipes = [(recipe, self.calculate_score(recipe, ingredients)) 
                         for recipe in self.recipes]
        valid_recipes = [(r, s) for r, s in scored_recipes if s > 0]
        
        # Sort by score and take top N-1 (leave room for generated recipe)
        sorted_recipes = sorted(valid_recipes, key=lambda x: x[1], reverse=True)
        top_recipes = [r[0] for r in sorted_recipes[:top_n-1]]
        
        logger.info(f"Found {len(top_recipes)} suitable existing recipes")
        
        # Generate a new recipe if we don't have enough matches
        if len(top_recipes) < top_n:
            generated = self.generate_recipe_with_llm(ingredients, target_calories)
            if generated:
                # Store the generated recipe
                db.collection("recipes").document(generated["recipe_id"]).set(generated)
                top_recipes.append(generated)
        
        # Update user history
        for recipe in top_recipes:
            history_entry = {
                "recipe_id": recipe["recipe_id"],
                "title": recipe["title"],
                "ingredients": recipe["ingredients"],
                "rating": None,  # To be updated after user feedback
                "timestamp": datetime.now().isoformat()
            }
            self.user_data["history"].append(history_entry)
        
        # Update user data in Firestore
        db.collection("users").document(self.user_id).set(self.user_data)
        
        logger.info(f"Returning {len(top_recipes)} recommendations")
        return top_recipes

    def vectorize_ingredients(self, ingredients):
        all_ings = set().union(*[set(r["ingredients"]) for r in self.recipes])
        return np.array([1 if ing in ingredients else 0 for ing in all_ings])