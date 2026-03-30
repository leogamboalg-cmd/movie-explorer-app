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

    if (!prompt) {
      return res.status(400).json({ message: "Prompt required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        A user says: "${prompt}"

        Recommend 5 movies that match their taste.

        Write the intro like a real movie friend talking:
        - warm, specific, and natural
        - 1 short sentence only
        - do NOT sound generic or robotic
        - mention the user's vibe or taste
        - do NOT say "Here are 5 movies"
        - do NOT say "capture the spirit of"
        - do NOT use filler like "whimsical fun" unless it truly fits

        Return JSON in this exact format:
        {
          "intro": "Short natural recommendation sentence",
          "movies": [
            {
              "title": "Movie Title",
              "year": "2020",
              "overview": "Short summary"
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
                  year: { type: Type.STRING },
                  overview: { type: Type.STRING },
                },
                required: ["title", "year", "overview"],
              },
            },
          },
          required: ["intro", "movies"],
        },
      },
    });

    return res.json(JSON.parse(response.text));
  } catch (err) {
    console.error(err);
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
