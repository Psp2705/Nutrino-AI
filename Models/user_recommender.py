from firebase_setup import db
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserBasedRecommender:
    def __init__(self):
        self.users_data = {}
        self.recipe_ratings = defaultdict(dict)  # {user_id: {recipe_id: rating}}
        self.user_recipe_history = defaultdict(list)  # {user_id: [recipe_ids]}
        self.load_data()

    def load_data(self):
        """Load user data and ratings from database"""
        try:
            # Load users
            users_ref = db.collection("users").stream()
            for user_doc in users_ref:
                user_data = user_doc.to_dict()
                self.users_data[user_doc.id] = user_data
                
                # Process user history and ratings
                for history_item in user_data.get('history', []):
                    recipe_id = history_item.get('recipe_id')
                    if recipe_id:
                        self.user_recipe_history[user_doc.id].append(recipe_id)
                        rating = history_item.get('rating')
                        if rating is not None:  # Only store non-None ratings
                            self.recipe_ratings[user_doc.id][recipe_id] = float(rating)
            
            logger.info(f"Loaded data for {len(self.users_data)} users")
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")

    def calculate_user_similarity(self, user_id1, user_id2):
        """Calculate similarity between two users based on ratings and preferences"""
        # Get common rated recipes
        common_recipes = set(self.recipe_ratings[user_id1].keys()) & set(self.recipe_ratings[user_id2].keys())
        
        if not common_recipes:
            return 0.0
        
        try:
            # Ratings similarity
            ratings_1 = [self.recipe_ratings[user_id1][r] for r in common_recipes]
            ratings_2 = [self.recipe_ratings[user_id2][r] for r in common_recipes]
            rating_similarity = cosine_similarity([ratings_1], [ratings_2])[0][0]
        except Exception as e:
            logger.warning(f"Error calculating rating similarity: {str(e)}")
            rating_similarity = 0.0
        
        # Preference similarity
        user1_prefs = set(self.users_data[user_id1].get('preferences', []))
        user2_prefs = set(self.users_data[user_id2].get('preferences', []))
        pref_similarity = len(user1_prefs & user2_prefs) / max(len(user1_prefs | user2_prefs), 1)
        
        # Weight the similarities (can be adjusted)
        return 0.7 * rating_similarity + 0.3 * pref_similarity

    def find_similar_users(self, user_id, n=5):
        """Find n most similar users to the given user"""
        similarities = []
        for other_user_id in self.users_data:
            if other_user_id != user_id:
                similarity = self.calculate_user_similarity(user_id, other_user_id)
                similarities.append((other_user_id, similarity))
        
        # Sort by similarity and return top n
        return sorted(similarities, key=lambda x: x[1], reverse=True)[:n]

    def get_user_preferences(self, user_id):
        """Get user preferences including derived preferences from history"""
        user_data = self.users_data.get(user_id, {})
        explicit_prefs = set(user_data.get('preferences', []))
        
        # Analyze user history for implicit preferences
        implicit_prefs = set()
        history = user_data.get('history', [])
        
        # Look at highly rated recipes
        for item in history:
            rating = item.get('rating')
            if rating is not None and float(rating) >= 4:  # High rating threshold
                recipe_tags = item.get('tags', [])
                implicit_prefs.update(recipe_tags)
        
        return explicit_prefs | implicit_prefs

    def calculate_recipe_score(self, recipe, user_id):
        """Calculate a score for a recipe based on user preferences and history"""
        user_data = self.users_data.get(user_id, {})
        score = 0.0
        
        # Rating-based score
        if recipe['recipe_id'] in self.recipe_ratings[user_id]:
            user_rating = self.recipe_ratings[user_id][recipe['recipe_id']]
            if user_rating is not None:
                score += 0.3 * float(user_rating) / 5.0
        
        # Preference matching
        user_prefs = self.get_user_preferences(user_id)
        recipe_tags = set(recipe.get('tags', []))
        pref_match = len(user_prefs & recipe_tags) / max(len(user_prefs), 1)
        score += 0.3 * pref_match
        
        # Novelty factor (prefer recipes not recently tried)
        history = self.user_recipe_history[user_id]
        if recipe['recipe_id'] not in history:
            score += 0.2  # Boost for new recipes
        else:
            # Check how long ago it was tried
            last_time = None
            for hist_item in user_data.get('history', []):
                if hist_item['recipe_id'] == recipe['recipe_id']:
                    try:
                        last_time = datetime.fromisoformat(hist_item['timestamp'])
                    except (ValueError, TypeError):
                        continue
                    break
            
            if last_time:
                days_since = (datetime.now() - last_time).days
                if days_since > 30:  # If more than a month ago
                    score += 0.1
        
        # Popularity among similar users
        similar_users = self.find_similar_users(user_id, n=3)
        similar_ratings = []
        for similar_user_id, _ in similar_users:
            if recipe['recipe_id'] in self.recipe_ratings[similar_user_id]:
                rating = self.recipe_ratings[similar_user_id][recipe['recipe_id']]
                if rating is not None:
                    similar_ratings.append(float(rating))
        
        if similar_ratings:
            score += 0.2 * (sum(similar_ratings) / len(similar_ratings)) / 5.0
            
        return score

    def recommend(self, user_id, n=5):
        """Generate recommendations for a user"""
        try:
            # Get all recipes
            recipes_ref = db.collection("recipes").stream()
            recipes = [{**doc.to_dict(), 'recipe_id': doc.id} for doc in recipes_ref]
            
            # Calculate scores for each recipe
            scored_recipes = []
            for recipe in recipes:
                score = self.calculate_recipe_score(recipe, user_id)
                scored_recipes.append((recipe, score))
            
            # Sort by score and return top n
            recommendations = sorted(scored_recipes, key=lambda x: x[1], reverse=True)[:n]
            
            # Format recommendations
            result = []
            for recipe, score in recommendations:
                rec = {
                    'recipe_id': recipe['recipe_id'],
                    'title': recipe.get('title', 'Untitled Recipe'),
                    'ingredients': recipe.get('ingredients', []),
                    'tags': recipe.get('tags', []),
                    'nutrition': recipe.get('nutrition', {}),
                    'recommendation_score': score,
                    'reason': self._generate_recommendation_reason(recipe, user_id, score)
                }
                result.append(rec)
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return []

    def _generate_recommendation_reason(self, recipe, user_id, score):
        """Generate a human-readable reason for the recommendation"""
        reasons = []
        
        # Check if user has rated this recipe before
        if recipe['recipe_id'] in self.recipe_ratings[user_id]:
            rating = self.recipe_ratings[user_id][recipe['recipe_id']]
            if rating is not None and float(rating) >= 4:
                reasons.append("You've highly rated similar recipes")
        
        # Check preference matching
        user_prefs = self.get_user_preferences(user_id)
        matching_prefs = user_prefs & set(recipe.get('tags', []))
        if matching_prefs:
            reasons.append(f"Matches your preferences: {', '.join(matching_prefs)}")
        
        # Check similar users
        similar_users = self.find_similar_users(user_id, n=3)
        similar_ratings = []
        for similar_user_id, _ in similar_users:
            if recipe['recipe_id'] in self.recipe_ratings[similar_user_id]:
                rating = self.recipe_ratings[similar_user_id][recipe['recipe_id']]
                if rating is not None and float(rating) >= 4:
                    similar_ratings.append(rating)
        
        if similar_ratings:
            reasons.append("Popular among users with similar tastes")
        
        # If it's a new recipe
        if recipe['recipe_id'] not in self.user_recipe_history[user_id]:
            reasons.append("New recipe you haven't tried before")
        
        return " • ".join(reasons) if reasons else "Based on your profile"

    def update_user_rating(self, user_id: str, recipe_id: str, rating: float) -> bool:
        """Update a user's rating for a recipe."""
        try:
            # Get user document
            user_ref = db.collection('users').document(user_id)
            user_doc = user_ref.get()
            
            # If user doesn't exist, create a new document
            if not user_doc.exists:
                user_ref.set({
                    'preferences': [],
                    'history': []
                })
                user_doc = user_ref.get()

            # Get current history
            user_data = user_doc.to_dict()
            history = user_data.get('history', [])
            
            # Update rating in history if recipe exists
            rating_updated = False
            for hist_item in history:
                if hist_item.get('recipe_id') == recipe_id:
                    hist_item['rating'] = float(rating)
                    hist_item['timestamp'] = datetime.now().isoformat()
                    rating_updated = True
                    break
            
            # If recipe not found in history, append new entry
            if not rating_updated:
                history.append({
                    'recipe_id': recipe_id,
                    'rating': float(rating),
                    'timestamp': datetime.now().isoformat()
                })
            
            # Update user document
            user_ref.update({'history': history})
            
            # Update local data structure
            if user_id not in self.recipe_ratings:
                self.recipe_ratings[user_id] = {}
            self.recipe_ratings[user_id][recipe_id] = float(rating)
            
            logger.info(f"Updated rating for user {user_id}, recipe {recipe_id}: {rating}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating rating: {str(e)}")
            return False 