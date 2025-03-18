from recommender import RecipeRecommender
import logging
from config import LOG_LEVEL, LOG_FORMAT
import json

# Configure logging
logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
logger = logging.getLogger(__name__)

def test_recipe_recommendation():
    # Test user ID (replace with actual user ID from your system)
    user_id = "test_user_1"
    
    # Initialize recommender
    recommender = RecipeRecommender(user_id)
    
    # Test cases
    test_cases = [
        {
            "ingredients": ["chicken", "broccoli", "rice"],
            "description": "Basic healthy meal"
        },
        {
            "ingredients": ["salmon", "quinoa", "asparagus"],
            "description": "High-protein low-carb meal"
        },
        {
            "ingredients": ["tofu", "vegetables", "noodles"],
            "description": "Vegetarian option"
        }
    ]
    
    for case in test_cases:
        logger.info(f"\nTesting recommendation for {case['description']}")
        logger.info(f"Ingredients: {case['ingredients']}")
        
        try:
            # Get recommendations
            recommendations = recommender.recommend(case['ingredients'])
            
            # Print results
            logger.info(f"Found {len(recommendations)} recommendations:")
            for i, recipe in enumerate(recommendations, 1):
                logger.info(f"\nRecipe {i}:")
                logger.info(f"Title: {recipe['title']}")
                logger.info(f"Ingredients: {', '.join(recipe['ingredients'])}")
                logger.info(f"Calories: {recipe.get('nutrition', {}).get('calories', 'N/A')}")
                logger.info(f"Tags: {', '.join(recipe.get('tags', []))}")
                
        except Exception as e:
            logger.error(f"Error testing {case['description']}: {str(e)}")

if __name__ == "__main__":
    test_recipe_recommendation() 

    