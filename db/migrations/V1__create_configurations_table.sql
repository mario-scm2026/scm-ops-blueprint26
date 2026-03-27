-- Tabla para almacenar configuración por entorno
CREATE TABLE IF NOT EXISTS configurations (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(255) NOT NULL,
    config_value TEXT NOT NULL,
    environment VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(config_key, environment)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_config_key ON configurations(config_key);
CREATE INDEX idx_environment ON configurations(environment);
