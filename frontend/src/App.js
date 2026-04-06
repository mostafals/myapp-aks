import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('Chargement...');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setStatus('Connecté à Azure SQL ✅');
      })
      .catch(err => {
        setStatus('Erreur connexion API ❌');
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Mon App React 🚀</h1>
      <p>Status : <strong>{status}</strong></p>
      <h2>Users depuis Azure SQL :</h2>
      <ul>
        {users.map((u, i) => <li key={i}>{u.name}</li>)}
      </ul>
    </div>
  );
}

export default App;