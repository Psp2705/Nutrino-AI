from firebase_setup import db
docs = db.collection("recipes").stream()
for doc in docs:
    data = doc.to_dict()
    if "calories" not in data:
        data["calories"] = len(data["ingredients"]) * 150
        db.collection("recipes").document(doc.id).update({"calories": data["calories"]})
        print(f"Updated {doc.id} with calories={data['calories']}")