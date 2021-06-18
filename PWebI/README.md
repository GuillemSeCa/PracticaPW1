# Practica 1
## Projectes Web 1

Pràctica realitzada per Guillem Serra Cazorla (guillem.serra@students.salle.url.edu).

## Comentaris
Cal destacar que s'ha prioritzat funcionalitat abans de disseny a causa que en un inici
vaig perdre massa temps treballant tot el que no sigui la secció de content. I vaig decidir prioritzar les funcionalitats.

Durant la validacio del HTML (HTML Validator) es troba un error en el input de Dates a causa del pattern que he posat.
Aquest error el vaig comentar amb el Adrià, on li vaig explicar que en algunes fonts justificaven que anava bé perquè fos compatible amb molts sistemes operatius (en molts casos perquè el sistema operatiu sàpigues gestionar el input de date).

Destacar que el gràfic de barres del final he optat a mostrar-lo només quan se selecciona un sensor, ja que té més sentit que quan es mostrin tots seleccioni un sensor aleatori.
En el cas que es volgués fer d'aquesta manera simplement a la funció startSystem() es cridaria showBarChart() passant-li un widget (per exemple el primer).