from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from  ai.voice_service import transcribe_speech, generate_speech

from ai.emb import load_model, load_data, query_system

import os
from dotenv import load_dotenv
from google import genai
import json
import base64

# ------------------------
# App
# ------------------------
app = FastAPI(
    title="DreamTrip API",
    root_path="/api"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")

app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")
app.mount("/api/images", StaticFiles(directory=IMAGES_DIR), name="api-images")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Models
# ------------------------
class RecommendRequest(BaseModel):
    query: str


# class Destination(BaseModel):
#     name: str
#     country: str
#     description: str
#     tags: List[str]
#     image: str

class Destination(BaseModel):
    city: str
    country: str
    iata: str
    key_features: List[str]
    score: float
    image: Optional[str] = None


class RecommendResponse(BaseModel):
    interpreted: List[str]
    results: List[Destination]


class AudioRecommendResponse(BaseModel):
    query: str
    interpreted: List[str]
    results: List[Destination]
    questions: List[str] = []
    requires_followup: bool = False
    session_sentences: List[str] = []
    tts_audio_base64: Optional[str] = None


# ------------------------
# Fake logic (replace later with AI)
# ------------------------
# def fake_ai(query: str):
#     model = load_model()

#     # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#     # json_path = os.path.join(BASE_DIR, "city_embeddings.json")
#     # npy_path = os.path.join(BASE_DIR, "city_embeddings.npy")

#     metadata, embeddings = load_data("ai/city_embeddings.json", "ai/city_embeddings.npy")
#     # interpreted = ["peaceful", "nature"]
#     # print(f"Type of Metadata in fake_ai is: {type(metadata)}")
#     # print(f"Metadata in main is: {metadata}")
#     user_query = query

#     # Load env
#     load_dotenv()
#     api_key = os.getenv("GOOGLE_API_KEY")

#     client = genai.Client(api_key=api_key)

#     # Load prompts
#     with open("ai/prompts.json", "r") as f:
#         prompts = json.load(f)

#     base_prompt = prompts["travel_intent_parser"]

#     # Combine prompt + user input
#     final_prompt = base_prompt + "\nUser: " + user_query

#     print(f"Final prompt sent to Gemini:\n{final_prompt}")

#     response = client.models.generate_content(
#         model="gemini-2.5-flash",
#         contents=final_prompt
#     )

#     output_text = response.text.strip()

#     # print("RAW OUTPUT:\n", output_text)
#     # print(f"type of output_text: {type(output_text)}")
#     output_text = json.loads(output_text)
#     print(f"Parsed output_text: {output_text}")
#     output_text = output_text["sentences"]

#     print(f"Interpreted sentences: {output_text}")

#     results = query_system(model, embeddings, metadata, output_text, k=5)

#     return results

def _safe_parse_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        return {}


def _normalize_sentences(items):
    if not isinstance(items, list):
        items = [items]

    normalized = []
    seen = set()
    for item in items:
        s = str(item or "").strip()
        if not s:
            continue
        key = s.lower()
        if key in seen:
            continue
        seen.add(key)
        normalized.append(s)
    return normalized


def parse_travel_intent(query: str):
    try:
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        client = genai.Client(api_key=api_key)

        with open("ai/prompts.json", "r") as f:
            prompts = json.load(f)

        base_prompt = prompts["travel_intent_parser"]
        final_prompt = base_prompt + "\nUser: " + query

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=final_prompt
        )

        raw = response.text.strip()
        parsed = _safe_parse_json(raw)

        sentences = _normalize_sentences(parsed.get("sentences", []))
        questions = _normalize_sentences(parsed.get("questions", []))[:2]

        if len(sentences) == 0:
            sentences = [query]

        return {
            "sentences": sentences,
            "questions": questions,
        }

    except Exception as e:
        print("❌ parse_travel_intent ERROR:", e)
        return {
            "sentences": [query],
            "questions": [],
        }


def run_recommendations(sentences: List[str]):
    model = load_model()
    metadata, embeddings = load_data("ai/city_embeddings.json", "ai/city_embeddings.npy")
    results = query_system(model, embeddings, metadata, sentences, k=5)
    return results if results is not None else []


def fake_ai(query: str):
    try:
        parsed = parse_travel_intent(query)
        sentences = parsed.get("sentences", [query])
        results = run_recommendations(sentences)

        # 🚨 ALWAYS RETURN VALID STRUCTURE
        return {
            "interpreted": sentences,
            "results": results,
            "questions": parsed.get("questions", []),
        }

    except Exception as e:
        print("❌ fake_ai ERROR:", e)

        # 🚨 FAIL SAFE (CRITICAL)
        return {
            "interpreted": [query],
            "results": [],
            "questions": [],
        }


# ------------------------
# Endpoint
# ------------------------
@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):

    # print(f"Received query: {req.query}")
    # results = fake_ai(req.query)

    # return {
    #     "results": results
    # }
    rec = fake_ai(req.query)
    return {
        "interpreted": rec.get("interpreted", [req.query]),
        "results": rec.get("results", []),
    }

@app.post("/recommend-audio", response_model=AudioRecommendResponse)
async def recommend_audio(
    file: UploadFile = File(...),
    prior_sentences: str = Form(default="[]"),
    turn: int = Form(default=1),
):
    print("🔥 AUDIO ENDPOINT HIT")
    try:
        audio_bytes = await file.read()
        print("📦 Received bytes:", len(audio_bytes))
        transcript = await transcribe_speech(
            audio_bytes,
            filename=file.filename or "audio.webm",
        )
        text = (transcript.get("text") or "").strip()

        if not text:
            return {
                "query": "",
                "interpreted": [],
                "results": [],
                "questions": [],
                "requires_followup": False,
                "session_sentences": [],
                "tts_audio_base64": None,
            }

        try:
            prior = _normalize_sentences(json.loads(prior_sentences or "[]"))
        except Exception:
            prior = []

        parsed = parse_travel_intent(text)
        current_sentences = parsed.get("sentences", [text])
        questions = parsed.get("questions", [])

        combined = _normalize_sentences(prior + current_sentences)
        has_prior_context = bool(prior) or int(turn) > 1

        # First turn: ask follow-up questions and speak them.
        if (not has_prior_context) and questions:
            tts_audio_base64 = None
            try:
                speech_text = " ".join(questions)
                if speech_text:
                    audio_out = await generate_speech(speech_text)
                    tts_audio_base64 = base64.b64encode(audio_out).decode("ascii")
            except Exception as tts_error:
                print("⚠️ TTS generation failed:", tts_error)

            response = {
                "query": text,
                "interpreted": current_sentences,
                "results": [],
                "questions": questions,
                "requires_followup": True,
                "session_sentences": combined,
                "tts_audio_base64": tts_audio_base64,
            }
            print("✅ RETURNING INTERACTIVE TURN:", response)
            return response

        # Final turn: merge previous + current sentences and run normal pipeline.
        results = run_recommendations(combined or [text])
        response = {
            "query": text,
            "interpreted": combined or [text],
            "results": results,
            "questions": [],
            "requires_followup": False,
            "session_sentences": combined or [text],
            "tts_audio_base64": None,
        }

        print("✅ RETURNING:", response)

        return response

    except Exception as e:
        print("❌ ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------
# RUN SERVER (your requested style)
# ------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)