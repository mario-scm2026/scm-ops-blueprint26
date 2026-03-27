# Catálogo de Configuration Items (Cls)

## Versión: 1.0
## Fecha: 2026-03-27

| ID | Nombre | Tipo | Descripción | Ubicación / Dueño | Versión |
|----|--------|------|-------------|-------------------|---------|
| CI-001 | Código Fuente Backend | Código | API REST Node.js/Express | GitHub: /backend | v0.1.0 |
| CI-002 | Código Fuente Frontend | Código | Aplicación React/Vite | GitHub: /frontend | v0.1.0 |
| CI-003 | Imagen Docker Backend | Artefacto | Imagen container API | Docker Hub: midelivery/scm-backend | v0.1.0 |
| CI-004 | Imagen Docker Frontend | Artefacto | Imagen container UI | Docker Hub: midelivery/scm-frontend | v0.1.0 |
| CI-005 | Docker Compose Dev | Configuración | Entorno desarrollo local | /docker-compose.dev.yml | v0.1.0 |
| CI-006 | Docker Compose Stage | Configuración | Entorno staging | /docker-compose.stage.yml | v0.1.0 |
| CI-007 | Docker Compose Prod | Configuración | Entorno producción | /docker-compose.prod.yml | v0.1.0 |
| CI-008 | GitHub Actions CI | Herramienta | Pipeline integración continua | .github/workflows/ci.yml | v1 |
| CI-009 | GitHub Actions Release | Herramienta | Pipeline releases | .github/workflows/release.yml | v1 |
| CI-010 | Variables Entorno | Configuración | Config por entorno | GitHub Secrets / .env.example | v0.1.0 |
| CI-011 | Secretos (Tokens) | Secreto | Docker Hub token, etc | GitHub Secrets | Activo |
| CI-012 | Documentación ADR | Documento | Decisiones arquitectónicas | /docs/adr/ | v1 |
| CI-013 | Base de Datos | Infraestructura | PostgreSQL (futuro) | Docker | Pendiente |
| CI-014 | Migraciones DB | Código | Scripts SQL versionados | /db/migrations/ | v0.1.0 |
| CI-015 | Runbook Operaciones | Documento | Procedimientos deploy/rollback | /docs/runbook.md | v0.1.0 |

## Notas
- Todos los Configuration Items están versionados en Git o en registry
- Los secretos nunca se almacenan en el repositorio
- Los artefactos son inmutables: cada versión tiene su tag
