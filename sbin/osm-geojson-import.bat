SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
echo *****************************************************************
echo import osm geojson
echo *****************************************************************

for %%f in (%OSMDIR%\*.gdoc.json) do (
    echo %%~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command loadGeoDoc ^
        --action loadGeoDocs ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --file %OSMDIR%/%%~nf.json ^
        --renameFileAfterSuccess true
)

cd %CWD%

