import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  // Charger les tâches
  const fetchTasks = () => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
        else setStatus('Erreur: ' + JSON.stringify(data));
      })
      .catch(err => setStatus('Erreur: ' + err.message));
  };

  useEffect(() => { fetchTasks(); }, []);

  // Ajouter une tâche
  const addTask = () => {
    if (!title.trim()) return;
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    .then(() => { setTitle(''); fetchTasks(); })
    .catch(err => setStatus('Erreur: ' + err.message));
  };

  // Modifier statut
  const toggleTask = (id, completed) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
    .then(() => fetchTasks())
    .catch(err => setStatus('Erreur: ' + err.message));
  };

  // Supprimer tâche
  const deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    .then(() => fetchTasks())
    .catch(err => setStatus('Erreur: ' + err.message));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial' }}>
      <h1>📋 Todo List  MMMMMMM12345</h1>
      {status && <p style={{ color: 'red' }}>{status}</p>}

      {/* Ajouter une tâche */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nouvelle tâche..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button
          onClick={addTask}
          style={{ padding: '8px 16px', background: '#0078d4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      {tasks.map(task => (
        <div key={task.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px', marginBottom: '8px',
          background: task.completed ? '#e8f5e9' : '#fff',
          border: '1px solid #ddd', borderRadius: '4px'
        }}>
          <input
            type="checkbox"
            checked={!!task.completed}
            onChange={() => toggleTask(task.id, task.completed)}
          />
          <span style={{
            flex: 1, fontSize: '16px',
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#888' : '#000'
          }}>
            {task.title}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            style={{ padding: '4px 10px', background: '#e53935', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🗑️
          </button>
        </div>
      ))}

      {tasks.length === 0 && <p style={{ color: '#888' }}>Aucune tâche pour l'instant !</p>}
    </div>
  );
}

export default App;