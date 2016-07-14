# Planificación

Para el desarrollo del prototipo. Se aplicarán los principios de metodologías de desarrollo ágil[@agile-manifesto][@agile-methodologies], en concreto, se han adaptado los principios y prácticas de la metodología **Extreme Programming**[@xp] (XP).

## Principios ágiles
Se aplicarán la mayoría de principios y técnicas de la metodología XP[@xp-rules][@what-is-xp], obviando aquellos referentes al trabajo en equipo o que no posean relevancia en este proyecto:

#### Planificación
* Historias de usuario[@hu-xp]: Además de los casos de uso, se incorporarán HU a la documentación y planificación del prototipo para realizar una estimación y como _roadmap_[@roadmap] inicial del proyecto.
* Desarrollo iterativo: El proyecto se dividirá en iteraciones, cada una de estas se planificará con una serie de objetivos y tareas a cumplir, y se procederá a un análisis en retrospectiva de dicha iteración.

#### Diseño
* Mantener la funcionalidad al mínimo: Se busca un desarrollo rápido y un producto funcional temprano, aun con sólo las funcionalidades mínimas (**prototipado**).
* Desarrollo de _spikes_[@spike-xp][@spike-agile]: Se crearán productos mínimos (_spikes_) en conjunto con los prototipos para comprobar las posibles soluciones a los problemas de carácter técnico.
* Refactorización continua: Todo el código desarrollado será refactorizado iterativamente, procurando, no sólo ir añadiendo funcionalidad, sino actualizar y mejorar la calidad del código existente.

#### Desarrollo
* Desarrollo de tests: Se crearán tests unitarios y de integración que deberán validar la funcionalidad de todo el código antes de ser puesto en producción.
* Repositorio común de código: Todo el software desarrollado será añadido a un repositorio común.
* Integración continua: Todo el código subido al repositorio será desplegado y testeado automáticamente con cada cambio realizado.
* Codificación estándar: Se siguen unos patrones y nomenclaturas de programación estandarizadas a lo largo del proyecto para evitar inconsistencias.

## Planificación temporal
La planificación temporal planteada inicialmente propone iteraciones mensuales, correspondiendo la iteración 0 al mes de **Octubre**, siendo **Julio** la novena iteración y la correspondiente a una versión estable.

+--------+----------+-----------------------------------------+
|Versión |Iteración |Descripción                              |
+========+==========+=========================================+
|0.0.x   |0         |Descripción del ámbito del proyecto y análisis inicial|
+--------+----------+----------------------------------+
|0.1.x   |1         |Prototipo inicial de la arquitectura general del sistema, soluciones documentadas y prototipo del servicio de usuarios|
+--------+----------+----------------------------------+
|0.2.x   |2         |Desarrollo del servicio de usuarios y prototipo del mundo|
+--------+----------+----------------------------------+
|0.3.x   |3         |Prototipo _funcional_ del sistema, desarrollo de primer prototipo de cliente|
+--------+----------+----------------------------------+
|0.4.x   |4         |Análisis, prueba y corrección de errores, reinspección de los requisitos y desarrollo de tests, despliegue en web, versión _alpha_|
+--------+----------+----------------------------------+
|0.5.x   |5         |Incorporación de Funcionalidades básicas restantes y características secundarias|
+--------+----------+----------------------------------+
|0.6.x   |6         |Testeo, análisis de requisitos, desarrollo de tests, refactorización|
+--------+----------+----------------------------------+
|0.7.x   |7         |Incorporación de características secundarias, corrección de errores, diseño de documentación final|
+--------+----------+----------------------------------+
|0.x.y   |8         |Incorporación de características secundarias, corrección iterativa de errores, test del sistema completo|
+--------+----------+----------------------------------+
|1.x.y   |9         |Actualización del sistema, documentación,requisitos. Refinamiento del cliente, optimización y despliegue final del sistema|
+--------+----------+----------------------------------+

Cada iteración además, considera el siguiente ciclo:

1. **Análisis**: Se analizará las historias de usuario a completar en la iteración actualizar
2. **Implementación**: Implementación de las HU prioritarias y funcionalidad básicas
3. **Testing**: Desarrollo de tests para comprobar la funcionalidad
4. **Refactorización**: Refactorización de código e Implementación de requisitos secundarios
5. **Análisis retrospectivo:** Análisis retrospectivo de la iteración y generación de documentación parcial

La planificación descrita corresponde a la segunda versión de esta, propuesta en _Septiembre_ tras realizar el análisis del proyecto.

### Cambios en planificación
Debido a evolución del proyecto, la acumulación de retrasos y el trabajo irregular, se procedió a una serie de cambios en la planificación durante la iteración 5:

* Reducción del tiempo de las iteraciones: Se procedió a planificar iteraciones de entre 1 semana y medio mes
* Análisis del estado del proyecto, prioridad de las tareas y objetivos a cumplir
* División del proyecto y planificación en diversos sistemas: Se comenzó a planificar cada sistema y a desarrollarlo de forma independiente al resto.

Estos cambios, junto con algunos cambios en el desarrollo, mejoraron notablemente la evolución del proyecto, mejorando la velocidad de desarrollo y reduciendo el número de tareas de baja prioridad desarrolladas.

## Seguimiento
Aunque el desarrollo ha seguido la planificación descrita, para el seguimiento diario se hizo uso de las herramientas de desarrollo descritas en el capítulo 6, obteniendo diversas métricas útiles:

* **Commits:** Al haber usado un _sistema de control de versiones_, todos los cambios realizados son almacenados en forma de _commits_, permitiendo analizar los cambios en el código, llevar un historial y revertir cambios. Se han realizado más de **450 commits** en el repositorio a lo largo del desarrollo de este proyecto 
* **Tests de Integración:** Para cada _commit_, la herramienta de integración continua realiza los test implementados, garantizando que el código ya implementado y probado no se ha visto afectado por los nuevos cambios.
    * **Tests de Cobertura:** Además, se analizará la cobertura de código de los tests con cada commit, para poder verificar que los tests siguen siendo válidos.
* **Branches:** Para mantener la estabilidad del proyecto, el desarrollo de los módulos principales se separará en dos o más versiones (_Ramas_) en el sistema de control de versiones:
    * _Master:_ Es la rama principal del proyecto, corresponde a la versión estable
    * _Dev:_ Corresponde al desarrollo actual del proyecto, es una rama inestable (cambios constantes), es necesario que todos los tests en esta rama sean correctos antes de llevar los cambios a _master_ (proceso denominado **pull request**)
* **Issues:** Aunque las Historias de Usuario son la principal referencia en el desarrollo, se han generado _tareas_ de menor granularidad para gestionar y priorizar el desarrollo a corto plazo, así como medio para reportar _bugs_, el proyecto completo consta de más de **250 issues**, con más de 200 completados.
* **Milestones:** Los issues se agrupan en _hitos_, representando las versiones estables que se han ido lanzando. Generalmente corresponden a una iteración y una versión nueva (más información en el apéndice Versiones). Aunque no poseen una estructura fija y son determinados en cada iteración para proporcionar un seguimiento flexible de acuerdo a los principios de las metodologías ágiles. El proyecto cuenta con más de 20 milestones, incluyendo milestones actualmente abiertos.

Este seguimiento, además, se realiza de forma independiente para cada _servicio_ (Descritos en el Capítulo 5) como parte de los cambios de planificación realizados

### Documentación generada
Además de la documentación presentada, se fue generando documentación desechable para mejorar el seguimiento en cada iteración y proporcionar información general sobre el proyecto:

* **README.md:** Cada Servicio posee un archivo README en formato _markdown_ con una breve descripción del servicio en cuestión, una guía para instalarlo, desplegarlo y testearlo, así como información sobre el estado del servicio y licencia.
* **LICENSE:** Todos los Repositorios se encuentra con una copia de la Licencia _AGPL-3.0_ (Véase Apéndice Licencia).
* **Manual de la API:** Todas las apis de los servicios se encuentran documentadas para facilitar su uso. El apéndice _Especificación de la API_ recoge dicha documentación.
* **Manual de juego:** Con el fin de analizar y facilitar el uso del prototipo final, se redactó un manual de usuario (Apéndice Manual de Usuario).
* **Coverage report:** Los tests generan un análisis de cobertura automático para comprobar su validez.
* **Análisis de versiones:** Se proporcionará un índice de las versiones y algunas métricas para analizar la evolución del proyecto (Véase apéndice _Versiones_)

## Desarrollo abierto
De acuerdo a los objetivos del proyecto, todo el desarrollo será abierto, con todas las versiones, código y documentación publicadas bajo licencias de código abierto (Véase apéndice Licencias)

Se optará por la licencia **AGPL v3** pues posee las mismas características que una licencia GPL normal, en la que se obliga a una distribución libre de las obras derivadas, pero además incluye las obras en las que se haga uso del proyecto como servicio.

Para los recursos que no sean código (logotipo, documentos, etc...) se usará licencia **CC-by-sa**

Estas licencias se usarán en todo el proyecto salvo que se especifique lo contrario.
