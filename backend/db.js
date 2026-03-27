const { Pool } = require('pg');

// Configuración de conexión
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Función para probar conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
        return true;
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        return false;
    }
};

// Función para obtener configuración
const getConfig = async (key, environment) => {
    const result = await pool.query(
        'SELECT config_value FROM configurations WHERE config_key = $1 AND environment = $2',
        [key, environment]
    );
    return result.rows[0]?.config_value;
};

// Función para obtener feature flags
const getFeatureFlags = async (environment) => {
    const result = await pool.query(
        'SELECT flag_name, enabled FROM feature_flags WHERE environment = $1',
        [environment]
    );
    const flags = {};
    result.rows.forEach(row => {
        flags[row.flag_name] = row.enabled;
    });
    return flags;
};

// Función para registrar deployment
const registerDeployment = async (version, environment, status, rollbackFrom = null) => {
    const result = await pool.query(
        'INSERT INTO deployments (version, environment, status, rollback_from) VALUES ($1, $2, $3, $4) RETURNING *',
        [version, environment, status, rollbackFrom]
    );
    return result.rows[0];
};

module.exports = {
    pool,
    testConnection,
    getConfig,
    getFeatureFlags,
    registerDeployment
};
