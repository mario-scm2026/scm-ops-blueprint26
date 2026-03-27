#!/bin/bash
# Script de promoción de artefactos entre entornos
# Uso: ./promote.sh <version> <from_env> <to_env>

set -e

VERSION=${1:-latest}
FROM_ENV=${2:-stage}
TO_ENV=${3:-prod}

echo "🚀 Promocionando artefactos..."
echo "   Versión: $VERSION"
echo "   Desde: $FROM_ENV"
echo "   Hacia: $TO_ENV"

# Verificar que la imagen existe en Docker Hub
if ! docker manifest inspect midelivery/scm-backend:$VERSION > /dev/null 2>&1; then
    echo "❌ Error: Imagen midelivery/scm-backend:$VERSION no encontrada en Docker Hub"
    exit 1
fi

if ! docker manifest inspect midelivery/scm-frontend:$VERSION > /dev/null 2>&1; then
    echo "❌ Error: Imagen midelivery/scm-frontend:$VERSION no encontrada en Docker Hub"
    exit 1
fi

echo "✅ Imágenes verificadas"

# Desplegar en entorno destino
echo "📦 Desplegando en $TO_ENV..."
export VERSION=$VERSION
docker-compose -f docker-compose.$TO_ENV.yml pull
docker-compose -f docker-compose.$TO_ENV.yml up -d

# Registrar deployment en el backend
echo "📝 Registrando deployment..."
curl -X POST http://localhost:3002/api/deployments \
  -H "Content-Type: application/json" \
  -d "{\"version\":\"$VERSION\",\"status\":\"promoted\",\"rollbackFrom\":null}" \
  || echo "⚠️ No se pudo registrar deployment (backend puede no estar disponible)"

echo "✅ Promoción completada exitosamente"
echo "   Backend: http://localhost:3002"
echo "   Frontend: http://localhost:8082"
