import axios from "axios";

const API_KEY = "6dfb1aec77c621eea6fed3193e322e42";
const BASE_URL = "https://api.themoviedb.org/3/genre/movie/list";

export async function extractGenres() {
  const { data } = await axios.get(
    `${BASE_URL}?api_key=${API_KEY}&language=pt-BR`
  );
  return data.genres;
}
