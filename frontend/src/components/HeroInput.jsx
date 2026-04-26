import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';

const HeroInput = ({ onSubmit, onAudioResult, onAudioError, isLoading, query, setQuery, error }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioProcessing, setIsAudioProcessing] = useState(false);
  const [followupQuestions, setFollowupQuestions] = useState([]);
  const [sessionSentences, setSessionSentences] = useState([]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // -------------------------
  // TEXT + AUDIO SUBMIT (ONE ONLY)
  // -------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    submitQuery(query, null);
  };

const submitQuery = async (textOverride = null, audioOverride = null) => {
  try {
    // 🎤 AUDIO FLOW
    if (audioOverride) {
      setIsAudioProcessing(true);
      const formData = new FormData();
      formData.append("file", audioOverride, "recording.webm");
      formData.append("prior_sentences", JSON.stringify(sessionSentences || []));
      formData.append("turn", sessionSentences.length > 0 ? "2" : "1");

      const res = await fetch("http://localhost:8000/recommend-audio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Audio request failed.";
        try {
          const errData = await res.json();
          if (errData?.detail) {
            msg = errData.detail;
          }
        } catch (_) {
          // Ignore parse failures and keep fallback message.
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const newQuery = data.query || "";

      if (newQuery) {
        setQuery(newQuery);
      }

      if (data.requires_followup) {
        setSessionSentences(data.session_sentences || []);
        setFollowupQuestions(data.questions || []);

        const ttsB64 = data.tts_audio_base64;
        if (ttsB64) {
          const audio = new Audio(`data:audio/mpeg;base64,${ttsB64}`);
          audio.play().catch((playErr) => {
            console.error("TTS playback failed:", playErr);
          });
        }
        return;
      }

      setSessionSentences([]);
      setFollowupQuestions([]);

      if (onAudioResult) {
        onAudioResult(data);
      } else if (newQuery) {
        onSubmit(newQuery);
      }

      return;
    }

    // ✍️ TEXT FLOW
    const finalQuery = textOverride ?? query;

    if (finalQuery && finalQuery.trim().length > 0) {
      setSessionSentences([]);
      setFollowupQuestions([]);
      onSubmit(finalQuery); // 🔥 ALWAYS pass query up
    }
  } catch (err) {
    console.error(err);
    if (onAudioError) {
      onAudioError(err?.message || "Audio transcription failed.");
    }
  } finally {
    if (audioOverride) {
      setIsAudioProcessing(false);
    }
  }
};

  // -------------------------
  // MIC LOGIC
  // -------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        // 🔥 DIRECT SUBMIT (no waiting for React state)
        submitQuery(null, blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      alert('Microphone access denied or not supported.');
    }
  };

  const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};

  const handleMicClick = () => {
  if (isRecording) stopRecording();
  else startRecording();
};

  return (
    <Box
      sx={{
        minHeight: { xs: '70vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        backgroundImage:
          'linear-gradient(135deg, rgba(15,23,42,0.65) 0%, rgba(37,99,235,0.35) 100%), url(' +
          HERO_IMAGE +
          ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ mb: 2 }}>
            Your Dream Trip Starts Here
          </Typography>

          <Typography variant="h5" sx={{ mb: 4 }}>
            Tell us what you love, we&apos;ll find the perfect escape.
          </Typography>

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: '999px',
              p: 1,
            }}
          >
            <InputBase
              fullWidth
              placeholder="Describe your dream trip..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || isAudioProcessing}
              sx={{
                borderRadius: '999px',
                px: 4,
                background: 'linear-gradient(135deg, #60a5fa, #2563eb)',
              }}
            >
              Find
            </Button>
          </Box>

          {/* MIC BUTTON (NOT SUBMIT) */}
          <Button
            onClick={handleMicClick}
            disabled={isLoading || isAudioProcessing}
            sx={{
              mt: 3,
              width: 55,
              height: 55,
              borderRadius: '50%',
              background: isRecording
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #00D4FF, #3B82F6)',
              color: '#fff',
            }}
          >
            <MicIcon />
          </Button>

          {/* STATES */}
          {isRecording && (
            <Typography sx={{ mt: 2, color: '#00D4FF' }}>
              🎤 Recording...
            </Typography>
          )}

          {isAudioProcessing && (
            <Typography sx={{ mt: 2, color: '#00D4FF' }}>
              Processing audio...
            </Typography>
          )}

          {followupQuestions.length > 0 && (
            <Box
              sx={{
                mt: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                textAlign: 'left',
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Follow-up questions:
              </Typography>
              {followupQuestions.map((q, i) => (
                <Typography key={`${q}-${i}`} sx={{ mb: 0.5 }}>
                  {i + 1}. {q}
                </Typography>
              ))}
              <Typography sx={{ mt: 1, color: '#bfdbfe' }}>
                Tap the mic again, answer naturally, then tap again to finish.
              </Typography>
            </Box>
          )}

          {error && (
            <Typography sx={{ mt: 2, color: '#f87171' }}>
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroInput;