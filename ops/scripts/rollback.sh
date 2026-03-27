#!/bin/bash
# Script de rollback a versión anterior
# Uso: ./rollback.sh <previous_version> <environment>

set -e

PREV_VERSION=${1:-v0.1.0}
ENVIRONMENT=${2:-prod}

echo "🔄 Ejecutando rollback..."
echo "   Versión anterior: $PREV_VERSION"
echo "   Entorno: $ENVIRONMENT"

# Verificar que la imagen existe
if ! docker manifest inspect midelivery/scm-backend:$PREV_VERSION > /dev/null 2>&1; then
    echo "❌ Error: Imagen midelivery/scm-backend:$PREV_VERSION no encontrada"
    exit 1
fi

echo "✅ Imagen verificada"

# Realizar rollback
export VERSION=$PREV_VERSION
docker-compose -f docker-compose.$ENVIRONMENT.yml down
docker-compose -f docker-compose.$ENVIRONMENT.yml pull
docker-compose -f docker-compose.$ENVIRONMENT.yml up -d

# Registrar rollback
echo "📝 Registrando rollback..."
curl -X POST http://localhost:3002/api/deployments \
  -H "Content-Type: application/json" \
  -d "{\"version\":\"$PREV_VERSION\",\"status\":\"rollback\",\"rollbackFrom\":\"current\"}" \
  || echo "⚠️ No se pudo registrar rollback"

echo "✅ Rollback completado exitosamente"
