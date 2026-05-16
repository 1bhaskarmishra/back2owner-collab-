from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
import numpy as np
import io, os, shutil
import psycopg2 
from PIL import Image
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": os.getenv("PG_HOST"),
    "database": os.getenv("PG_DATABASE"),
    "user": os.getenv("PG_USER"),
    "password": os.getenv("PG_PASSWORD"),
    "port": os.getenv("PG_PORT")
}
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

model = tf.keras.applications.MobileNetV2(weights='imagenet', include_top=False, pooling='avg')

def get_features(img_data):
    img = Image.open(io.BytesIO(img_data)).convert('RGB').resize((224, 224))
    x = np.array(img) / 255.0
    x = np.expand_dims(x, axis=0)
    features = model.predict(x)
    return features

@app.get("/")
def home():
    return {"status": "Back2Owner AI Live", "database": "Connected to Aiven Cloud"}

@app.post("/report-found")
async def report_found(name: str = Form(...), location: str = Form(...), file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("INSERT INTO items (name, location, image_path) VALUES (%s, %s, %s)", (name, location, file_path))
    conn.commit()
    cur.close()
    conn.close()
    
    return {"message": f"Success! {name} saved in Cloud Database."}

@app.post("/search-owner")
async def search_owner(file: UploadFile = File(...)):
    lost_img_data = await file.read()
    input_features = get_features(lost_img_data)
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT name, location, image_path FROM items")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    best_match = None
    highest_score = 0
    
    for name, loc, path in rows:
        if os.path.exists(path):
            with open(path, "rb") as f:
                db_feat = get_features(f.read())
                score = cosine_similarity(input_features, db_feat)[0][0]
                if score > highest_score:
                    highest_score = score
                    best_match = {"name": name, "location": loc, "match": f"{round(float(score)*100, 2)}%"}
    
    if highest_score > 0.70:
        return {"status": "Found a Match!", "details": best_match}
    return {"status": "No match found in database."}