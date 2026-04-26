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
from datetime import date, timedelta
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError

from ai.config import (
    DEFAULT_ADULTS,
    DEFAULT_CABIN_CLASS,
    DEFAULT_CURRENCY,
    DEFAULT_LOCALE,
    DEFAULT_MARKET,
    DEFAULT_ORIGIN,
    SKYSCANNER_API_KEY,
)

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


class FlightSearchRequest(BaseModel):
    origin_iata: str = DEFAULT_ORIGIN
    destination_iata: str
    year: Optional[int] = None
    month: Optional[int] = None
    day: Optional[int] = None
    return_year: Optional[int] = None
    return_month: Optional[int] = None
    return_day: Optional[int] = None
    adults: int = DEFAULT_ADULTS
    market: str = DEFAULT_MARKET
    locale: str = DEFAULT_LOCALE
    currency: str = DEFAULT_CURRENCY
    cabin_class: str = DEFAULT_CABIN_CLASS


class FlightTicket(BaseModel):
    airline: str
    price: float
    origin: str
    destination: str
    departure: str
    arrival: str


class FlightSearchResponse(BaseModel):
    origin_iata: str
    destination_iata: str
    date: str
    tickets: List[FlightTicket]


def extract_flights(data):
    results = []

    content = data.get("content", {})
    search_results = content.get("results", {})
    itineraries = search_results.get("itineraries", {})
    legs = search_results.get("legs", {})
    carriers = search_results.get("carriers", {})
    places = search_results.get("places", {})

    for itinerary in itineraries.values():
        leg_ids = itinerary.get("legIds", [])
        if not leg_ids:
            continue

        leg = legs.get(leg_ids[0])
        if not leg:
            continue

        departure = leg.get("departureDateTime", {})
        arrival = leg.get("arrivalDateTime", {})

        origin_place = places.get(leg.get("originPlaceId"), {})
        destination_place = places.get(leg.get("destinationPlaceId"), {})

        carrier_ids = leg.get("marketingCarrierIds", [])
        carrier_id = carrier_ids[0] if carrier_ids else None
        airline = carriers.get(carrier_id, {}).get("name", "Unknown airline")

        pricing_options = itinerary.get("pricingOptions", [])
        price = 0.0
        if pricing_options:
            price = float(pricing_options[0].get("price", {}).get("amount", 0)) / 1000

        results.append({
            "airline": airline,
            "price": price,
            "origin": origin_place.get("name", "Unknown origin"),
            "destination": destination_place.get("name", "Unknown destination"),
            "departure": f"{departure.get('hour', 0):02d}:{departure.get('minute', 0):02d}",
            "arrival": f"{arrival.get('hour', 0):02d}:{arrival.get('minute', 0):02d}",
        })

    return results


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


def fetch_skyscanner_tickets(payload: FlightSearchRequest):
    if not SKYSCANNER_API_KEY:
        raise RuntimeError("SKYSCANNER_API_KEY is not set. Add it to backend/ai/.env.")

    travel_date = date.today() + timedelta(days=30)
    if payload.year and payload.month and payload.day:
        travel_date = date(payload.year, payload.month, payload.day)

    url = "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create"
    request_body = {
        "query": {
            "market": payload.market,
            "locale": payload.locale,
            "currency": payload.currency,
            "adults": payload.adults,
            "cabinClass": payload.cabin_class,
            "queryLegs": [
                {
                    "originPlaceId": {"iata": payload.origin_iata},
                    "destinationPlaceId": {"iata": payload.destination_iata},
                    "date": {
                        "year": travel_date.year,
                        "month": travel_date.month,
                        "day": travel_date.day,
                    },
                }
            ],
        }
    }

    headers = {
        "x-api-key": SKYSCANNER_API_KEY,
        "Content-Type": "application/json",
    }

    req = urlrequest.Request(
        url=url,
        data=json.dumps(request_body).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urlrequest.urlopen(req, timeout=60) as response:
            response_json = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raise RuntimeError(
            f"Skyscanner request failed ({exc.code}): {exc.read().decode('utf-8', errors='ignore')}"
        )
    except URLError as exc:
        raise RuntimeError(f"Skyscanner request failed: {exc.reason}")

    return {
        "origin_iata": payload.origin_iata,
        "destination_iata": payload.destination_iata,
        "date": travel_date.isoformat(),
        "tickets": extract_flights(response_json),
    }


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


@app.post("/flights/search", response_model=FlightSearchResponse)
def flights_search(payload: FlightSearchRequest):
    try:
        return fetch_skyscanner_tickets(payload)
    except Exception as e:
        print("❌ flights_search ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------
# RUN SERVER (your requested style)
# ------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)