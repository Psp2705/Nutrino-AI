import requests
import json
import webbrowser
import os
import time
from firebase_admin import credentials, auth, initialize_app

BASE_URL = "http://localhost:8081"
TIMEOUT = 30  # 30 seconds timeout for requests

def get_firebase_token():
    """Get a Firebase token for testing"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    token_file_path = os.path.join(current_dir, "get_token.html")
    webbrowser.open(f"file://{token_file_path}")
    
    print("\nPlease login in the browser window that just opened.")
    print("After logging in, copy the token and paste it here:")
    token = input().strip()
    return token if token else None

def test_recommend_action():
    token = get_firebase_token()
    if not token:
        print("Failed to get Firebase token")
        return
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "action": "recommend",
        "ingredients": ["chicken", "rice", "broccoli"],
        "height_cm": 170,
        "weight_kg": 70,
        "activity_level": 1.2,
        "limit": 5
    }
    
    try:
        print("\nTesting 'recommend' action...")
        print("Making request with data:", json.dumps(data, indent=2))
        response = requests.post(
            f"{BASE_URL}/api/v1/recommendation",
            headers=headers,
            json=data,
            timeout=TIMEOUT
        )
        
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.Timeout:
        print("Error: Request timed out after", TIMEOUT, "seconds")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
    except Exception as e:
        print(f"Error testing recommend action: {str(e)}")

def test_user_recommendations_action():
    token = get_firebase_token()
    if not token:
        print("Failed to get Firebase token")
        return
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "action": "get_user_recommendations",
        "limit": 3
    }
    
    try:
        print("\nTesting 'get_user_recommendations' action...")
        print("Making request with data:", json.dumps(data, indent=2))
        response = requests.post(
            f"{BASE_URL}/api/v1/recommendation",
            headers=headers,
            json=data,
            timeout=TIMEOUT
        )
        
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.Timeout:
        print("Error: Request timed out after", TIMEOUT, "seconds")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
    except Exception as e:
        print(f"Error testing user recommendations action: {str(e)}")

def test_update_rating_action():
    token = get_firebase_token()
    if not token:
        print("Failed to get Firebase token")
        return
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "action": "update_rating",
        "recipe_id": "recipe1",
        "rating": 4.5
    }
    
    try:
        print("\nTesting 'update_rating' action...")
        print("Making request with data:", json.dumps(data, indent=2))
        response = requests.post(
            f"{BASE_URL}/api/v1/recommendation",
            headers=headers,
            json=data,
            timeout=TIMEOUT
        )
        
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.Timeout:
        print("Error: Request timed out after", TIMEOUT, "seconds")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
    except Exception as e:
        print(f"Error testing update rating action: {str(e)}")

def test_user_preferences_action():
    token = get_firebase_token()
    if not token:
        print("Failed to get Firebase token")
        return
        
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "action": "get_preferences"
    }
    
    try:
        print("\nTesting 'get_preferences' action...")
        print("Making request with data:", json.dumps(data, indent=2))
        response = requests.post(
            f"{BASE_URL}/api/v1/recommendation",
            headers=headers,
            json=data,
            timeout=TIMEOUT
        )
        
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.Timeout:
        print("Error: Request timed out after", TIMEOUT, "seconds")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
    except Exception as e:
        print(f"Error testing user preferences action: {str(e)}")

def test_health_check():
    try:
        print("\nTesting /health endpoint...")
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
        exit(1)
    except Exception as e:
        print(f"Error testing health endpoint: {str(e)}")

if __name__ == "__main__":
    print("Testing Unified Nutrino AI API")
    print("=" * 50)
    
    # Check if server is running
    test_health_check()
    
    # Run all tests
    test_recommend_action()
    test_user_recommendations_action()
    test_update_rating_action()
    test_user_preferences_action()


# import requests
# import json
# import webbrowser
# import os
# import time
# from firebase_admin import credentials, auth, initialize_app

# BASE_URL = "http://localhost:8081"
# TIMEOUT = 30  # 30 seconds timeout for requests

# def get_firebase_token():
#     """Get a Firebase token for testing"""
#     # Open get_token.html in the default browser
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     token_file_path = os.path.join(current_dir, "get_token.html")
#     webbrowser.open(f"file://{token_file_path}")
    
#     # Ask user to input the token
#     print("\nPlease login in the browser window that just opened.")
#     print("After logging in, copy the token and paste it here:")
#     token = input().strip()
#     return token if token else None

# def test_recommend_endpoint():
#     token = get_firebase_token()
#     if not token:
#         print("Failed to get Firebase token")
#         return
        
#     headers = {
#         "Authorization": f"Bearer {token}",
#         "Content-Type": "application/json"
#     }
    
#     data = {
#         "ingredients": ["chicken", "rice", "broccoli"],
#         "height_cm": 170,
#         "weight_kg": 70,
#         "activity_level": 1.2
#     }
    
#     try:
#         print("\nTesting /recommend/ endpoint...")
#         print("Making request with data:", json.dumps(data, indent=2))
#         response = requests.post(
#             f"{BASE_URL}/recommend/",
#             headers=headers,
#             json=data,
#             timeout=TIMEOUT
#         )
        
#         print(f"Status Code: {response.status_code}")
#         print("Response:")
#         print(json.dumps(response.json(), indent=2))
#     except requests.exceptions.Timeout:
#         print("Error: Request timed out after", TIMEOUT, "seconds")
#     except requests.exceptions.ConnectionError:
#         print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
#     except Exception as e:
#         print(f"Error testing recommend endpoint: {str(e)}")

# def test_user_recommendations():
#     token = get_firebase_token()
#     if not token:
#         print("Failed to get Firebase token")
#         return
        
#     headers = {
#         "Authorization": f"Bearer {token}"
#     }
    
#     try:
#         print("\nTesting /user-recommendations/ endpoint...")
#         response = requests.get(
#             f"{BASE_URL}/user-recommendations/",
#             headers=headers,
#             timeout=TIMEOUT
#         )
        
#         print(f"Status Code: {response.status_code}")
#         print("Response:")
#         print(json.dumps(response.json(), indent=2))
#     except requests.exceptions.Timeout:
#         print("Error: Request timed out after", TIMEOUT, "seconds")
#     except requests.exceptions.ConnectionError:
#         print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
#     except Exception as e:
#         print(f"Error testing user recommendations endpoint: {str(e)}")

# def test_update_rating():
#     token = get_firebase_token()
#     if not token:
#         print("Failed to get Firebase token")
#         return
        
#     headers = {
#         "Authorization": f"Bearer {token}",
#         "Content-Type": "application/json"
#     }
    
#     data = {
#         "recipe_id": "recipe1",
#         "rating": 4.5
#     }
    
#     try:
#         print("\nTesting /user-ratings/ endpoint...")
#         print("Making request with data:", json.dumps(data, indent=2))
#         response = requests.post(
#             f"{BASE_URL}/user-ratings/",
#             headers=headers,
#             json=data,
#             timeout=TIMEOUT
#         )
        
#         print(f"Status Code: {response.status_code}")
#         print("Response:")
#         print(json.dumps(response.json(), indent=2))
#     except requests.exceptions.Timeout:
#         print("Error: Request timed out after", TIMEOUT, "seconds")
#     except requests.exceptions.ConnectionError:
#         print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
#     except Exception as e:
#         print(f"Error testing update rating endpoint: {str(e)}")

# def test_user_preferences():
#     token = get_firebase_token()
#     if not token:
#         print("Failed to get Firebase token")
#         return
        
#     headers = {
#         "Authorization": f"Bearer {token}"
#     }
    
#     try:
#         print("\nTesting /user-preferences/ endpoint...")
#         response = requests.get(
#             f"{BASE_URL}/user-preferences/",
#             headers=headers,
#             timeout=TIMEOUT
#         )
        
#         print(f"Status Code: {response.status_code}")
#         print("Response:")
#         print(json.dumps(response.json(), indent=2))
#     except requests.exceptions.Timeout:
#         print("Error: Request timed out after", TIMEOUT, "seconds")
#     except requests.exceptions.ConnectionError:
#         print("Error: Could not connect to the server. Make sure it's running on", BASE_URL)
#     except Exception as e:
#         print(f"Error testing user preferences endpoint: {str(e)}")

# if __name__ == "__main__":
#     print("Testing Nutrino AI API Endpoints")
#     print("=" * 50)
    
#     # First make sure the server is running
#     try:
#         print("\nChecking if server is running...")
#         requests.get(f"{BASE_URL}/", timeout=5)
#         print("Server is running!")
#     except requests.exceptions.ConnectionError:
#         print("\nError: Could not connect to the server.")
#         print("Make sure the server is running on", BASE_URL)
#         print("Run 'uvicorn main:app --reload' in the Models directory")
#         exit(1)
#     except Exception as e:
#         print(f"\nUnexpected error checking server: {str(e)}")
#         exit(1)
    
#     # Run all tests
#     test_recommend_endpoint()
#     test_user_recommendations()
#     test_update_rating()
#     test_user_preferences() 