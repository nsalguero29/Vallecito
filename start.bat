@echo off
setlocal

:: Cambiar al directorio del proyecto (ajusta la ruta según sea necesario)
:: cd "C:\ruta\de\tu\proyecto"

:: Verificar si hay cambios en la rama origin/build
echo Verificando cambios en la rama origin/build...
git fetch origin build
git status

:: Comprobar si hay cambios
git diff --quiet origin/build
if %errorlevel% neq 0 (
    echo Hay cambios en la rama origin/build. Descargando cambios...
    git pull origin build
) else (
    echo No hay cambios en la rama origin/build.
)

:: Ejecutar npm install
echo Ejecutando npm install...
npm install

:: Ejecutar npm run start
echo Ejecutando npm run start...
start cmd /k "npm run start"

:: Abrir el navegador con la URL
echo Abriendo el navegador en http://localhost:3000/
start http://localhost:3000/

endlocal