import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [health, setHealth] = useState(null);
  const [featureFlags, setFeatureFlags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Llamada al endpoint de mensaje
      const messageRes = await axios.get(`${API_URL}/api/message`);
      setMessage(messageRes.data.message);
      
      // Llamada al health check
      const healthRes = await axios.get(`${API_URL}/health`);
      setHealth(healthRes.data);
      
      // Llamada a feature flags
      const flagsRes = await axios.get(`${API_URL}/api/feature-flags`);
      setFeatureFlags(flagsRes.data);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error connecting to backend. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>{import.meta.env.VITE_APP_NAME}</h1>
          <div className="loading">Loading...</div>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>{import.meta.env.VITE_APP_NAME}</h1>
          <div className="error">
            <p>{error}</p>
            <button onClick={loadData}>Retry</button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
        <p className="subtitle">Configuration Management System</p>
      </header>

      <main className="app-main">
        <div className="card message-card">
          <h2>Message from Backend</h2>
          <p className="message">{message}</p>
        </div>

        <div className="card health-card">
          <h2>System Health</h2>
          {health && (
            <div className="health-info">
              <p><strong>Status:</strong> <span className="status-ok">{health.status}</span></p>
              <p><strong>Environment:</strong> {health.environment}</p>
              <p><strong>Version:</strong> {health.version}</p>
              <p><strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="card features-card">
          <h2>Feature Flags</h2>
          {featureFlags && (
            <div className="features">
              <div className="feature">
                <span>New UI:</span>
                <span className={featureFlags.newUi ? 'enabled' : 'disabled'}>
                  {featureFlags.newUi ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
              <div className="feature">
                <span>Debug Mode:</span>
                <span className={featureFlags.debugMode ? 'enabled' : 'disabled'}>
                  {featureFlags.debugMode ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
            </div>
          )}
        </div>

        <button className="refresh-btn" onClick={loadData}>
          Refresh Data
        </button>
      </main>

      <footer className="app-footer">
        <p>SCM Ops Blueprint - Configuration Management Enterprise</p>
        <p className="small">Control de cambios formal | Artefactos inmutables | Configuración por entornos</p>
      </footer>
    </div>
  );
}

export default App;
