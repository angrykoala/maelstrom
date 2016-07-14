## Versiones
Para poder gestionar el proyecto, se ha seguido una notación de versiones basadas _semantic versioning 2.0.0_[@semver] de tres números (major.minor.patch), cada servicio posee su propias versiones al tener un desarrollo independiente.

Al ser prototipos, todos los servicios se comenzaron a desarrollar bajo una versión 0, cada funcionalidad o hito generalmente corresponde a una versión menor (0.1), el número de patch se reserva para issues resueltos, bugs arreglados o cambios relevantes en el código dentro de la misma versión. A continuación se enumeran las principales versiones de cada servicio junto con algunas métricas del desarrollo:

* **LOC:** _Lines Of Code_, número de lineas de código (sin contar líneas en blanco, comentarios ni código de los tests)
* **Módulos:** Número de módulos (archivos JS en este caso)
* **Tests:** Número total de tests implementados
* **Cobertura:** Cobertura (en líneas) de los tests
* **Estado:** Estado del proyecto en esa versión (basado en funcionalidad implementada y tests)
    * No Funcional: El código no supera los tests o no funciona correctamente
    * Funcional: El código funciona, pero se encuentra con funcionalidad limitada o sin probar
    * En Pruebas: El código posee funcionalidad completa y se están desarrollando nuevos tests.
    * Estable: El código posee funcionalidad completa y probada, sin errores graves durante múltiples cambios
    * Inestable: Se encontraron errores o los test resultaron obsoletos en un código estable
    * Release: Versión estable apta para despliegue

\newpage 

### Servicio de usuarios
Última versión estable: **1.0.0**

|Versión|Fecha     |LOC |Módulos|Tests|Cobertura|Estado      |
|:-----:|:--------:|:--:|:-----:|:---:|:-------:|:----------:|
|0.0.1  |13/10/2015|72  |3      |0    |0%       |No Funcional|
|0.0.5  |26/10/2015|337 |6      |12   |87%      |No Funcional|
|0.1.0  |28/10/2015|339 |6      |13   |93%      |No Funcional|
|0.1.5  |15/11/2015|340 |6      |13   |96%      |Funcional   |
|0.1.6  |04/03/2016|357 |6      |13   |96%      |Funcional   |
|0.1.9  |28/04/2016|371 |6      |13   |93%      |En Pruebas  |
|0.2.0  |03/05/2016|375 |6      |13   |92%      |Estable     |
|0.2.1  |12/05/2016|375 |6      |14   |95%      |Estable     |
|0.2.2  |11/06/2016|385 |6      |14   |95%      |Estable     |
|1.0.0  |30/06/2016|385 |6      |14   |95%      |Release     |

### Servicio del mundo
Última versión estable: **0.8.1**

|Versión|Fecha     |LOC |Módulos|Tests|Cobertura|Estado      |
|:-----:|:--------:|:--:|:-----:|:---:|:-------:|:----------:|
|0.0.1  |28/10/2015|36  |1      |0    |0%       |No Funcional|
|0.0.17 |20/11/2015|626 |11     |11   |58%      |No Funcional|
|0.1.0  |20/11/2015|626 |11     |1    |58%      |En Pruebas  |
|0.1.4  |28/11/2015|645 |6      |29   |87%      |En Pruebas  |
|0.2.0  |08/12/2015|645 |6      |29   |38%      |No Funcional|
|0.2.9  |06/03/2016|624 |15     |1    |29%      |No Funcional|
|0.3.0  |10/03/2016|675 |15     |2    |40%      |No Funcional|
|0.3.6  |18/04/2016|897 |16     |22   |76%      |Funcional   |
|0.4.0  |02/05/2016|997 |17     |24   |73%      |En Pruebas  |
|0.4.4  |05/05/2016|1038|17     |25   |73%      |En Pruebas  |
|0.5.0  |10/05/2016|1116|18     |20   |64%      |Inestable   |
|0.5.4  |15/05/2016|1174|18     |29   |80%      |Inestable   |
|0.6.0  |15/05/2016|1175|18     |30   |80%      |En Pruebas  |
|0.6.4  |21/05/2016|1183|18     |31   |80%      |Estable     |
|0.7.0  |04/06/2016|1201|18     |31   |75%      |En Pruebas  |
|0.7.2  |09/06/2016|1211|18     |31   |79%      |Estable     |
|0.8.0  |11/06/2016|1226|17     |31   |79%      |Release     |
|0.8.1  |09/06/2016|1257|17     |32   |79%      |Release     |


![Evolución del desarrollo del servicio del mundo](plot/world.png)

### Servicio web
Última versión estable: **0.6.2**

|Versión|Fecha     |LOC |Módulos (JS) |Estado      |
|:-----:|:--------:|:--:|:-----------:|:----------:|
|0.1.0  |27/03/2016|240 |2            |No Funcional|
|0.2.0  |10/04/2016|967 |13           |Funcional   |
|0.2.3  |02/05/2016|973 |15           |En Pruebas  |
|0.3.0  |03/05/2016|976 |15           |En Pruebas  |
|0.3.5  |15/05/2016|1164|18           |Estable     |
|0.4.0  |15/05/2016|1204|18           |En Pruebas  |
|0.4.7  |21/05/2016|1206|18           |Estable     |
|0.5.0  |04/06/2016|1241|18           |Estable     |
|0.5.2  |09/06/2016|1289|19           |Estable     |
|0.6.0  |11/06/2016|1291|19           |Estable     |
|0.6.2  |26/06/2016|1330|19           |Release     |
|0.6.3  |08/06/2016|1371|20           |Release     |

### Bot
Para el desarrollo del bot se siguió la misma notación de versiones. Última versión estable: **0.1.1**

|Versión|Fecha     |LOC |Módulos |Estado      |
|:-----:|:--------:|:--:|:------:|:----------:|
|0.0.1  |19/05/2016|82  |4       |No Funcional|
|0.0.4  |02/06/2016|339 |9       |Funcional   |
|0.1.0  |08/06/2016|356 |9       |Funcional   |
|0.1.1  |08/06/2016|353 |9       |Estable     |


![Evolución del desarrollo de los servicios](plot/loc.png)

\newpage

### Diagrama de burndown
El diagrama de Burndown (Figura 8.3) del proyecto representa la cantidad de _Puntos de historia_ resueltas a lo largo del desarrollo de cada módulo. Este diagrama permite realizar un seguimiento en el desarrollo y comprobar la relación con las LOC (Figuras 8.1 y 8.2).

Como puede observarse en el diagrama, debido a los cambios en la planificación y la priorización de las tareas a completar (Véase Capítulo 3). Algunos servicios no se encuentran completados al 100% respecto a las Historias de usuario inicialmente planificadas.

![Diagrama de Burndown](plot/burndown.png)

\newpage
