# Análisis del problema
En este apartado realizaremos un análisis del problema a resolver y del prototipo a implementar

## Descripción inicial
Este proyecto desarrollará **Maelström**, un videojuego del género _multijugador masivo online_ de _estrategia_ y _simulador comercial_ en el que los jugadores tratarán de aumentar un capital inicial comerciando entre diversas ciudades y entre ellos.

En este género de videojuegos, consideramos un _mundo_ dinámico y persistente, continuamente activo en un servidor, accesible en cualquier momento por cualquiera de los jugadores. Aunque estos influyen en el mundo y en otros jugadores, tanto el estado del mundo como el de los propios jugadores cambia con independencia de que estén o no activos.

No es imprescindible por tanto la presencia de un jugador en el juego, sin embargo, este deberá conectarse a intervalos para realizar acciones con el objetivo de progresar. Generalmente estas acciones tardarán un lapso de tiempo real en cumplirse (minutos u horas), el jugador podrá seguir conectado o conectarse tras el paso de este tiempo para recibir los resultados de dichas acciones y comandar nuevas acciones.   

Ejemplos de acciones serían:   

* Construir un edificio
* Viajar de un sitio a otro
* Realizar una investigación o mejora
* Recolección de recursos

Además, la capacidad de interacción entre diversos usuarios permitirá la realización de acciones cooperativas o competitivas para alcanzar ventajas respecto otros jugadores (alianzas, guerras,...)

Para obtener más información acerca de la descripción del juego consultar el apéndice **Manual de Juego**

## Antecedentes e influencias
El proyecto Maelström guarda relación con dos géneros principales (MMO de estrategia y simulador económico), en concreto, recibe influencias de dos exitosos títulos:

* **Patrician III**[@patrician-wiki]: Principal influencia en la mecánica de juego, Patrician III es un exitoso videojuego de simulación comercial para un jugador.

* **Ogame**[@ogame-web]: Videojuego MMO de estrategia orientado a web, principal influencia en estética y patrones de interacción con los usuarios.

## Mecánica de juego
Comenzaremos describiendo las mecánicas básicas del videojuego[@game-mechanics] a desarrollar para aclarar el problema a resolver

* **Objetivo**   
El objetivo de los jugadores es aumentar su **capital** (dinero y recursos) en un ambiente competitivo para superar al resto de jugadores, para ello podrá tomar estrategias cooperativas o competitivas con estos además de aprovechar las reglas básicas de juego.

* **Recursos**    
    * _Dinero_: Recurso principal del juego, válido para intercambiar por otros recursos o comerciar con otros jugadores.
    * _Productos_: Los productos poseen un valor dependiente de la ciudad y cantidad de productos en esta, los jugadores podrán comprar y vender productos.
    * _Barcos_: Los jugadores podrán adquirir barcos, que les permitirá almacenar y transportar una cantidad limitada de productos entre ciudades. Cada barco tendrá una serie de atributos dependientes de su tipo
        * Nombre: dado por el jugador
        * Velocidad: velocidad a la que viaja el barco
        * Cargamento: Carga máxima de productos que puede almacenar
        * Precio: Coste de construir un nuevo recursos de este tipo

* **Roles**
    * _Jugador_: Jugador (humano) que poseerá una serie de recursos. Un jugador puede realizar una serie de acciones e interactuar con otros jugadores.
        * Construir barco: Intercambiará dinero por un recurso de tipo barco.
        * Comprar producto: Compra un producto de una ciudad a un barco.
        * Vender producto: Vende un producto de un barco a una ciudad.
        * Mover barco: Inicia el transporte de un barco de una ciudad a otra (acción que consumirá tiempo), el jugador podrá retornar el barco mientras esté en movimiento.
    * _Bot_: Poseerá las mismas reglas que un jugador, sin embargo, tendrá un comportamiento automatizado que añadirá un factor aleatorio al juego con independencia de los jugadores reales activos, no podrá interactuar directamente con otros jugadores.
    * _Ciudad_: Existen diversas ciudades en el mundo, en posiciones `[x,y]` cada una poseerá una serie de productos cuyos valores se actualizarán periódicamente. Los jugadores podrán interactuar con la ciudad. Cada producto de la ciudad posee unos parámetros:
        * Cantidad: Define la cantidad de un determinado producto en una ciudad (el máximo que un jugador podrá comprar), debe ser mayor o igual que 0.
        * Producción: Define la variación de cantidad de un producto, puede ser positivo o negativo.
        * Precio: Define el coste al que un jugador podrá comprar o vender un producto, depende del precio base de un producto, la cantidad y la producción en esa ciudad de dicho producto.
* **Reglas**
    * Los jugadores podrán comprar barcos si poseen el dinero suficiente.
        * El barco podrá ser creado en cualquier ciudad.
        * La construcción del barco requerirá tiempo.
    * Los jugadores podrán mover sus barcos de una ciudad a cualquier otra, para ello el barco deberá estar en dicha ciudad y no en movimiento.
        * Una vez el barco esté en movimiento, se encontrará en dicho estado hasta que el barco alcance su destino o el jugador elija cancelar el viaje.
        * El tiempo que tarde el barco en alcanzar su destino dependerá de la velocidad de este y la distancia con la ciudad origen.
        * El viaje no podrá ser realizado a la ciudad origen
        * Si el viaje es cancelado, el barco tardará el mismo tiempo que el tiempo de viaje transcurrido en volver a la ciudad, no se podrá realizar ninguna acción adicional hasta que el barco alcance el puerto origen.
    * Los jugadores podrán comprar productos de una ciudad si poseen el dinero suficiente, la ciudad posee cantidad suficiente y tienen al menos un barco en dicha ciudad con suficiente capacidad libre para almacenarlos
    * Los jugadores podrán vender un producto si poseen dicha cantidad en un barco en la ciudad seleccionada
    * Los jugadores no podrán comprar ni vender ni mirar precios de las ciudades en las que no haya al menos un barco amarrado
    * Los jugadores podrán comprar y vender productos entre ellos si al menos hay dos barcos en la misma ciudad

 \newpage

### Diagramas de estado
Los siguientes diagramas definen el comportamiento de los barcos (Figura 4.1) y del jugador (Figura 4.2) representando los posibles estados y transiciones entre estos a partir de las reglas antes definidas.

![Diagrama de estado de _barco_](diagramas/ship_state.png){width=80%}

![Diagrama de estado del _jugador_](diagramas/player_state.png)

\newpage

## Especificación de requisitos
Teniendo en cuenta el carácter experimental del proyecto, los requisitos obtenidos se basan en el análisis de proyectos similares a los comentados anteriormente, así como una serie de necesidades añadidas al prototipo deseado, por tanto, estos componen una lista preliminar de las características de este.

### Requisitos funcionales
Aquí exponemos los requisitos principales que definen la funcionalidad del sistema:

1. **Gestión de usuarios (jugadores):** El sistema permitirá una gestión de usuarios básica (_login_, _signup_, _logout_)
2. **Acción de usuarios:** El sistema aceptará la realización de diversas acciones de los usuarios registrados desde un software cliente
    1. **Construir barco:** El jugador podrá añadir un barco al sistema
    2. **Comerciar:** El jugador podrá comprar y vender productos entre un barco y una ciudad
    3. **Mover barco:** El jugador podrá mover un barco de una ciudad a otra si este se encuentra _atracado_
    4. **Cancelar viaje:** El barco volverá al puerto origen
3. **Acceso a los datos de juego:** El jugador deberá ser capaz de acceder a los datos actuales del juego de acuerdo a lo que necesite (recibir información a petición del usuario)
    1. **Información de eventos:** El jugador deberá recibir información sobre eventos a tiempo real
4. **Actualización de datos de juego:** Los datos de juego se deberán actualizar periódicamente de acuerdo a las reglas del juego
    1. Los barcos en movimiento deberán actualizar su estado
    2. La cantidad de productos de las ciudades deberá actualizarse de acuerdo a su producción y consumo
5. **Cliente web:** Un cliente web para acceder a todos los sistemas del juego

#### Requisitos secundarios

1. **Servicio de mensajería entre jugadores:** Los jugadores podrán mandarse mensajes entre ellos
2. **Bots automáticos:** Bots automáticos que sean capaces de interactuar con el sistema de forma autónoma de forma realista
3. **Cliente móvil:** Prototipo de cliente móvil

### Requisitos no funcionales
Aquí exponemos como requisitos no funcionales aquellas limitaciones impuestas por el tipo de problema a tratar y objetivos a conseguir en el prototipo

1. El sistema será accesible por clientes con independencia de la plataforma (por ejemplo móvil o web).
2. Algunos servicios del sistema requerirán identificación por parte de los usuarios registrados
    * La información de los usuarios será almacenada de forma segura mediante una contraseña encriptada.
3. La interacción deberá ser rápida y tener poca latencia. Se espera una reacción del sistema inferior a 500 ms para conseguir una interacción fluida. Minimizar la latencia es prioritario.
4. El sistema deberá ser **escalable** con el aumento de clientes. Se debe permitir más de 100 jugadores simultáneos, sin límite en el número de jugadores futuros.
5. El sistema deberá tener **tests** unitarios, de integración y de cobertura asociados:
    * Todo el sistema se encontrará en una plataforma de **integración continua** durante el desarrollo.
    * Los sistemas principales deberán poseer una **cobertura** de al menos un 70%.
6. Toda la tecnología aplicada deberá ser **open-source**, el prototipo igualmente deberá ser licenciado bajo una licencia libre.
7. El sistema deberá ser **portable**, pudiendo ejecutar instancias del servidor con independencia de la infraestructura.
8. El sistema debe evitar trampas por parte de los usuarios, garantizando que la información no puede ser vista ni modificada sin permiso.

## Descripción de casos de uso
Se exponen los casos de uso principales del sistema, correspondientes a las acciones del usuario con el sistema, definiendo el comportamiento normal y alternativo de cada acción. (Véase Diagramas de estado para más información sobre las posibles acciones de los usuarios en el juego).

**Sign Up**   

* Descripción: El usuario se registrará con sus datos en el sistema (nombre de usuario, email y contraseña).
* Precondición: El usuario no se encuentra registrado en el sistema.
* Postcondición: El usuario será registrado en el sistema con sus datos y se le asignará una id única.

|Jugador      |Sistema   |
|:----------|:---------|
|1. Cliente inicia acción de registro||
||2a. Registra al usuario en el sistema|
||3. Crea nuevo jugador|

_Curso alterno:_    

* 2b: Si el usuario se encuentra registrado o los datos son incorrectos no se continúa y se notifica del error al usuario.

**Login**

* Descripción: El usuario iniciará una sesión en el sistema.
* Precondición: El usuario se encuentra registrado en el sistema.

|Jugador      |Sistema   |
|:----------|:---------|
|1. Cliente inicia sesión||
||2a. Genera token de sesión y lo envía al usuario|

_Curso alterno:_    

* 2b: Si el usuario no se encuentra registrado o los datos son incorrectos no se continúa y se notifica del error al usuario.

**Consulta de datos de juego**

* Descripción: El cliente consulta datos del juego.
* Precondición: Usuario registrado si los datos son privados.

|Jugador      |Sistema   |
|:----------|:---------|
|1. Cliente inicia acción de consulta||
||2a. El sistema devuelve los datos|
|3. Cliente actualiza los datos||

_Curso alterno:_    

* 2b: Si la acción requerida es incorrecta se notificará al cliente.
* 2c: Si los datos están restringidos y el usuario no se encuentra identificado no se devolverán datos
* 2d: En caso de error, se notificará al usuario.

**Acción del juego**

* Descripción: El cliente realiza una acción en el juego (consultar _Diagramas de estado_).
* Precondición
    * Usuario registrado e identificado
    * Estado interno acorde a la acción requerida
* Postcondición: Estado interno del juego actualizado con los resultados de dicha acción.

|Jugador      |Sistema   |
|:----------|:---------|
|1. Cliente envía petición||
||2a. Comprueba el estado interno del juego|
||3a. Actualiza el estado interno|
||4. El sistema notifica al cliente|
|5. Cliente actualiza su estado||

_Curso alterno:_    

* 2b: Si la acción requerida es incorrecta o el usuario no se encuentra identificado se notificará al cliente y cancelará el curso de la acción.
* 2c: Si la acción es inválida, se cancelará y se notificará al cliente.
* 3b: Si ocurre algún error, se revertirán los cambios para volver al estado anterior, se notificará al cliente y se registrará la incidencia en un log.

**Actualización de datos**

* Descripción: El cliente se registra en el servidor para obtener unos datos a tiempo real.
* Precondición: Usuario registrado.

|Jugador      |Sistema   |
|:----------|:---------|
|1. Cliente inicia subscripción||
||2a. El sistema registra al cliente|
||3. El sistema envía datos actualizados|
|4. Cliente actualiza los datos||
||5a. Se repite 3. cuando los datos se actualizan|

_Curso alterno:_    

* 2b: Si no es posible establecer conexión, se rechaza la subscripción.
* 5b: Si los datos no se actualizan, espera a una actualización
* 5c: Si el cliente se desconecta, no se envían más datos

## Descripción de historias de usuario
El desarrollo de este prototipo contempla la siguiente serie de Historias de usuario (HU) a completar, agrupadas en 11 funcionalidades principales. Cada HU se dividirá en tareas con unos **Puntos de Historia** asignados[@hu-xp].

Cada punto de historia (**PH**) equivale a 1 hora de trabajo aproximada de un desarrollador _junior_ más tests, refactorización y solución de errores. Calcularemos un 25% extras para el desarrollo de tests y arreglo de errores más un margen de 10%, resultando en 1.35 horas aproximadas por PH.

1. Sistema de autentificación de usuarios
    1. Los usuarios se podrán registrar en el sistema con un **nombre de usuario**, **email** y **contraseña**
        * Base de datos: 4 PH
		* API CRUD: 3 PH
    2. Los usuarios podrán usar su nombre de usuario o email y su contraseña para iniciar sesión.
		* Base de datos: 2 PH
		* API: 2 PH
    3. Las identificación de usuarios será persistente entre sesiones.
		* Sistema de sesiones: 8 PH
		* Actualización de la API: 2 PH
    4. Las contraseñas se almacenarán encriptadas
		* Seguridad de contraseñas: 4 PH
    5. El registro de usuarios será independiente de la plataforma usada (cliente web, móvil)
		* Actualización de la API: 1 PH
		* Activación de protocolos CORS: 1 PH
    6. Los usuarios podrán modificar y eliminar sus datos.
		* API: 1 PH
		* Actualización de la funcionalidad: 2 PH
    7. Cada usuario poseerá una **id** única.
		* API: 1 PH
		* Sincronización de las Bases de datos: 4 PH
2. Ciudades
    1. Cada ciudad poseerá un **nombre** único y una lista de **productos**.
		* Base de datos: 6 PH
		* API: 4 PH
    2. Cada ciudad se encontrará en una **posición** determinada (coordenadas [x,y])
		* Base de datos: 2 PH
		* Cálculo de posiciones: 2 PH
		* API: 1 PH
    3. La ciudad poseerá una **cantidad** determinada de cada producto (mayor de 0), que se podrá modificar.
		* Base de datos: 8 PH
		* API: 3 PH
    4. La ciudad tendrá un valor de **producción/consumo** constante de cada producto, que modificará su cantidad periódicamente
		* Base de datos: 2 PH
		* API: 2 PH
		* Actualización de los datos: 10 PH
3. Jugadores
    1. Los jugadores se podrán identificar mediante una id de usuario (Relacionado con HU 1.2)
		* Base de datos: 2 PH
		* API: 1 PH
    2. Los jugadores poseerán una cantidad de **dinero** y una lista de **barcos**
		* Base de datos: 3 PH
		* API: 1 PH
		* Comunicación al cliente: 3 PH
    3. Los jugadores sólo podrán realizar acciones en el mundo del juego si se encuentran identificados
		* Identificación mediante token: 3 PH
4. Barcos del usuario
    1. Cada barco tendrá unas características básicas de acuerdo a su modelo de barco (HU 6.2)
		* Base de datos: 4 PH
		* Funcionalidad básica: 2 PH
		* API: 4 PH
    2. Cada barco tendrá, además, un **nombre** único para el usuario (un mismo usuario no puede tener 2 barcos con el mismo nombre) y una lista de **productos** (cada producto asociado a una **cantidad**).
		* Base de datos: 8 PH
		* Actualización de la funcionalidad: 3 PH
		* API: 2 PH
    3. La cantidad total de productos no podrá superar el valor de **carga máximo** del barco.
		* Actualización de la base de datos: 1 PH
        * Funcionalidad y validación de datos: 3 PH
    4. Cada barco se encontrará asociado a una **ciudad**.
		* Base de datos: 2 PH
    5. Un barco tendrá un **estado** asociado (amarrado, viajando) de acuerdo al diagrama de estado antes descrito con las reglas descritas.
		* Funcionalidad del objeto: 6 PH
		* Actualización de la base de datos: 2 PH
    6. Un barco podrá moverse entre las distintas ciudades si se encuentra amarrado. el tiempo del viaje dependerá de la posición de las ciudades. El **estado** del barco deberá actualizarse debidamente.
        * Funcionalidad básica del barco 2 PH
        * Actualización de los datos en tiempo real 2 PH
5. Modelos de barcos
    1. Cada modelo de barco poseerá un **nombre** único.
		* Base de datos: 1 PH
    2. El modelo asociará al barco unas características definidas (**vida, velocidad, carga máxima**).
		* Base de datos: 2 PH
		* API: 3 PH
    3. El modelo de barco tendrá un precio asociado.
		* Base de datos y API asociada: 2 PH
6. Implementación de compra/venta de productos
    1. Un jugador podrá comprar productos a una ciudad desde un barco, comprobando que el jugador posee dinero suficiente, hay suficiente cantidad de dicho producto en la ciudad, el barco se encuentra amarrado en la ciudad y hay espacio de carga suficiente en el barco
		* API: 1 PH
		* Funcionalidad básica de compra: 6 PH
		* Actualización de la BBDD: 5 PH
		* Validación de datos: 4 PH
    2. Un jugador podrá vender productos de un barco a una ciudad, validando que hay suficiente cantidad de dicho producto en el barco y el barco se encuentra amarrado en la ciudad.
		* API: 1 PH
		* Funcionalidad básica: 4 PH
		* Actualización de la BBDD: 5 PH
		* Validación de datos: 2 PH
7. Construcción de barcos
    1. El jugador crea un nuevo barco, validando que posee suficiente dinero (_precio_ del modelo)
		* Validación de datos: 2 PH
		* Actualización de base de datos: 2 PH
		* Funcionalidad básica: 5 PH
    2. El barco será creado en una ciudad
		* Base de datos y funcionalidad: 2 PH
8. Implementación de interfaz web
    1. La API (HTTP) será accesible para la consulta de los datos del juego y realización de acciones desde cualquier cliente válido.
		* API CRUD básica: 5 PH
		* Especificación de las peticiones: 4 PH
		* Actualización de seguridad (CORS): 2 PH
		* Especificación de las respuestas: 6 PH
	2. La API permitirá una comunicación bidireccional (_websockets_) entre cliente y servidor.
		* Especificación de la API: 5 PH
		* Gestión de eventos y mensajes: 5 PH
    3. Todas las operaciones de la API deberán ser aceptadas y sus datos validados
		* Identificación de las operaciones: 7 PH
		* Identificación de los datos: 6 PH
9. Implementación de cliente web
	1. El cliente web permitirá acceder a la funcionalidad del juego desde una interfaz
	    * Interfaz básica del usuario: 5 PH
		* Proveedor de cliente: 4 PH
		* Comunicación con la API: 4 PH
		* Identificación de acciones: 6 PH
		* Sincronización de los datos: 8 PH
	2. Los usuarios podrán ver los barcos, acceder a los datos de cada uno y realizar acciones sobre estos
		* Interfaz de lista de barcos: 5 PH
		* Datos del barco: 4 PH
		* Acciones del barco: 6 PH
	3. El usuario podrá ver un mapa y seleccionar ciudades para ver los datos o para seleccionar un destino
		* Interfaz del mapa: 8 PH
		* Acciones del mapa: 4 PH
	4. La interfaz del cliente permitirá recibir notificaciones y realizar acciones visuales sobre el juego, así como recibir datos de otros jugadores
		* Notificaciones: 3 PH
		* Diseño de la web: 6 PH
		* Datos de otros jugadores: 8 PH
    5. Los clientes podrán identificarse y registrarse desde el cliente web
        * Interfaz de registro: 4 PH
        * Interfaz de Identificación: 4 PH

### Historias de usuario de baja prioridad
1. Sistema de mensajería
    1. El sistema permitirá el envío de mensajes entre jugadores
		* Servidor: 4 PH
        * Funcionalidad básica: 3 PH
		* API: 2 PH
    2. Cada mensaje consta de un **autor**, **destinatarios**, **cabecera** y **cuerpo**
		* Base de datos: 5 PH
		* Validación de datos: 3 PH

2. Bot de juego
    1. Agentes reactivos capaces de acceder al sistema y jugar con el resto de jugadores mediante una IA básica.
		* Implementación básica del bot: 2 PH
		* Login al sistema: 2 PH
		* Interacción con el sistema: 6 PH
		* Sincronización de datos: 4 PH
    2. Las acciones de los agentes deberá ir acorde a las reglas de cualquier jugador, y su medio de acceso será similar al de resto de jugadores
		* Heurística del juego: 8 PH
		* Validación de datos: 3 PH

\newpage
### Análisis de HU

**Historias de Usuario de Alta Prioridad**

|Funcionalidad|HUs |PH   |Tests|Horas totales          |
|:-----------:|:--:|:---:|:---:|:---------------------:|
|1            |7   |35   |9    |47                     |
|2            |4   |40   |10   |54                     |
|3            |3   |13   |3    |18                     |
|4            |6   |42   |10   |57                     |
|5            |3   |8    |2    |11                     |
|6            |2   |28   |7    |38                     |
|7            |2   |11   |3    |15                     |
|8            |3   |40   |10   |54                     |
|9            |5   |79   |20   |107                    |
|Total        |35  |296  |74   |296*1.35=**400**       


**Historias de Usuario de Baja Prioridad**

|Funcionalidad|HUs |PH   |Tests|Horas totales          |
|:-----------:|:--:|:---:|:---:|:---------------------:|
|1            |2   |17   |4    |23                     |
|2            |2   |25   |6    |34                     |
| **Total**   |4   |42   |10   |42*1.35=**57**         


* **Historias de Usuario totales:** 39
* **PH totales:** 338
* **PH por HU media:** 8.6 PH

* **Horas Totales:** 338PH*1.35=**456 horas** aproximadas

Las Historias de Usuario planteadas y las tareas generadas a partir de ellas se usarán como guía del desarrollo del proyecto, el alto número PH resultante obligará a priorizar las funcionalidades principales pues se estima un número de horas de trabajo superior al tiempo disponible.

En concreto, se estiman 8 meses de desarrollo (**Noviembre** a **Junio**), lo que supone una carga media de 57 PH por mes (aunque se prevé un progreso no homogéneo, con mayor avance en los últimos meses). Si consideramos una carga de 8 horas semanales los primeros 4 meses y un aumento a 14 horas en los 4 siguientes, obtenemos un tiempo disponible de 320 horas para el desarrollo (aproximadamente un 70% de los estimado).

Para suplir esta falta de tiempo, se aplicarán los cambios en la planificación antes comentados, se simplificará en algunos aspectos el prototipo y se relajarán los tests a desarrollar (reduciendo el tiempo de implementación de estos). En caso de tener tiempo suficiente, se desarrollarán las funcionalidades secundarias y todos los tests. Con estas medidas, se espera obtener el prototipo requerido en el plazo disponible.

A esta estimación hay que añadirle aproximadamente 40~50 horas para redactar debidamente la documentación y gestión del proyecto, lo que supone una carga extra aproximada de 6 horas al mes fuera de la estimación de desarrollo.
