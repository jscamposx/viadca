# Script para generar commits en español con IA
# Uso: .\commit-es.ps1

Write-Host "🤖 Generando mensaje de commit en español..." -ForegroundColor Blue

# Verificar si hay cambios en staging
$stagedFiles = git diff --cached --name-only
if (-not $stagedFiles) {
    Write-Host "❌ No hay archivos en el área de staging." -ForegroundColor Red
    Write-Host "Ejecuta 'git add .' para agregar archivos al staging area."
    exit 1
}

# Mostrar archivos que se van a commitear
Write-Host "📁 Archivos a commitear:" -ForegroundColor Blue
git diff --cached --name-only

Write-Host ""
Write-Host "🔧 Opciones para generar commit en español:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Usar aicommits con tipo específico:"
Write-Host "   aicommits -t 'conventional commit in Spanish'" -ForegroundColor Green
Write-Host ""
Write-Host "2. Commit manual siguiendo la convención:"
Write-Host "   feat: agregar nueva funcionalidad" -ForegroundColor Green
Write-Host "   fix: corregir error en validación" -ForegroundColor Green
Write-Host "   docs: actualizar documentación" -ForegroundColor Green
Write-Host "   style: mejorar diseño responsive" -ForegroundColor Green
Write-Host "   refactor: reorganizar componentes" -ForegroundColor Green
Write-Host "   test: agregar tests unitarios" -ForegroundColor Green
Write-Host "   chore: actualizar dependencias" -ForegroundColor Green
Write-Host ""

# Obtener el diff para análisis
$diff = git diff --cached
Write-Host "📝 Cambios realizados:" -ForegroundColor Cyan
Write-Host $diff

Write-Host ""
Write-Host "💡 Sugerencia: Copia los cambios y úsalos con GitHub Copilot o tu IA preferida" -ForegroundColor Magenta
Write-Host "Prompt: 'Genera un mensaje de commit en español para estos cambios siguiendo conventional commits'" -ForegroundColor Magenta
