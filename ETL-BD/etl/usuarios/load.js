import { db } from "../firebase.js";

export async function loadUsuarios() {
  const collection = db.collection("usuarios");
  const batch = db.batch();

  // Dados fictícios de usuários
  const usuarios = [
    {
      id: "u1",
      nome: "Alice",
      usuario: "alice123",
      email: "alice@email.com",
      senha: "123456",
    },
    {
      id: "u2",
      nome: "Bob",
      usuario: "bobzin",
      email: "bob@email.com",
      senha: "abcdef",
    },
  ];

  usuarios.forEach((user) => {
    const docRef = collection.doc(user.id);
    batch.set(docRef, user);
  });

  await batch.commit();
  console.log("Usuários criados no Firestore (fictícios)!");
}
