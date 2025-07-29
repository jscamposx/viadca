function Commit-Spanish {
    param(
        [string]$Message,
        [switch]$All
    )
    
    if ($All) {
        git add .
    }
    
    if (-not $Message) {
        Write-Host "🤖 Analizando cambios para generar commit en español..." -ForegroundColor Blue
        
        # Verificar si hay cambios
        $stagedFiles = git diff --cached --name-only
        if (-not $stagedFiles) {
            Write-Host "❌ No hay archivos en staging. Ejecuta 'git add .' primero." -ForegroundColor Red
            return
        }
        
        Write-Host "📁 Archivos a commitear:" -ForegroundColor Cyan
        git diff --cached --name-only | ForEach-Object { Write-Host "  $_" -ForegroundColor Green }
        Write-Host ""
        
        # Analizar cambios
        $diff = git diff --cached --stat
        Write-Host "📊 Resumen de cambios:" -ForegroundColor Cyan
        Write-Host $diff
        Write-Host ""
        
        Write-Host "💡 Sugerencias de mensajes de commit:" -ForegroundColor Yellow
        Write-Host ""
        
        # Analizar tipos de archivos modificados
        $modifiedFiles = git diff --cached --name-only
        
        if ($modifiedFiles -match "\.md$") {
            Write-Host "📝 docs: actualizar documentación" -ForegroundColor Green
        }
        if ($modifiedFiles -match "\.(jsx?|tsx?|vue)$") {
            Write-Host "⚡ feat: implementar nueva funcionalidad" -ForegroundColor Green
            Write-Host "🐛 fix: corregir error en componente" -ForegroundColor Green
        }
        if ($modifiedFiles -match "\.(css|scss|sass)$") {
            Write-Host "🎨 style: mejorar diseño y estilos" -ForegroundColor Green
        }
        if ($modifiedFiles -match "package\.json") {
            Write-Host "🔧 chore: actualizar dependencias" -ForegroundColor Green
        }
        if ($modifiedFiles -match "test|spec") {
            Write-Host "🧪 test: agregar tests unitarios" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "Opciones:" -ForegroundColor Magenta
        Write-Host "1. aicommits -t 'conventional commit message in Spanish'" -ForegroundColor White
        Write-Host "2. git commit (usará el template en español)" -ForegroundColor White
        Write-Host "3. Commit-Spanish 'tu mensaje aquí'" -ForegroundColor White
        
    } else {
        # Verificar formato del mensaje
        if ($Message -notmatch "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+") {
            Write-Host "⚠️  El mensaje no sigue la convención. Formato esperado:" -ForegroundColor Yellow
            Write-Host "tipo(scope): descripción" -ForegroundColor White
            Write-Host "Ejemplo: feat: agregar nueva funcionalidad" -ForegroundColor Green
            Write-Host ""
            $confirm = Read-Host "¿Continuar de todos modos? (s/N)"
            if ($confirm -ne "s" -and $confirm -ne "S") {
                return
            }
        }
        
        git commit -m $Message
        Write-Host "✅ Commit realizado: $Message" -ForegroundColor Green
    }
}

# Alias para facilitar el uso
Set-Alias -Name ces -Value Commit-Spanish

Write-Host "✅ Función Commit-Spanish configurada!" -ForegroundColor Green
Write-Host "Uso:" -ForegroundColor Cyan
Write-Host "  Commit-Spanish                    # Analizar cambios y sugerir mensajes"
Write-Host "  Commit-Spanish 'feat: nuevo...'   # Commit directo"
Write-Host "  Commit-Spanish -All 'mensaje'     # Add + commit"
Write-Host "  ces 'mensaje'                     # Alias corto"
