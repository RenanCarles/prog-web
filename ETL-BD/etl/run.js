// Filmes
import { extractMovies } from "./filmes/extract.js";
import { transformMovies } from "./filmes/transform.js";
import { loadMovies } from "./filmes/load.js";

// Gêneros
import { extractGenres } from "./generos/extract.js";
import { transformGenres } from "./generos/transform.js";
import { loadGenres } from "./generos/load.js";
//usuarios
import { loadUsuarios } from "./usuarios/load.js";
//avaliaçoes
import { loadAvaliacoes } from "./avaliacoes/load.js";

async function runETL() {
  console.log("🚀 Iniciando ETL completo...\n");

  // ETL de Gêneros
  console.log("🎭 ETL de Gêneros:");
  const rawGenres = await extractGenres();
  console.log("📥 Extraído:", rawGenres.length, "gêneros");
  const transformedGenres = transformGenres(rawGenres);
  await loadGenres(transformedGenres);
  console.log("✅ Gêneros carregados!\n");

  // ETL de Filmes
  console.log("🎬 ETL de Filmes:");
  const rawMovies = await extractMovies();
  console.log("📥 Extraído:", rawMovies.length, "filmes");
  const transformedMovies = transformMovies(rawMovies);
  await loadMovies(transformedMovies);
  console.log("✅ Filmes carregados!\n");

  // Usuários
  console.log("👤 Inicializando coleção de Usuários...");
  await loadUsuarios();

  // Avaliações
  console.log("⭐ Inicializando coleção de Avaliações...");
  await loadAvaliacoes();

  console.log("🏁 ETL concluído com sucesso!");
}

runETL().catch((err) => {
  console.error("❌ Erro ao executar o ETL:", err);
});
