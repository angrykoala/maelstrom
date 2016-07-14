# Introducción
Desde el comienzo del desarrollo y comercialización de los videojuegos ha existido el concepto de _Videojuego multijugador_, en referencia a aquellos juegos en los que múltiples jugadores (humanos) pueden jugar al mismo tiempo[@multiplayer-wiki].

Las redes de ordenadores permitieron aumentar la capacidad de los videojuegos multijugador, pasando de múltiples mandos conectados a una misma máquina, a distintas máquinas conectadas, pudiendo aumentar el número de jugadores de 2~4 hasta 64 jugadores simultáneos.

Este proyecto, sin embargo, se orienta al estudio de los _Videojuegos Multijugador Masivo Online_ (MMO), estos juegos buscan, como su nombre indica, permitir a cientos o miles de jugadores participar simultáneamente en una partida e interactuar entre ellos a través de una plataforma online[@mmo-wiki].

Estos productos suponen, aún hoy en día, un reto tecnológico al necesitar gestionar tal cantidad de clientes simultáneos en un mundo persistente, debido a esto, resultan en proyectos de gran magnitud, con una base tecnológica que requiere de una enorme infraestructura y recursos. Esto resulta en la aparición de pocos juegos con estas características, con poca variedad, y generalmente con unos resultados insatisfactorios debido a la escasez de tecnologías y software desarrollado en este ámbito.

A lo largo de esta memoria, se profundizará en las dificultades técnicas, las necesidades de estos productos para ser considerados viables, las soluciones técnicas desarrolladas y las aplicaciones de estas.

## Videojuegos MMO
Un juego se podría considerar MMO cuando un gran número (indeterminado) de jugadores pueden jugar simultáneamente. Generalmente, además, esto implica la existencia de un **mundo persistente**, es decir, que las partidas seguirán desarrollándose estén o no conectados los jugadores, manteniendo sus datos entre distintas conexiones.

Aunque un juego podría ser de cualquier género, la mayoría de videojuegos se encuentran en uno de estos dos géneros:

* **MMORPG**: Juegos de _rol_ o _acción_ en los que los jugadores interactúan en tiempo real en un entorno 2D o 3D. Por ejemplo _World of Warcraft_ (<http://eu.blizzard.com/games/wow>) o _Guild Wars_ (<https://www.guildwars.com>) corresponden a este género

* **MMO-RTS**: Comúnmente juegos basados en navegador o móvil, con gráficos simples, en el que el jugador interactuará con los elementos del juego a tiempo real y deberá esperar un determinado tiempo a que se completen las tareas que asigne, ejemplos de este tipo son _Ogame_ (<https://es.ogame.gameforge.com>) y _Clash of Clans_ (<https://play.google.com/store/apps/details?id=com.supercell.clashofclans>)

El prototipo propuesto para este proyecto consistirá en un MMO-RTS.

## Multijugador vs MMO
Debido a la ambigüedad de la definición, gran cantidad de videojuegos reciben el calificativo _multijugador masivo_ aunque su funcionamiento y mecánica básica no difiera de la de juegos multijugador estándar (partidas cortas con pocos jugadores), por ejemplo, juegos con integración social (chats, logros, mensajería) o juegos multijugador con diversas salas.

Este proyecto se centrará en soluciones MMO completas, que permitan una interacción real entre un número indeterminado de jugadores en una misma partida.
