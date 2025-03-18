import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# OpenAI API Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Recipe Generation Settings
DEFAULT_RECIPE_COUNT = 5
MINIMUM_INGREDIENT_MATCH = 0.7  # Minimum ingredient similarity score
CALORIE_TOLERANCE = 200  # Acceptable calorie difference +/-

# Logging Configuration
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Firebase Collection Names
USERS_COLLECTION = "users"
RECIPES_COLLECTION = "recipes" 