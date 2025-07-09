export function transformMovies(movies) {
  return movies.map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    release_date: m.release_date,
    generos: m.genre_ids,
  }));
}
