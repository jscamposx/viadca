#!/bin/bash

# Script para generar commits en español con IA
# Uso: ./commit-es.sh

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Generando mensaje de commit en español...${NC}"

# Verificar si hay cambios
if [ -z "$(git diff --cached --name-only)" ]; then
    echo -e "${RED}❌ No hay archivos en el área de staging.${NC}"
    echo "Ejecuta 'git add .' para agregar archivos al staging area."
    exit 1
fi

# Mostrar archivos que se van a commitear
echo -e "${BLUE}📁 Archivos a commitear:${NC}"
git diff --cached --name-only

# Prompt en español para la IA
PROMPT="Genera un mensaje de commit en español basado en los siguientes cambios. 

Usa la convención de commits con estos tipos:
- feat: nueva funcionalidad
- fix: corrección de errores  
- docs: documentación
- style: formato y estilos
- refactor: refactorización
- test: pruebas
- chore: tareas de mantenimiento

El mensaje debe ser descriptivo pero conciso, en español.

Cambios realizados:
$(git diff --cached)

Responde solo con el mensaje de commit, sin explicaciones adicionales."

echo -e "${GREEN}✅ Configuración lista para commits en español${NC}"
echo -e "Ahora puedes usar: ${BLUE}aicommits${NC} o configurar tu herramienta de IA preferida."
