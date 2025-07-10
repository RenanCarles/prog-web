const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inicializar o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Inicializar o Firestore
const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota raiz
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à API de Feedback de Filmes!" });
});

// Obter todos os filmes
app.get("/api/movies", async (req, res) => {
  try {
    const snapshot = await db.collection("filmes").get();
    const filmes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(filmes);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar filmes", error: error.message });
  }
});

// Obter um filme específico pelo ID
app.get("/api/movies/:id", async (req, res) => {
  try {
    const id_filme = parseInt(req.params.id);
    const snapshot = await db
      .collection("filmes")
      .where("id", "==", id_filme)
      .get();

    const filmes = [];
    snapshot.forEach((doc) => {
      filmes.push({ id: doc.id, ...doc.data() });
    });

    if (filmes.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum filme encontrado para este filme" });
    }

    res.json(filmes);
  } catch (error) {
    console.error("Erro ao buscar filme:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar filme", error: error.message });
  }
});

// Inserir um novo feedback
app.post("/api/feedback", async (req, res) => {
  try {
    // Verifica se os campos obrigatórios foram fornecidos
    if (
      !req.body.id_filme ||
      !req.body.comentario ||
      req.body.nota === undefined
    ) {
      return res
        .status(400)
        .json({
          message:
            "Todos os campos são obrigatórios: id_filme, comentario e nota",
        });
    }

    const newFeedback = {
      id:
        avaliacoes.length > 0
          ? String(Math.max(...avaliacoes.map((item) => parseInt(item.id))) + 1)
          : "1",
      id_filme: req.body.id_filme,
      comentario: req.body.comentario,
      nota: parseFloat(req.body.nota),
      created_at: new Date(),
    };

    await db.collection("avaliacoes").add(newFeedback);

    res.status(200).json({ message: "Feedback enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao inserir feedback:", error);
    res
      .status(500)
      .json({ message: "Erro ao inserir feedback", error: error.message });
  }
});

//Obter todos os feedbacks
// app.get('/api/feedback', async (req, res) => {
//   try {
//     const snapshot = await db.collection('avaliacoes').get();
//     const feedbacks = [];
//     snapshot.forEach(doc => {
//       feedbacks.push({ id: doc.id, ...doc.data() });
//     });
//     res.json(feedbacks);
//   } catch (error) {
//     console.error('Erro ao buscar feedbacks:', error);
//     res.status(500).json({ message: 'Erro ao buscar feedbacks', error: error.message });
//   }
// });

//Obter feedbacks por ID do filme
app.get("/api/feedback/movie/:id_filme", async (req, res) => {
  try {
    const id_filme = parseInt(req.params.id_filme);
    const snapshot = await db
      .collection("avaliacoes")
      .where("id_filme", "==", id_filme)
      .get();

    const feedbacks = [];
    snapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });

    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum feedback encontrado para este filme" });
    }

    res.json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks do filme:", error);
    res
      .status(500)
      .json({
        message: "Erro ao buscar feedbacks do filme",
        error: error.message,
      });
  }
});

//Obter um feedback específico pelo ID
// app.get('/api/feedback/:id', async (req, res) => {
//   try {
//     const docRef = db.collection('avaliacoes').doc(req.params.id);
//     const doc = await docRef.get();

//     if (!doc.exists) {
//       return res.status(404).json({ message: 'Feedback não encontrado' });
//     }

//     res.json({ id: doc.id, ...doc.data() });
//   } catch (error) {
//     console.error('Erro ao buscar feedback:', error);
//     res.status(500).json({ message: 'Erro ao buscar feedback', error: error.message });
//   }
// });

//Obter a média de avaliações de um filme
app.get("/api/movies/:id_filme/rating", async (req, res) => {
  try {
    const id_filme = parseInt(req.params.id_filme);
    const snapshot = await db
      .collection("avaliacoes")
      .where("id_filme", "==", id_filme)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Nenhum feedback encontrado para este filme" });
    }

    let totalNota = 0;
    let count = 0;

    snapshot.forEach((doc) => {
      totalNota += doc.data().nota;
      count++;
    });

    const mediaNotas = totalNota / count;

    res.json({
      id_filme,
      media_notas: parseFloat(mediaNotas.toFixed(1)),
      total_avaliacoes: count,
    });
  } catch (error) {
    console.error("Erro ao calcular média de notas:", error);
    res
      .status(500)
      .json({
        message: "Erro ao calcular média de notas",
        error: error.message,
      });
  }
});

//Atualizar nota de um feedback existente
app.put("/api/feedback/:id", async (req, res) => {
  try {
    const docRef = db.collection("avaliacoes").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Feedback não encontrado" });
    }

    const updateData = {};

    if (req.body.nota !== undefined) {
      updateData.nota = parseFloat(req.body.nota);
    }

    await docRef.update(updateData);

    // Busca o documento atualizado
    const updatedDoc = await docRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error("Erro ao atualizar feedback:", error);
    res
      .status(500)
      .json({ message: "Erro ao atualizar feedback", error: error.message });
  }
});

//Remover um feedback
app.delete("/api/feedback/:id", async (req, res) => {
  try {
    const docRef = db.collection("avaliacoes").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Feedback não encontrado" });
    }

    // Salva os dados do documento antes de excluí-lo
    const deletedItem = { id: doc.id, ...doc.data() };

    // Exclui o documento
    await docRef.delete();

    res.json({ message: "Feedback removido com sucesso", item: deletedItem });
  } catch (error) {
    console.error("Erro ao remover feedback:", error);
    res
      .status(500)
      .json({ message: "Erro ao remover feedback", error: error.message });
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
