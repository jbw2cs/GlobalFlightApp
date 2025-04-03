from flask import Flask, redirect, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

# MONGODB CONNECTION
uri = "mongodb+srv://user:user@cluster0.uyab0n1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['WebApp']
users_collection = db['Accounts']

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

# Serve static files
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_url_path, path)


# Constants for encryption
N = 4  # Constant value for shifting characters
D = 1  # Direction multiplier

# Encryption function for password hashing
def encrypt(inputText, N, D):
    revText = inputText[::-1]  # Reverse

    encryptedText = ""
    for char in revText:
        ascii_value = ord(char)

        if ascii_value not in (32, 33):  # " " or "!"
            # Shift the character by N positions in the direction D
            new_ascii = ascii_value + (N * D)

            # Ensure the new ASCII is ok(34 to 126)
            if new_ascii > 126:
                new_ascii = 34 + (new_ascii - 127)
            elif new_ascii < 34:
                new_ascii = 126 - (33 - new_ascii)

            encryptedText += chr(new_ascii)
        else:
            encryptedText += char

    return encryptedText

@app.route('/sign_up', methods=['POST'])
def sign_up():

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or username.strip() == "":
        return jsonify({'status': 'error', 'message': 'Invalid Username: Cannot be empty'})
    if not password or password.strip() == "":
        return jsonify({'status': 'error', 'message': 'Invalid Username: Cannot be empty'})

    if users_collection.find_one({'username': username}):
        return jsonify({'status': 'error', 'message': 'Username already exists'})
    
    encrypted_password = encrypt(password, N, D)
    users_collection.insert_one({'username': username, 'password': encrypted_password})
    return jsonify({'status': 'success', 'message': 'User signed up successfully'})

@app.route('/sign_in', methods=['POST'])
def sign_in():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or username.strip() == "":
        return jsonify({'status': 'error', 'message': 'Invalid Username: Cannot be empty'})
    if not password or password.strip() == "":
        return jsonify({'status': 'error', 'message': 'Invalid Password: Cannot be empty'})

    encrypted_password = encrypt(password, N, D)
    print("Username: ", username)
    print("Password", password)
    user = users_collection.find_one({'username': username, 'password': encrypted_password})
    if user:
        return jsonify({'status': 'success', 'message': 'Signed in successfully'})
    else:
        return jsonify({'status': 'error', 'message': 'Incorrect username or password'})

if __name__ == '__main__':
    app.run(host='localhost', debug=True)

