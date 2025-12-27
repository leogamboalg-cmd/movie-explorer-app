//movieController.js
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
}
module.exports = { searchMovie };