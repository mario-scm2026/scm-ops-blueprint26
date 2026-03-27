-- Tabla para feature flags persistentes
CREATE TABLE IF NOT EXISTS feature_flags (
    id SERIAL PRIMARY KEY,
    flag_name VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    environment VARCHAR(50) NOT NULL,
    UNIQUE(flag_name, environment)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_feature_flags_name ON feature_flags(flag_name);
CREATE INDEX idx_feature_flags_env ON feature_flags(environment);

-- Insertar feature flags por defecto (usando INSERT con subconsulta para evitar duplicados)
INSERT INTO feature_flags (flag_name, enabled, description, environment)
SELECT 'new_ui', false, 'Nueva interfaz de usuario', 'development'
WHERE NOT EXISTS (SELECT 1 FROM feature_flags WHERE flag_name = 'new_ui' AND environment = 'development');

INSERT INTO feature_flags (flag_name, enabled, description, environment)
SELECT 'debug_mode', false, 'Modo debug con logs detallados', 'development'
WHERE NOT EXISTS (SELECT 1 FROM feature_flags WHERE flag_name = 'debug_mode' AND environment = 'development');

INSERT INTO feature_flags (flag_name, enabled, description, environment)
SELECT 'analytics', true, 'Habilitar analytics', 'development'
WHERE NOT EXISTS (SELECT 1 FROM feature_flags WHERE flag_name = 'analytics' AND environment = 'development');
