import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import Flask, jsonify, request
from flask_cors import CORS
from pyngrok import ngrok

# Initialize the Flask app and Firebase Admin SDK
app = Flask(__name__)
CORS(app)

# Create credentials from JSON certificate keyfile
cred = credentials.Certificate("backend/watchwhat-2190512-firebase-adminsdk-fbsvc-257ed06cff.json")
# Initializes new App instance
firebase_admin.initialize_app(cred)

# Get database client for interacting with Google Cloud Firestore API
db = firestore.client()
movies_series_collection = db.collection("movies_series")

def verify_id_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return None

def add_movies_series(name, genre, status, token):
    userId = token['uid']
    doc_ref = movies_series_collection.document(userId)
    doc_ref.set({
        "name": name,
        "genre": genre,
        "status": status
    })
    
@app.route('/add_movie', methods=['POST'])
def add_movie():
    data = request.json
    id_token = data.get('id_token')
    name = data.get('name')
    genre = data.get('genre')
    status = data.get('status')

    # Verify the ID token
    decoded_token = verify_id_token(id_token)
    if not decoded_token:
        return jsonify({"message": "Invalid or expired ID token"}), 401

    # If token is valid, add the movie
    add_movies_series(name, genre, status, decoded_token)
    return jsonify({"message": "Movie added successfully"}), 200

# Start Flask app with ngrok tunnel
if __name__ == '__main__':
    public_url = ngrok.connect(5000)
    print(f" * ngrok tunnel \"{public_url}\" -> http://127.0.0.1:5000")
    
    with open("backend/.env", "w") as f:
        f.write(f"NGROK_URL={public_url}\n")
        
    app.run(port=5000)