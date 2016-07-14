# Diseño

## Introducción
El problema a tratar, como recordamos, se trata de un videojuego multijugador. Por las necesidades de persistencia y escalabilidad será imposible realizar una arquitectura P2P o mediante conexión directa entre los usuarios, solución común entre estos productos, por tanto, será necesario  desarrollar una **aplicación web**, con una arquitectura similar a una **cliente-servidor** (Figura 5.1).

![Arquitectura Cliente-Servidor](diagramas/client-server.png){width=80%}

Sin embargo, las necesidades particulares de latencia y la relativa complejidad del sistema dificulta la implementación sobre un sistema cliente-servidor común. En concreto, necesitaremos una comunicación bidireccional entre cliente y servidor, así como un mecanismo para actualizar periódicamente los datos del servidor.

## Arquitectura
Partiendo de la base cliente-servidor existente en cualquier aplicación web, adaptaremos cada parte de la arquitectura en base a las necesidades específicas del problema.

### Arquitectura del servidor
Dado el coste de las operaciones a realizar en un videojuego, es imprescindible tener en cuenta la distribución carga entre diversos servidores (_game servers_)[@ibm-arch]. Considerando, además, la complejidad del sistema optaremos por una **arquitectura orientada a servicios** (SOA).

Una SOA, divide el sistema completo en una serie de sistemas independientes (servicios) con bajo acoplamiento, de forma que un usuario u otro servicio pueda hacer uso de estos mediante una interfaz.

En una primera aproximación, se partió de un modelo de **microservicios**(Figura 5.2), en el que una aplicación es dividida en diversos servicios de forma transparente al cliente[@microservices][@microservices-mean]. Un desarrollo orientado a esta arquitectura favorece diversos factores:

* Modularidad: Una relativa independencia entre los servicios favorece un bajo acoplamiento del sistema, haciéndolo más fácil de desarrollar y mantener.

* Escalabilidad: Cada servicio resuelve una parte del problema de forma independiente, dividiendo el sistema en varias máquinas (escalabilidad horizontal), además, cada servicio puede ser desplegado y escalado con independencia del resto (escalabilidad vertical).

* Extensibilidad: Es posible añadir, eliminar o modificar cada microservicio con un impacto mínimo en el resto

* Especialización de los servicios: Cada servicio desarrolla una tarea concreta, haciendo uso de las herramientas mínimas necesarias para realizarla, con independencia de las herramientas usadas en otros servicios

![Monolítico vs Microservicio[@microservices]](diagramas/mono-micro.png)

Esta arquitectura, sin embargo, puede tener un impacto negativo en la **latencia** al realizar peticiones entre servicios. Por ello, en el sistema a desarrollar se va a tratar de eliminar servicios intermediarios, a costa de reducir la transparencia de la arquitectura al cliente, eliminando interfaces generales sobre los microservicios.

Cada microservicio poseerá su propia instancia de servidor, base de datos y podrá desplegarse y funcionar de forma independiente al resto. Se comunicarán entre ellos mediante un _middleware_ si fuera necesario.

Los distintos servidores (microservicios) se dividirán en dos zonas diferenciadas, aquellos que actúan directamente con el cliente (**front-end**) y aquellas que actúan únicamente con otros servicios ocultos al cliente (**back-end**), obtenemos así una arquitectura similar a una **DMZ**(Demilitarized Zone) (Figura 5.3).

![Arquitectura del servidor](diagramas/server_arch.png)

#### Servicios
La alta extensibilidad de esta arquitectura propicia futuros cambios en los servicios implementados, por tanto es previsible una variación en la lista de servicios a implementar, podemos dividirlos en servicios **front-end** y **back-end** dependiendo de si interactúan directamente con los clientes o no así como servicios **middleware** que proveerán la infraestructura necesaria para la comunicación entre los distintos servicios:

##### Front-End
Con el término front-end nos referimos a la parte "visible" del sistema, con el que realizará conexión directa desde el cliente:    

* **Servicio de Login y autentificación:** Se encargará de controlar la entrada de usuarios y su autentificación mediante distintos procedimientos (contraseña,redes sociales...) y el almacenamiento seguro de los usuarios en su base de datos.

* **Proveedor de cliente web:** Proporciona el cliente web y los recursos al usuario con el que conectarse al sistema. No poseerá ninguna lógica del sistema ni almacenamiento de datos

* **Interfaz de sockets/proxy:** Conexión directa con los clientes y enrutamiento a los servicios back-end apropiados, incorpora la principal capa de seguridad del sistema y almacenamiento en cache.

* **Servicio de mensajería:** Proporciona un servicio independiente de mensajería y notificaciones en el sistema, tanto entre usuarios como sistema-usuario.

##### Back-End
Nos referimos a los servicios _ocultos_ al cliente, comunicados únicamente con el resto de servicios del sistema:

* **Servidor de datos y sincronización:** Gestiona los datos del juego, tanto permanentes como dinámicos, gestionando el caché necesario y los back-ups a la base de datos.

* **Servidor de mundo:** Actualización y gestión del mundo y lógica del juego
    * **Servidores de juego:** En caso de un posible aumento en la envergadura prevista del servidor del mundo, se plantea la opción de crear además una serie de servidores de comunicados con el servidor de mundo que sincronizará con el servicio de datos y sincronización.

##### Middleware
La comunicación interna entre servidores se realizará mediante un sistema de cola de mensajes ligeros por su menor carga de red y mayor velocidad respecto a peticiones HTTP.

Aunque más pesada, algunos servicios pueden implementar una comunicación HTTP mediante sistemas de una API REST, bien sustituyendo o complementando el sistema AMQP, principalmente en aquellos casos en los que el servicio proporcionado pueda realizar tareas puntuales tanto con otros servicios del sistema como con clientes/servicios externos.

Este middleware se encontrará en un servicio externo, a través del cual se comunicarán las capas de _front-end_ y _back-end_.


#### Arquitectura del prototipo
Siguiendo la arquitectura anteriormente planteada, para el desarrollo del prototipo se procedió a la simplificación de los servicios desarrollados para obtener un producto funcional lo antes posible de acuerdo a la planificación propuesta anteriormente (Figura 5.4). Esta decisión no impide, posteriormente, aumentar el número de servicios dividiendo los existentes (una práctica muy común en el desarrollo orientado a microservicios).

En esta simplificación, se optó unificar los servicios del mundo en un único servicio y eliminar el proxy.

Además, de acuerdo al planteamiento inicial de la arquitectura, se optó por eliminar el _middleware_, reduciendo las comunicaciones entre servicios y usando directamente las API REST

![Arquitectura del servidor (prototipo)](diagramas/server_arch_2.png){width=80%}


#### Propuesta de trabajo futuro en el servicio de juego
Como parte de la arquitectura en servicios, se propone como evolución en el desarrollo implementar el servidor de juego como una arquitectura de microservicios compatible con el resto de servicios.

Esta propuesta trata de solventar el problema de escalar el sistema, siendo este servicio el principal cuello de botella del sistema. Al ser un sistema con gran cantidad de accesos y actualizaciones a la base de datos, una simple duplicación del servicio o una BD distribuida no permitirá escalarlo con al mismo nivel que el resto de servicios.

Por ello, se propone, adaptando la arquitectura clásica de los MMO, distribuir los datos del juego en múltiples instancias (concretamente, en ciudades), con una base de datos independiente. El servicio tendría un servidor principal, encargado de instanciar estos servicios y como punto de acceso (Figura 5.5). A diferencia del resto de arquitecturas MMO, los clientes, en lugar de acceder a un único servidor, podrán acceder directamente a múltiples servidores de juego (o ciudades) a la vez, permitiendo intercambiar datos y trabajar con la totalidad del sistema. Los propios servidores (u otros servidores especializados) podrán dedicarse a manejar los datos comunes entre los servidores de juego.

Con esta arquitectura, se prevé conseguir los mismos beneficios en escalabilidad que en el resto del sistema sobre los servicios principales, a la vez de reducir la latencia y el consumo de recursos en la actualización de los datos de juego (respecto a los recursos totales). También proporcionará una capa más de seguridad y fiabilidad sobre los propios servidores de juego y sus datos.

Esta arquitectura es producto de la división de la arquitectura actual, diseñada con el fin de facilitar este proceso. Sin embargo, esta arquitectura dificultaría el despliegue del sistema y no es adecuada para un prototipo.

![Arquitectura propuesta del servicio de juego](diagramas/game_arch_3.png){width=80%}

\newpage

#### Comentarios sobre la arquitectura del servidor
Se ha elegido esta arquitectura de microservicios en lugar de la llamada "_arquitectura monolítica_" de un servidor para proporcionar mayor escalabilidad y modularidad al sistema, una mejor integración con las tecnologías elegidas y con la metodología a desarrollar.

La gran cantidad de funcionalidades distintas a implementar y el uso de herramientas relativamente modernas y con poca experiencia en su aplicación es decisivo a la hora de la elección de esta arquitectura, pues será posible realizar cada funcionalidad de una forma sencilla y con las herramientas mejor preparadas para ella, además, permitirá incorporar otras tecnologías ya conocidas en donde sea posible. Mejorando enormemente la mantenibilidad del proyecto, extensibilidad futura y escalabilidad.

El uso de esta arquitectura, sin embargo, dificulta en gran medida el despliegue del servidor, aumenta la complejidad de este en conjunto, y puede afectar negativamente al rendimiento en conjunto.

### Arquitectura del cliente
El cliente actuará simplemente como una interfaz entre el usuario final y el sistema, por tanto, no resultará en un sistema complejo. La gran variedad de clientes distintos que es posible desarrollar hace imposible definir una arquitectura o diseño concretos, sin embargo, todos actuarán de acuerdo a un diseño común de interfaz y unas comunicaciones HTTP y websocket comunes (Véase Comunicaciones cliente-servidor), se definen a priori tres prototipos de clientes:

* **Cliente Web:** Ejecutado desde el servicio proveedor de cliente web, se compondrá de una página web dinámica, comunicada mediante peticiones HTTP (_AJAX_) y websockets con los distintos servicios.
* **Cliente escritorio:** Se compondrá de una interfaz completa (independiente del sistema o navegador web) que actuará de forma similar al cliente web, aunque eliminando algunas de sus limitaciones en cuestiones de rendimiento gráfico o almacenamiento permanente de datos.
* **Cliente móvil (Android):** Aunque actúe de forma similar a los otros, el cliente móvil presentara una mejor optimización en rendimiento y una interfaz adaptada a las capacidades de un móvil moderno, además, se propone una mejor integración con el sistema (notificaciones, sonidos etc...) propias de una aplicación de este tipo.

### Comunicaciones cliente-servidor
Debido a la variedad de clientes, y la posible incorporación de nuevos servicios, la comunicación entre los distintos servidores front-end y clientes se realizará mediante protocolos estándar. Concretamente se realizarán comunicaciones de dos formas:

* **Websocket:** Se usarán para comunicación bidireccional ligera entre cliente y servidor para acciones y actualización de datos en tiempo real. Se implementarán mediante la librería _Socket.io_[@socketio]

* **API-REST:** Algunos servicios implementarán una API-REST a la que un usuario o otro servicio se podrá conectar mediante peticiones HTTP estándar para hacer uso exclusivamente de dicho servicio, dentro o fuera de las del juego.

* **JWT**: El cliente almacenará un token con la estructura de un _JSON Web Token_[@jwt] donde se almacenará su id de usuario, lo que garantizará su acceso a los distintos servicios con su id única. Este token se podrá usar tanto con websockets como API-REST. (Véase Apéndice 3: Especificación de la API)

### Seguridad
Aunque la seguridad no es la prioridad del prototipo, cualquier servicio online debe poseer una capa de seguridad. Como resultado de la arquitectura diseñada, los puntos más vulnerables del sistema son los servicios comunicados con el cliente.

Los sistemas no comunicados directamente con clientes abordarán su seguridad mediante la implementación de _cortafuegos_ basados en _whitelist_ permitiendo únicamente comunicarse con los otros servicios.

El sistema de usuarios posee todos los datos sensibles de los usuarios, por tanto, su acceso a estos se realizarán mediante usuarios autenticados. La contraseña de los usuarios se almacenará encriptada mediante un _hash_.

La comunicación será mediante conexiones HTTPS y WSS durante la autentificación de usuarios, así como en cualquier acceso que requiera el envío del token _JWT_ para la identificación en los servicios.

Una prioridad en este tipo de juegos es evitar las trampas de los jugadores, aún con clientes no oficiales. Por ellos, todos los datos del juego son gestionados y comprobados únicamente por el servidor impidiendo realizar acciones ilegales.

## Diagramas de clase
A continuación, se exponen los diagramas de clases UML[@uml-class] de los módulos principales del sistema. Estos diagramas representan la estructura de objetos de los servicios de **usuarios** (Figura 5.6) y del sistema del **mundo** (Figura 5.7).
La arquitectura de objetos desarrollada finalmente en _JavaScript_ no es exacta a los diagramas aquí descritos pues dicho lenguaje no implementa _clases_ sino _prototipos_[@js-oop].

![Diagrama de clases del servicio del mundo](diagramas/class_world.png){width=80%}

![Diagrama de clases del servicio de usuarios](diagramas/class_users.png){width=50%}

\newpage


## Modelo de datos
Cada servicio poseerá su propio modelo de datos. Los servicios no compartirán ningún dato entre ellos, con la excepción de la **id de usuario**, de forma que se garantice una id común entre todos los servicios para un usuario concreto.

### Servicio de usuarios
El servicio de usuarios posee un modelo de datos sencillo, únicamente con la entidad **usuarios** con los siguientes atributos:   

* Id: Id única del usuario común a todos los servicios.
* Nombre: Nombre único de usuario
* Email: Correo electrónico único de usuario
* Contraseña: Hash+salt[@hashsecurity] de la contraseña del usuario

Todos los usuarios tienen una id,nombre y email únicos

### Servicio de juego
El modelo de datos del servicio de juego (Figura 5.8) consiste en los datos necesarios para modelar la lógica del juego (Capitulo 3: Diagramas de estado). Las entidades coinciden con los _roles_ y _recursos_ anteriormente definidos:    

* **Usuario:** Define los datos del usuario en el juego, con una id coincidente con la del _servicio de usuarios_
* **Producto:** Id y datos básicos de cada Producto
* **Ciudad:** Datos de cada ciudad, relacionados con los productos de dicha ciudad
* **Barco:** Datos del barco, relacionados con el usuario propietario y los productos que posee
    * **Modelo del barco:** Datos del tipo de barco, relacionados con cada barco de dicho tipo

![Diagrama del modelo de datos del servicio de juego](diagramas/er_diagram.png){width=90%}
