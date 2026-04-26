import { useState } from "react";
import HeroInput from "../components/HeroInput";
import LoadingState from "../components/LoadingState";
import ResultsSection from "../components/ResultsSection";

function Home({ onExplore }) {
  console.log("HOME MOUNT");

  // ------------------------
  // State Management
  // ------------------------
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [interpreted, setInterpreted] = useState([]);
  const [error, setError] = useState(null);
  

  console.log("STATE:", { loading, results, interpreted });

  // ------------------------
  // API Call (REAL BACKEND)
  // ------------------------
  const fetchRecommendations = async (userQuery) => {
    if (!userQuery) return;
    const startedAt = Date.now();
    const MIN_LOADING_MS = 700;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not fetch destinations right now. Please try again.");
      }

      const data = await res.json();

      // setResults(data.results || []);
      setResults(data.results || []);
      setInterpreted(data.interpreted || []);
    } catch (err) {
      console.error(err);
      if (err?.name === "TypeError") {
        setError("Cannot reach the recommendations server. Make sure backend is running on port 8000.");
      } else {
        setError(err.message || "Failed to load destinations. Please try again.");
      }
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => {
          setTimeout(resolve, MIN_LOADING_MS - elapsed);
        });
      }
      setLoading(false);
    }
  };

  // ------------------------
  // Handlers
  // ------------------------
const handleSubmit = (userQuery) => {
  console.log("SUBMIT:", userQuery);

  setQuery(userQuery); // 🔥 IMPORTANT
  fetchRecommendations(userQuery);
};

  const handleAudioResult = (audioData) => {
    setQuery(audioData?.query || "");
    setResults(audioData?.results || []);
    setInterpreted(audioData?.interpreted || []);
    setError(null);
  };

  const handleAudioError = (message) => {
    setError(message || "Audio transcription failed.");
  };

  const handleRefine = (newQuery) => {
    setQuery(newQuery);
    fetchRecommendations(newQuery);
  };

  const handleReset = () => {
    setQuery("");
    setResults([]);
    setInterpreted([]);
    setError(null);
  };

  // ------------------------
  // Render Logic
  // ------------------------

  return (
    <>
      {loading && <LoadingState query={query} />}

      {!loading && results.length === 0 && (
        <HeroInput
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          onAudioResult={handleAudioResult}
          onAudioError={handleAudioError}
          isLoading={loading}
          error={error}
        />
      )}

      {!loading && results.length > 0 && (
        <ResultsSection
          query={query}
          results={results}
          interpretedTags={interpreted}
          error={error}
          onRefine={handleRefine}
          onExplore={onExplore}
          onReset={handleReset}
        />
      )}
    </>
  );
}

export default Home;