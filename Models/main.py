from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from recommender import RecipeRecommender
from user_recommender import UserBasedRecommender
from firebase_setup import verify_token, db
from typing import Union, List
import logging
import time
import asyncio
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommenders
user_recommender = UserBasedRecommender()

# Unified request model
class RecommendationRequest(BaseModel):
    action: str  # e.g., "recommend", "get_user_recommendations", "update_rating"
    ingredients: Union[List[str], None] = None
    height_cm: Union[float, None] = None
    weight_kg: Union[float, None] = None
    activity_level: Union[float, None] = None
    recipe_id: Union[str, None] = None
    rating: Union[float, None] = None
    limit: Union[int, None] = 5

# Helper async functions (reused from original)
async def get_ingredient_recommendations(recommender, ingredients):
    return recommender.recommend(ingredients)

async def get_user_recommendations(recommender, user_id, limit):
    return recommender.recommend(user_id, n=limit)

async def get_user_preferences(recommender, user_id):
    return recommender.get_user_preferences(user_id)

async def get_similar_users(recommender, user_id, limit):
    return recommender.find_similar_users(user_id, n=limit)

# Unified endpoint
@app.post("/api/v1/recommendation")
async def unified_recommendation_endpoint(
    request: RecommendationRequest,
    authorization: str = Header(...)
):
    start_time = time.time()
    
    try:
        # Token verification
        token = authorization.replace("Bearer ", "")
        logger.info("Verifying token...")
        user_id = verify_token(token)
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        logger.info(f"Token verified for user: {user_id}")

        # Handle different actions
        response_data = {}
        action = request.action.lower()

        if action == "recommend":
            if not request.ingredients:
                raise HTTPException(status_code=400, detail="Ingredients required for recommend action")
            ingredient_recommender = RecipeRecommender(user_id)
            user_based_recipes = await asyncio.wait_for(
                get_user_recommendations(user_recommender, user_id, request.limit),
                timeout=10.0
            )
            ingredient_based_recipes = await asyncio.wait_for(
                get_ingredient_recommendations(ingredient_recommender, request.ingredients),
                timeout=10.0
            )
            combined_recipes = []
            seen_recipes = set()
            for recipe in ingredient_based_recipes:
                if recipe.get('recipe_id') not in seen_recipes:
                    recipe['score'] = 0.7
                    recipe['recommendation_source'] = 'ingredient_based'
                    combined_recipes.append(recipe)
                    seen_recipes.add(recipe.get('recipe_id'))
            for recipe in user_based_recipes:
                if recipe.get('recipe_id') not in seen_recipes:
                    recipe['score'] = 0.5
                    recipe['recommendation_source'] = 'user_based'
                    combined_recipes.append(recipe)
                    seen_recipes.add(recipe.get('recipe_id'))
            ranked_recipes = sorted(combined_recipes, key=lambda x: x.get('score', 0), reverse=True)[:request.limit]
            response_data = {"recipes": ranked_recipes}

        elif action == "get_user_recommendations":
            recommendations = await asyncio.wait_for(
                get_user_recommendations(user_recommender, user_id, request.limit),
                timeout=10.0
            )
            response_data = {"recommendations": recommendations}

        elif action == "update_rating":
            if not request.recipe_id or request.rating is None:
                raise HTTPException(status_code=400, detail="recipe_id and rating required")
            success = user_recommender.update_user_rating(
                user_id=user_id,
                recipe_id=request.recipe_id,
                rating=request.rating
            )
            if not success:
                raise HTTPException(status_code=500, detail="Failed to update rating")
            response_data = {"message": "Rating updated successfully"}

        elif action == "get_preferences":
            preferences = await asyncio.wait_for(
                get_user_preferences(user_recommender, user_id),
                timeout=5.0
            )
            response_data = {"preferences": list(preferences)}

        elif action == "get_similar_users":
            similar_users = await asyncio.wait_for(
                get_similar_users(user_recommender, user_id, request.limit),
                timeout=5.0
            )
            response_data = {"similar_users": similar_users}

        else:
            raise HTTPException(status_code=400, detail="Invalid action specified")

        # Calculate processing time
        processing_time = time.time() - start_time
        logger.info(f"Request completed in {processing_time:.2f} seconds")

        # Return unified response
        return {
            "status": "success",
            "data": response_data,
            "metadata": {
                "processing_time": f"{processing_time:.2f} seconds",
                "user_id": user_id
            }
        }

    except asyncio.TimeoutError:
        logger.error(f"{request.action} timed out")
        raise HTTPException(status_code=500, detail=f"{request.action} operation timed out")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# from fastapi import FastAPI, HTTPException, Header
# from pydantic import BaseModel
# from recommender import RecipeRecommender
# from firebase_setup import verify_token

# app = FastAPI()

# # Pydantic model for request validation
# class RecipeRequest(BaseModel):
#     ingredients: list[str]

# @app.post("/recommend/")
# async def recommend_recipe(request: RecipeRequest, authorization: str = Header(...)):
#     try:
#         user_id = verify_token(authorization.replace("Bearer ", ""))
#         recommender = RecipeRecommender(user_id)
#         recipes = recommender.recommend(request.ingredients)
#         return {"status": "success", "recipes": recipes}
#     except Exception as e:
#         raise HTTPException(status_code=401 if "token" in str(e) else 500, detail=str(e))

# from fastapi import FastAPI, HTTPException, Header
# from pydantic import BaseModel
# from recommender import RecipeRecommender
# from user_recommender import UserBasedRecommender
# from firebase_setup import verify_token, db
# from typing import Union, List
# import logging
# import time
# import asyncio
# from fastapi.middleware.cors import CORSMiddleware

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize recommender once
# user_recommender = UserBasedRecommender()

# class RecipeRequest(BaseModel):
#     ingredients: List[str]
#     height_cm: Union[float, None] = None
#     weight_kg: Union[float, None] = None
#     activity_level: Union[float, None] = None

# class Rating(BaseModel):
#     recipe_id: str
#     rating: float

# @app.post("/recommend/")
# async def hybrid_recommend(request: RecipeRequest, authorization: str = Header(...)):
#     """
#     Hybrid recommendation endpoint that combines ingredient-based and user-based recommendations
#     """
#     start_time = time.time()
    
#     try:
#         # 1. Token verification with timeout
#         try:
#             token = authorization.replace("Bearer ", "")
#             logger.info("Verifying token...")
#             user_id = verify_token(token)
#             if not user_id:
#                 raise HTTPException(status_code=401, detail="Invalid token")
#             logger.info(f"Token verified for user: {user_id}")
#         except Exception as e:
#             logger.error(f"Token verification failed: {str(e)}")
#             raise HTTPException(status_code=401, detail="Invalid authentication token")

#         # 2. Quick validation of ingredients
#         if not request.ingredients:
#             raise HTTPException(status_code=400, detail="No ingredients provided")
        
#         # 3. Get ingredient-based recommendations with timeout
#         try:
#             logger.info("Getting ingredient-based recommendations...")
#             ingredient_recommender = RecipeRecommender(user_id)
#             # Set a timeout for ingredient recommendations
#             ingredient_based_recipes = await asyncio.wait_for(
#                 asyncio.create_task(get_ingredient_recommendations(ingredient_recommender, request.ingredients)),
#                 timeout=10.0  # 10 seconds timeout
#             )
#             logger.info(f"Found {len(ingredient_based_recipes)} ingredient-based recipes")
#         except asyncio.TimeoutError:
#             logger.error("Ingredient recommendations timed out")
#             ingredient_based_recipes = []
#         except Exception as e:
#             logger.error(f"Error getting ingredient recommendations: {str(e)}")
#             ingredient_based_recipes = []

#         # 4. Get user-based recommendations with timeout
#         try:
#             logger.info("Getting user-based recommendations...")
#             # Set a timeout for user recommendations
#             user_based_recipes = await asyncio.wait_for(
#                 asyncio.create_task(get_user_recommendations(user_recommender, user_id)),
#                 timeout=10.0  # 10 seconds timeout
#             )
#             logger.info(f"Found {len(user_based_recipes)} user-based recipes")
#         except asyncio.TimeoutError:
#             logger.error("User recommendations timed out")
#             user_based_recipes = []
#         except Exception as e:
#             logger.error(f"Error getting user recommendations: {str(e)}")
#             user_based_recipes = []

#         # If both recommendation types failed, return error
#         if not ingredient_based_recipes and not user_based_recipes:
#             raise HTTPException(status_code=500, detail="Failed to get recommendations")

#         # 5. Combine recommendations efficiently
#         combined_recipes = []
#         seen_recipes = set()
        
#         # Get user preferences (with timeout)
#         try:
#             user_prefs = await asyncio.wait_for(
#                 asyncio.create_task(get_user_preferences(user_recommender, user_id)),
#                 timeout=5.0
#             )
#         except:
#             user_prefs = set()

#         # Process ingredient-based recommendations first (they're more relevant)
#         for recipe in ingredient_based_recipes:
#             if recipe.get('recipe_id') not in seen_recipes:
#                 recipe['score'] = 0.7  # Base score for ingredient matches
#                 recipe['recommendation_source'] = 'ingredient_based'
#                 combined_recipes.append(recipe)
#                 seen_recipes.add(recipe.get('recipe_id'))

#         # Then process user-based recommendations
#         for recipe in user_based_recipes:
#             if recipe.get('recipe_id') not in seen_recipes:
#                 recipe['score'] = 0.5  # Base score for user-based matches
#                 recipe['recommendation_source'] = 'user_based'
#                 combined_recipes.append(recipe)
#                 seen_recipes.add(recipe.get('recipe_id'))

#         # 6. Sort and return results
#         ranked_recipes = sorted(combined_recipes, key=lambda x: x.get('score', 0), reverse=True)[:10]
        
#         end_time = time.time()
#         processing_time = end_time - start_time
#         logger.info(f"Request completed in {processing_time:.2f} seconds")

#         # If request takes too long, log a warning
#         if processing_time > 5.0:
#             logger.warning(f"Request took longer than expected: {processing_time:.2f} seconds")

#         return {
#             "status": "success",
#             "recipes": ranked_recipes,
#             "metadata": {
#                 "user_preferences": list(user_prefs),
#                 "total_recipes_found": len(combined_recipes),
#                 "processing_time": f"{processing_time:.2f} seconds"
#             }
#         }
        
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# async def get_ingredient_recommendations(recommender, ingredients):
#     """Helper function to get ingredient-based recommendations"""
#     return recommender.recommend(ingredients)

# async def get_user_recommendations(recommender, user_id):
#     """Helper function to get user-based recommendations"""
#     return recommender.recommend(user_id, n=5)

# async def get_user_preferences(recommender, user_id):
#     """Helper function to get user preferences"""
#     return recommender.get_user_preferences(user_id)

# # User-based recommendation endpoints
# @app.get("/user-recommendations/")
# async def get_user_recommendations(limit: int = 5, authorization: str = Header(...)):
#     """Get personalized recipe recommendations for the authenticated user"""
#     try:
#         user_id = verify_token(authorization.replace("Bearer ", ""))
#         recommendations = user_recommender.recommend(user_id, n=limit)
#         return {"status": "success", "recommendations": recommendations}
#     except Exception as e:
#         raise HTTPException(status_code=401 if "token" in str(e) else 500, detail=str(e))

# @app.post("/user-ratings/")
# async def update_user_rating(rating_data: Rating, authorization: str = Header(...)):
#     """Update the authenticated user's rating for a recipe"""
#     try:
#         user_id = verify_token(authorization.replace("Bearer ", ""))
#         success = user_recommender.update_user_rating(
#             user_id=user_id,
#             recipe_id=rating_data.recipe_id,
#             rating=rating_data.rating
#         )
#         if not success:
#             raise HTTPException(status_code=500, detail="Failed to update rating")
#         return {"status": "success", "message": "Rating updated successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=401 if "token" in str(e) else 500, detail=str(e))

# @app.get("/user-preferences/")
# async def get_user_preferences(authorization: str = Header(...)):
#     """Get the authenticated user's preferences"""
#     try:
#         user_id = verify_token(authorization.replace("Bearer ", ""))
#         preferences = user_recommender.get_user_preferences(user_id)
#         return {"status": "success", "preferences": list(preferences)}
#     except Exception as e:
#         raise HTTPException(status_code=401 if "token" in str(e) else 500, detail=str(e))

# @app.get("/similar-users/")
# async def get_similar_users(limit: int = 5, authorization: str = Header(...)):
#     """Get users similar to the authenticated user"""
#     try:
#         user_id = verify_token(authorization.replace("Bearer ", ""))
#         similar_users = user_recommender.find_similar_users(user_id, n=limit)
#         return {"status": "success", "similar_users": similar_users}
#     except Exception as e:
#         raise HTTPException(status_code=401 if "token" in str(e) else 500, detail=str(e))