from user_recommender import UserBasedRecommender
import logging
from pprint import pprint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_user_recommendations():
    # Initialize the recommender
    recommender = UserBasedRecommender()
    
    # Test users (you should replace these with actual user IDs from your database)
    test_users = ["test_user_1", "test_user_2"]
    
    for user_id in test_users:
        logger.info(f"\nTesting recommendations for user: {user_id}")
        
        # Get user preferences
        preferences = recommender.get_user_preferences(user_id)
        logger.info(f"User preferences: {preferences}")
        
        # Find similar users
        similar_users = recommender.find_similar_users(user_id)
        logger.info("\nSimilar users:")
        for similar_user_id, similarity in similar_users:
            logger.info(f"User: {similar_user_id}, Similarity: {similarity:.2f}")
        
        # Get recommendations
        recommendations = recommender.recommend(user_id, n=5)
        
        logger.info("\nTop 5 Recommended Recipes:")
        for i, rec in enumerate(recommendations, 1):
            logger.info(f"\nRecommendation {i}:")
            logger.info(f"Title: {rec['title']}")
            logger.info(f"Score: {rec['recommendation_score']:.2f}")
            logger.info(f"Reason: {rec['reason']}")
            logger.info(f"Tags: {', '.join(rec['tags'])}")
            logger.info(f"Ingredients: {', '.join(rec['ingredients'])}")
            
        # Test rating update
        if recommendations:
            # Test updating a rating for the first recommended recipe
            recipe_id = recommendations[0]['recipe_id']
            logger.info(f"\nTesting rating update for recipe {recipe_id}")
            success = recommender.update_user_rating(user_id, recipe_id, 5)
            logger.info(f"Rating update {'successful' if success else 'failed'}")

def main():
    try:
        test_user_recommendations()
    except Exception as e:
        logger.error(f"Error in test: {str(e)}")

if __name__ == "__main__":
    main() 