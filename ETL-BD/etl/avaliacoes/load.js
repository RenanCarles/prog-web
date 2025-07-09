import { db } from "../firebase.js";

export async function loadAvaliacoes() {
  const collection = db.collection("avaliacoes");
  const batch = db.batch();

  // Dados fictícios de avaliações
  const avaliacoes = [
    {
      id: "a1",
      nota: 4.5,
      comentario: "Filme excelente!",
      id_filme: 603, // exemplo: Matrix
      id_usuario: "u1",
    },
    {
      id: "a2",
      nota: 3.0,
      comentario: "Bom, mas podia ser melhor.",
      id_filme: 238, // exemplo: O Poderoso Chefão
      id_usuario: "u2",
    },
  ];

  avaliacoes.forEach((a) => {
    const docRef = collection.doc(a.id);
    batch.set(docRef, a);
  });

  await batch.commit();
  console.log("Avaliações criadas no Firestore (fictícias)!");
}
