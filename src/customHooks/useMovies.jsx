import { useEffect, useState } from "react";

const KEY = "f84fc31d";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function getMoviesList() {
      try {
        setIsLoading(true);
        setError("");
        let res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movie 🧨");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie Not Found🧨");
        console.log(data.Search);
        setMovies(data.Search);
        setError("");
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    getMoviesList();
    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
