export function transformGenres(genres) {
  return genres.map((g) => ({
    id: g.id,
    nome: g.name,
  }));
}
