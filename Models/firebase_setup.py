# firebase_setup.py
import firebase_admin
from firebase_admin import credentials, firestore, auth
import random
import os

# Initialize Firebase
current_dir = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(current_dir, "serviceAccountKey.json")
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

def verify_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except Exception as e:
        raise Exception(f"Invalid token: {str(e)}")

def add_user(user_id, email, preferences, history):
    db.collection("users").document(user_id).set({
        "email": email,
        "preferences": preferences,
        "history": history
    })

def add_recipe(recipe_id, title, ingredients, tags, instructions, popularity=0):
    db.collection("recipes").document(recipe_id).set({
        "recipe_id": recipe_id,
        "title": title,
        "ingredients": ingredients,
        "tags": tags,
        "instructions": instructions,
        "popularity": popularity
    })

def populate_sample_data():
    # Sample Users
    users = [
        {
            "user_id": "user1",
            "email": "user1@example.com",
            "preferences": ["low-carb", "high-protein"],
            "history": [
                {"recipe_id": "recipe1", "title": "Chicken Stir-Fry", "ingredients": ["chicken", "broccoli"], "rating": 4, "timestamp": "2025-03-01"},
                {"recipe_id": "recipe2", "title": "Beef Stew", "ingredients": ["beef", "potato"], "rating": 5, "timestamp": "2025-03-10"}
            ]
        },
        {
            "user_id": "user2",
            "email": "user2@example.com",
            "preferences": ["vegetarian"],
            "history": []
        },
        {
            "user_id": "user3",
            "email": "user3@example.com",
            "preferences": ["gluten-free"],
            "history": [
                {"recipe_id": "recipe3", "title": "Veggie Quinoa Bowl", "ingredients": ["quinoa", "spinach"], "rating": 3, "timestamp": "2025-03-05"}
            ]
        }
    ]

    # Sample Recipes
    recipes = [
        {"recipe_id": "recipe1", "title": "Chicken Stir-Fry", "ingredients": ["chicken", "broccoli"], "tags": ["low-carb", "quick"], "instructions": "Cook chicken, add broccoli.", "popularity": 150},
        {"recipe_id": "recipe2", "title": "Beef Stew", "ingredients": ["beef", "potato", "carrot"], "tags": ["hearty"], "instructions": "Simmer beef with potato and carrot.", "popularity": 200},
        {"recipe_id": "recipe3", "title": "Veggie Quinoa Bowl", "ingredients": ["quinoa", "spinach", "carrot"], "tags": ["vegetarian", "healthy"], "instructions": "Cook quinoa, mix with spinach and carrot.", "popularity": 120}
    ]

    # Add more recipes for scale (e.g., 100 recipes)
    ingredients_list = ["chicken", "beef", "tofu", "rice", "quinoa", "broccoli", "spinach", "carrot", "potato", "tomato"]
    tags_list = ["low-carb", "high-protein", "vegetarian", "gluten-free", "quick", "hearty", "healthy"]
    for i in range(4, 101):  # Recipes 4 to 100
        random_ings = random.sample(ingredients_list, random.randint(2, 5))
        random_tags = random.sample(tags_list, random.randint(1, 3))
        recipes.append({
            "recipe_id": f"recipe{i}",
            "title": f"{random_ings[0].capitalize()} Dish {i}",
            "ingredients": random_ings,
            "tags": random_tags,
            "instructions": f"Cook {random_ings[0]}, mix with {', '.join(random_ings[1:])}.",
            "popularity": random.randint(10, 300)
        })

    
    # In firebase_setup.py or a separate script
    docs = db.collection("recipes").stream()
    for doc in docs:
        data = doc.to_dict()
        if "calories" not in data:
            data["calories"] = len(data["ingredients"]) * 150  # Rough estimate
            db.collection("recipes").document(doc.id).update({"calories": data["calories"]})

    # Insert into Firestore
    for user in users:
        add_user(user["user_id"], user["email"], user["preferences"], user["history"])
        print(f"Added user: {user['user_id']}")

    for recipe in recipes:
        add_recipe(recipe["recipe_id"], recipe["title"], recipe["ingredients"], recipe["tags"], recipe["instructions"], recipe["popularity"])
        print(f"Added recipe: {recipe['recipe_id']}")

if __name__ == "__main__":
    from firebase_admin import auth as admin_auth
    try:
        admin_auth.create_user(email="user1@example.com", password="test123", uid="user1")
        admin_auth.create_user(email="user2@example.com", password="test456", uid="user2")
    except:
        pass
    populate_sample_data()