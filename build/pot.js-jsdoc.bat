@ECHO OFF
REM ---------------------------------------------
REM Create JSDoc Document for Pot.js / PotLite.js
REM ---------------------------------------------

SET CUR_DIR=%~dp0
SET JSDOC_DIR=%CUR_DIR%..\jsdoc_toolkit-2.4.0\jsdoc_toolkit-2.4.0\jsdoc-toolkit\
SET OUTPUT_DIR=%CUR_DIR%jsdoc-out

@ECHO Create JSDoc Document for Pot.js / PotLite.js
@ECHO.

CALL java -jar "%JSDOC_DIR%jsrun.jar" "%JSDOC_DIR%app\run.js" -a -s -t="%JSDOC_DIR%templates\jsdoc" -d="%OUTPUT_DIR%" "%1"

@ECHO Done.
@ECHO Output: %OUTPUT_DIR%
@ECHO.

PAUSE
EXIT /B 0
