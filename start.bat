@echo off
setlocal

:: Cambiar al directorio del script
cd /d "%~dp0"

:: Verificar si hay cambios en la rama origin/build
echo Verificando cambios en la rama origin/build...
git fetch origin build
git status

:: Comprobar si hay cambios
git diff --quiet origin/build
if %errorlevel% neq 0 (
    echo Hay cambios en la rama origin/build. Descargando cambios...
    git pull origin build

    :: Ejecutar npm install solo si hay cambios
    echo Ejecutando npm install...
    npm install

    :: Mensaje para invitar al usuario a ejecutar nuevamente el script
    echo.
    echo Las dependencias han sido actualizadas. 
    echo Por favor, ejecuta nuevamente este script para continuar.
    echo.
    pause
    exit /b
) else (
    echo No hay cambios en la rama origin/build.
)

:: Ejecutar npm run start si no hubo cambios
echo Ejecutando npm run start...
start cmd /k "npm run start"

:: Abrir el navegador con la URL
echo Abriendo el navegador en http://localhost:3000/
start http://localhost:3000/

:: Pausar para que la ventana permanezca abierta
echo.
echo Presiona cualquier tecla para cerrar...
pause

endlocal