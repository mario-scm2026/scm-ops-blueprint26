-- Tabla para registrar despliegues
CREATE TABLE IF NOT EXISTS deployments (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    environment VARCHAR(50) NOT NULL,
    deployed_by VARCHAR(100),
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'success',
    rollback_from VARCHAR(50)
);

-- Índices
CREATE INDEX idx_deployments_version ON deployments(version);
CREATE INDEX idx_deployments_environment ON deployments(environment);
CREATE INDEX idx_deployments_deployed_at ON deployments(deployed_at);
