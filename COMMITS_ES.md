# Plantillas de Commits en Español

Este archivo contiene plantillas y ejemplos de mensajes de commit en español siguiendo la convención de commits.

## Tipos de Commit

### feat: Nueva funcionalidad

```
feat: agregar componente de búsqueda de hoteles
feat: implementar sistema de calificaciones con estrellas
feat: añadir carousel de imágenes para destinos
```

### fix: Corrección de errores

```
fix: corregir error en validación de formularios
fix: resolver problema de carga de imágenes
fix: arreglar navegación entre páginas
```

### style: Cambios de formato y estilo

```
style: mejorar diseño responsive del HotelFinder
style: actualizar colores y espaciado en tarjetas
style: optimizar layout para dispositivos móviles
```

### refactor: Refactorización de código

```
refactor: reorganizar componentes de administración
refactor: simplificar lógica de paginación
refactor: extraer hooks personalizados
```

### docs: Documentación

```
docs: actualizar README con instrucciones de instalación
docs: agregar documentación de componentes
docs: mejorar comentarios en código
```

### test: Pruebas

```
test: agregar tests para componente HotelFinder
test: implementar pruebas de integración
test: añadir tests unitarios para hooks
```

### chore: Tareas de mantenimiento

```
chore: actualizar dependencias del proyecto
chore: configurar eslint y prettier
chore: limpiar código comentado
```

## Comandos útiles

### Para usar aicommits

```bash
# Agregar archivos al staging
git add .

# Generar commit con IA en español
aicommits
```

### Para usar el script personalizado

```bash
# Hacer ejecutable el script
chmod +x commit-es.sh

# Ejecutar el script
./commit-es.sh
```

## Configuración de IA personalizada

Si usas GitHub Copilot o otra herramienta de IA, puedes usar este prompt:

```
Genera un mensaje de commit en español siguiendo estas reglas:

1. Usa la convención de commits: tipo(scope): descripción
2. Tipos válidos: feat, fix, docs, style, refactor, test, chore
3. La descripción debe estar en español
4. Máximo 50 caracteres para el título
5. Usa presente imperativo: "agregar" no "agregado"

Basándote en estos cambios: [pegar diff de git]
```
