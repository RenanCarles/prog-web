// etl/load.js
import { db } from "../firebase.js";

//Salva a lista de filmes no Firestore

export async function loadMovies(movies) {
  const batch = db.batch();
  const collection = db.collection("filmes");

  movies.forEach((movie) => {
    const docRef = collection.doc(movie.id.toString());
    batch.set(docRef, movie);
  });

  await batch.commit();
  console.log("Filmes salvos no Firestore com sucesso!");
}
