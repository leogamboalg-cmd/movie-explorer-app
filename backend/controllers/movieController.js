//movieController.js
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const searchMovie = async function searchMovie(req, res) {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Movie title required" });
    }

    const url = `https://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${title}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      return res.status(404).json({ message: data.Error });
    }

    return res.json(data);
  } catch (err) {
    res.status(500).json({ message: "OMDb fetch failed" });
  }
};

const getNowPlayingMovies = async (req, res) => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    const movies = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.release_date?.split("-")[0] || null,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      rating: m.vote_average || null,
      overview: m.overview || null,
    }));

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch now playing movies" });
  }
};

const getPopularMovies = async (req, res) => {
  try {
    const response = await fetch("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const movies = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.release_date?.split("-")[0] || null,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      rating: m.vote_average || null,
      overview: m.overview || null,
    }));

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch popular movies" });
  }
};

const getTopRatedMovies = async (req, res) => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    const movies = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.release_date?.split("-")[0] || null,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      rating: m.vote_average || null,
      overview: m.overview || null,
    }));

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch top rated movies" });
  }
};

const getRecommendedMovies = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt required" });
    }

    const cleanPrompt = prompt.trim();

    if (cleanPrompt.length > 200) {
      return res.status(400).json({ message: "Prompt must be 200 characters or less" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Recommendation service is not configured" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      A user says: ${JSON.stringify(cleanPrompt)}

      Recommend 5 titles that match their taste.
      Movies or TV shows are both allowed.

      First infer the user's taste as specifically as possible:
      - tone
      - humor style
      - emotional vibe
      - pacing
      - themes
      - character dynamics

      If the user mentions a specific movie or show:
      - consider its tone and themes FIRST
      - also consider its actors, director, or creator SECOND (only if it naturally fits)

      Do NOT recommend something just because it shares the same actor or director.
      Only use that as a supporting signal.

      Avoid generic or obvious picks unless they are a very strong match.
      Prefer specific, high-quality recommendations.

      Write the intro like a real person:
      - 2 short sentences
      - natural and conversational
      - no generic phrases like "capture the spirit of"
      - use emojis be fun!

      Return JSON in this exact format:
      {
        "intro": "Short natural recommendation sentence",
        "movies": [
          {
            "title": "Title Name"
          }
        ]
      }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            movies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                },
                required: ["title"],
              },
            },
          },
          required: ["intro", "movies"],
        },
      },
    });

    return res.json(JSON.parse(response.text));
  } catch (err) {
    console.error("getRecommendedMovies error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch recommended movies" });
  }
};

module.exports = {
  searchMovie,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getRecommendedMovies,
};
