const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./db');

// Validar configuración al arrancar
const requiredEnvVars = ['PORT', 'NODE_ENV', 'DATABASE_URL'];
const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint con DB
app.get('/health', async (req, res) => {
    const dbConnected = await db.testConnection();
    res.status(200).json({
        status: 'ok',
        environment: environment,
        version: process.env.APP_VERSION || '0.2.0',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Endpoint de mensaje
app.get('/api/message', (req, res) => {
    res.json({
        message: `Hello from ${environment} environment!`,
        timestamp: new Date().toISOString()
    });
});

// Endpoint para feature flags (desde DB)
app.get('/api/feature-flags', async (req, res) => {
    try {
        const flags = await db.getFeatureFlags(environment);
        res.json(flags);
    } catch (error) {
        console.error('Error getting feature flags:', error);
        res.status(500).json({ error: 'Failed to get feature flags' });
    }
});

// Endpoint para actualizar feature flag (admin)
app.post('/api/feature-flags/:name', async (req, res) => {
    const { name } = req.params;
    const { enabled } = req.body;
    
    try {
        await db.pool.query(
            'INSERT INTO feature_flags (flag_name, enabled, environment) VALUES ($1, $2, $3) ON CONFLICT (flag_name, environment) DO UPDATE SET enabled = $2, updated_at = CURRENT_TIMESTAMP',
            [name, enabled, environment]
        );
        res.json({ success: true, flag: name, enabled });
    } catch (error) {
        console.error('Error updating feature flag:', error);
        res.status(500).json({ error: 'Failed to update feature flag' });
    }
});

// Endpoint para registro de deployments
app.post('/api/deployments', async (req, res) => {
    const { version, status, rollbackFrom } = req.body;
    
    try {
        const deployment = await db.registerDeployment(version, environment, status, rollbackFrom);
        res.json(deployment);
    } catch (error) {
        console.error('Error registering deployment:', error);
        res.status(500).json({ error: 'Failed to register deployment' });
    }
});

// Endpoint para obtener historial de deployments
app.get('/api/deployments', async (req, res) => {
    try {
        const result = await db.pool.query(
            'SELECT * FROM deployments WHERE environment = $1 ORDER BY deployed_at DESC LIMIT 50',
            [environment]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting deployments:', error);
        res.status(500).json({ error: 'Failed to get deployments' });
    }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Iniciar servidor
app.listen(port, async () => {
    console.log(`✅ Backend server running at http://localhost:${port}`);
    console.log(`📦 Environment: ${environment}`);
    console.log(`🔧 Validated configuration: OK`);
    await db.testConnection();
});
