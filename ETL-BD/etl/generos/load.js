import { db } from "../firebase.js";

export async function loadGenres(genres) {
  const batch = db.batch();
  const collection = db.collection("generos");

  genres.forEach((genre) => {
    const docRef = collection.doc(genre.id.toString());
    batch.set(docRef, genre);
  });

  await batch.commit();
  console.log("Gêneros salvos no Firestore com sucesso!");
}
