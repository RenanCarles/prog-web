const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let fake_database = [
  { id: 1, movieId: 101, text: 'Ótimo filme de ação!', rating: 4.5 },
  { id: 2, movieId: 102, text: 'História envolvente e atuações incríveis.', rating: 5.0 },
  { id: 3, movieId: 101, text: 'Efeitos especiais impressionantes, mas roteiro fraco.', rating: 3.5 },
];

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Feedback de Filmes!' });
});


// Inserir um novo feedback
app.post('/api/feedback', (req, res) => {
  // Verifica se os campos obrigatórios foram fornecidos
  if (!req.body.movieId || !req.body.text || req.body.rating === undefined) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios: movieId, text e rating' });
  }

  const newFeedback = {
    id: fake_database.length > 0 ? Math.max(...fake_database.map(item => item.id)) + 1 : 1,
    movieId: parseInt(req.body.movieId),
    text: req.body.text,
    rating: parseFloat(req.body.rating)
  };
  
  fake_database.push(newFeedback);
  res.status(201).json(newFeedback);
});

//Obter feedbacks por ID do filme
app.get('/api/feedback/movie/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movieFeedbacks = fake_database.filter(item => item.movieId === movieId);
  
  if (movieFeedbacks.length === 0) {
    return res.status(404).json({ message: 'Nenhum feedback encontrado para este filme' });
  }
  
  res.json(movieFeedbacks);
});

//Obter um feedback específico pelo ID
app.get('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = fake_database.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ message: 'Feedback não encontrado' });
  }
  
  res.json(item);
});

//Obter a média de avaliações de um filme
app.get('/api/movies/:movieId/rating', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movieFeedbacks = fake_database.filter(item => item.movieId === movieId);
  
  if (movieFeedbacks.length === 0) {
    return res.status(404).json({ message: 'Nenhum feedback encontrado para este filme' });
  }
  
  const totalRating = movieFeedbacks.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = totalRating / movieFeedbacks.length;
  
  res.json({ 
    movieId, 
    averageRating: parseFloat(averageRating.toFixed(1)), 
    totalFeedbacks: movieFeedbacks.length 
  });
});

//Atualizar um feedback existente
app.put('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = fake_database.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Feedback não encontrado' });
  }
  
  const updatedItem = {
    id: id,
    movieId: req.body.movieId !== undefined ? parseInt(req.body.movieId) : fake_database[itemIndex].movieId,
    text: req.body.text || fake_database[itemIndex].text,
    rating: req.body.rating !== undefined ? parseFloat(req.body.rating) : fake_database[itemIndex].rating
  };
  
  fake_database[itemIndex] = updatedItem;
  res.json(updatedItem);
});

//Remover um feedback
app.delete('/api/feedback/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = fake_database.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Feedback não encontrado' });
  }
  
  const deletedItem = fake_database[itemIndex];
  fake_database.splice(itemIndex, 1);
  
  res.json({ message: 'Feedback removido com sucesso', item: deletedItem });
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});