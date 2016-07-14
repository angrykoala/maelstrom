# Conclusiones y trabajos futuros
Al finalizar el proyecto, el producto resultante fue un _prototipo funcional_ de un videojuego multijugador masivo online, así como una memoria sobre este tipo de proyectos, las dificultades en su implementación y posibles soluciones. Además, se han estudiado temas relacionados con la programación web y sistemas distribuidos así como en la gestión de un proyecto de tamaño medio.

El prototipo desarrollado demuestra una arquitectura y un conjunto de tecnologías _viable_ para resolver el problema, permitiendo un desarrollo posterior. Finalmente, las primeras pruebas en despliegue demuestran un prototipo que cumple con los requisitos no funcionales del sistema, proporcionando un servicio eficiente y con una latencia mínima.

## Problemas encontrados
La escasa documentación y tecnologías existentes en el problema de los juegos multijugador masivos, además del desconocimiento de las tecnologías adecuadas para su desarrollo supuso un retraso en el tiempo total de desarrollo, al tener que solucionar _spikes_ y probar diversas opciones en prácticamente todos los ámbitos del proyecto. En general, los las principales dificultades radican en la arquitectura y la tecnología a aplicar:

* Arquitectura del servidor: Una arquitectura estándar no era suficiente para desarrollar este sistema y entre las arquitecturas distribuidas existían diversas opciones. Finalmente se optó por el híbrido entre una arquitectura orientada a servicios estándar un una arquitectura de microservicios especificada en el Capítulo 5.
* Tecnología del servidor: Era preciso una tecnología eficiente, ligera y que se adecuara correctamente a una arquitectura distribuida y a los estándares web modernos.
* Estructura de datos: La cantidad de modificaciones y actualizaciones sobre los datos del juego requerían de diversas capas de datos para mejorar la latencia y escalabilidad del sistema.
* Tecnologías del cliente: Existen diversas opciones para cliente del sistema, finalmente se optó por un cliente web, sin embargo, esto requería aprovechar las tecnologías existentes para desarrollar un cliente capaz de trabajar de forma asíncrona y con baja latencia.
* Técnicas de desarrollo: El desarrollo de un sistema con un cierto tamaño y complejidad requiere la aplicación de técnicas de gestión de proyecto (metodología ágil, testeo, repositorio único, etc.) aplicadas al problema especificado.
* Sesiones en un sistema distribuido: Fue necesario estudiar los mecanismos para mantener sesiones persistentes en un servidor distribuido.

Las soluciones expuestas en el desarrollo del prototipo resuelven o mitigan la mayor parte de estos problemas, lo que permitiría un desarrollo con un menor coste e incertidumbre al aplicarlas al desarrollo o mejora de nuevos productos.

## Conocimientos adquiridos
Durante el análisis y desarrollo de este proyecto, se han adquirido conocimientos en diversos ámbitos del desarrollo software aplicando tanto tecnologías ya conocidas como experimentando con opciones novedosas:

* Programación de aplicaciones web: Se han implementado un stack completo de aplicaciones web.
    * _Front\_End:_ Se han desarrollado interfaces de las aplicaciones mediante un conjunto de tecnologías web modernas para el desarrollo de clientes web como _Bootstrap_ y _React_.
    * _Back\_End:_ Implementación del lado servidor de una aplicación web, con especial énfasis en conseguir un sistema eficiente y con baja latencia mediante la implementación de servicios y APIs.
* Programación de sistemas distribuidos: Implementación y despliegue de un servidor distribuido y comunicación a tiempo real entre cliente y servidor mediante _websockets_.
* Bases de Datos: Desarrollo de bases de datos tanto relacionales (_MySQL_) como no relacionales (_MongoDB_) y análisis de diversas opciones para almacenamiento de datos.
* Gestión de proyectos software: Gestión de un proyecto de tamaño medio aplicando técnicas de desarrollo software y metodología ágil.
* Pruebas de Software: Desarrollo de tests automatizados sobre el software tanto estáticos como dinámicos.
* _DevOps:_ Aplicación de un flujo de desarrollo, testeo y despliegue automatizado junto con integración continua.

### Asignaturas relevantes
Este proyecto aplica los conocimientos adquiridos en diversas asignaturas tanto generales como de especialidad:

* Asignaturas de programación (fundamentos) y programación orientada a objetos.
* Bases de datos, estructuras de datos, diseño y desarrollo de sistemas de información.
* Desarrollo software, metodologías de desarrollo ágil y programación lúdica.
* Sistemas de información basados en web y desarrollo de aplicaciones de internet.
* Desarrollo de sistemas distribuidos, desarrollo basado en agentes, sistemas concurrentes y distribuidos.

## Trabajos futuros
Este prototipo, si bien resuelve los problemas antes mencionados, aún dista de ser un software listo para producción. Además, abre múltiples líneas de trabajo orientadas al desarrollo del videojuego completo y del framework final para su aprovechamiento en otros proyectos:

* Desarrollo de un microservicio para el servicio de juego: Cómo se indica en la arquitectura del servidor (Capítulo 5), se propone aplicar la arquitectura de microservicios específicamente sobre el servicio de juego, para mejorar la escalabilidad manteniendo la baja latencia actual.
* Mejora del aspecto visual del videojuego: El prototipo de cliente actual requiere de un mejor diseño gráfico e interfaz.
* Implementación de cliente para móvil y otras plataformas: El servidor actual posee la capacidad de gestionar el juego con independencia de la plataforma cliente, por lo que se recomienda desarrollar clientes específicos para móviles y escritorio.
* Encapsulamiento y generalización de la plataforma: Es preciso facilitar la reutilización de la plataforma, principalmente el servicio de juego, facilitando la adaptación de las reglas de juego.
* Implementación de otros servicios para extender funcionalidad: La arquitectura actual contempla el desarrollo de nuevos servicios (por ejemplo un servicio de chat o mensajería) para extender las capacidades del juego.

Una estimación preliminar índica un tiempo de desarrollo aproximado de 6 meses con un equipo de entre 3 a 5 desarrolladores para obtener una versión completa del producto, lista para producción.

### Posible comercialización
Tras un análisis del producto y las necesidades que resuelve, se encuentran dos posibles líneas comerciales del producto:

* Desarrollo y venta de videojuegos MMO: El sistema y tecnología actual permitiría obtener una fuente de ingresos vendiendo juegos (el modelo de negocio específico puede variar entre juegos). Esto requeriría un equipo de desarrollo de videojuegos permanente para continuar el desarrollo de la plataforma y el desarrollo de los videojuegos específicos.
* Desarrollo y venta del framework: Un modelo de negocio, posiblemente más lucrativo, aunque requeriría más tiempo para obtener ingresos, sería el desarrollo de un framework genérico de desarrollo, con estilo similar a frameworks cómo Unity (<https://unity3d.com>) o Unreal (<https://www.unrealengine.com>), con modelos de negocio similares, aunque orientado a videojuegos MMO y compatibles con estos frameworks.

Debido al elevado coste de desarrollo estimado, sería necesario aprovechar ambos modelos de negocio para obtener un negocio viable, además de aprovechar los videojuegos desarrollados como publicidad para el framework, se propone el desarrollo de un _Producto Mínimo Viable_ (MVP) a partir del prototipo ya realizado para reducir la incertidumbre en relación a la comercialización de este producto.
