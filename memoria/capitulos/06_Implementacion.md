# Implementación
La primera etapa de la implementación consistió en un extenso estudio de las herramientas apropiadas para el desarrollo e implementación del prototipo. La arquitectura diseñada permite el uso de tecnologías específicas para cada componente del proyecto, sin embargo, es necesario además tener en cuenta las tecnologías que permitan implementar dicha infraestructura.

Debido a la arquitectura orientada a servicios, la implementación de cada módulo se ha realizado independiente del resto, pudiendo realizar un mejor seguimiento de cada módulo.

## Estado actual del desarrollo
Siguiendo la planificación y arquitectura comentadas, el sistema actual consta de tres servicios principales desarrollados además del bot y el cliente de juego.

### Servidor
El lado servidor consta en la actualidad con 3 servicios, cada uno implementado como un servidor independiente.

#### Usuarios
* Repositorio: <https://github.com/demiurgosoft/maelstrom-users>
* Versión: 1.0.0
* Estado: Estable, en mantenimiento

El sistema de usuarios gestiona los datos de usuario así como los procesos de alta, baja e identificación de usuarios. El sistema almacena un _hash_ de las contraseñas mediante el algoritmo _bcrypt_ basado en el cifrado _Blowfish_.

El acceso al sistema se realiza mediante una _REST API_. El sistema proporcionará al cliente un _token_ basado en la tecnología _JSON Web Token_ a modo de identificación en el sistema, permitiendo el acceso de un usuario identificado al resto de servicios del sistema.

La arquitectura modular y el bajo acoplamiento con el resto de servicios permiten una completa reutilización del servicio con cualquier arquitectura similar.

#### Mundo
* Repositorio: <https://github.com/demiurgosoft/maelstrom-world>
* Versión: 0.8.0
* Estado: En Pruebas

El sistema de mundo posee la lógica del juego principal, así como los datos del juego. Es posible acceder a los datos y realizar acciones mediante la API. Además, una implementación paralela de comunicación mediante _websockets_ permite la actualización a tiempo real de algunos datos del juego.

Los datos de cada jugador solo serán accesibles por este. El sistema funciona completamente por su API, con independencia del cliente usado. El propio servidor del mundo implementa el bucle principal de juego, que actualizará los datos a intervalos de 1 segundo.

También este servicio implementa la cache de los datos para reducir la latencia y la comunicación con la base de datos redundante para almacenar los datos del juego en caso de fallo en el servidor.

Este sistema es con diferencia el más complejo y de mayor tamaño. Se prevé dividir el sistema en diversos servicios mediante una arquitectura de _microservicios_ en posteriores iteraciones (Capítulo 5).

#### Servidor web
* Repositorio: <https://github.com/demiurgosoft/maelstrom-web>
* Versión: 0.6.2
* Estado: En Desarrollo y pruebas

El servidor web proporciona el cliente web, así como todos los recursos del juego. No contiene base de datos ni implementa ninguna lógica. Su función es proporcionar los recursos para reducir la carga del resto de recursos.

Este servidor actualmente sólo proporciona el cliente web, pero podría usarse como punto de actualización al resto de clientes, compartiendo los recursos comunes entre todos los clientes. También es usado para proporcionar un punto de acceso al sistema único, de forma que el acceso a toda la arquitectura de servicios subyacente sea transparente al usuario final.

### Cliente
El sistema permite el uso de cualquier tipo de cliente con diversas tecnologías, para el prototipo se desarrolla un _cliente web_ y un _bot_ que actúa como cliente automatizado.

El sistema no prevé ninguna lógica en el cliente, y todos los datos son actualizados desde los servidores. Sin embargo, el sistema cliente puede contener cierto control sobre las acciones del usuario para evitar peticiones inválidas al servidor, reduciendo las peticiones totales y mejorando la experiencia del usuario.

#### Cliente web
El cliente web consiste en una página web desarrollada con Html 5, CSS y JavaScript. Además de una serie de frameworks (Bootstrap, React, EJS, JQuery,...) con el objetivo de concentrar toda la funcionalidad de una página única, evitando recargas de página innecesarias reduciendo la latencia en las acciones del jugador.

Al ser un cliente que no debe recargar páginas, para actualiza su estado se hace uso de peticiones _AJAX_ a la API del servidor y _websockets_ para recibir datos a tiempo real. El resultado es un cliente que no sobrecarga el servicio de juego al no necesitar ni recursos ni realizar peticiones _AJAX_ innecesarias proporcionando una latencia mínima para un servicio web.

### Bots del juego
* Repositorio: <https://github.com/demiurgosoft/maelstrom-bot>
* Versión: 0.1.1
* Estado: En Desarrollo y pruebas

Maelström implementa bots a modo de clientes del sistema, haciendo uso de sistema bajo las mismas reglas que cualquier cliente. El servidor no diferencia entre humanos y bots.

El objetivo de estos bots es proporcionar unos agentes de juego fuera del control humano y probar el sistema bajo condiciones de uso realistas.

Un bot de juego consiste en un agente automático que realizará acciones con el juego principal haciendo uso de la API de este. Toda la información será recibida a través de esta misma API. Por tanto, toda la información del bot y su rango de acciones se encuentran en el mismo plano que las de los jugadores normales.

El bot será capaz de actuar de acuerdo a las reglas del juego de una forma razonable para intentar ganar, aunque **no** óptima, pues el objetivo es emular un jugador humano, por lo que se ha añadido una cierta aleatoriedad a sus acciones, aunque siempre dentro de las operaciones que le proporcionarán ventaja en el juego.

Por simplicidad en la implementación, se ha implementado con **JavaScript** y **Node.js** acorde con el resto del proyecto. El bot implementa además su propio cliente para acceder a la API del juego, por lo que no necesitará el _cliente web_ de Maelström.

El bot es capaz de consultar y actualizar todos los datos de juego relevantes, es decir, los datos "públicos" del juego (ciudades y modelos de barco) así como sus datos de jugador (barcos, productos y dinero).Igualmente, es capaz de identificarse automáticamente en el sistema con el usuario indicado en su fichero de configuración. No posee la capacidad de crear nuevos usuarios para evitar un uso indebido del bot.

```JavaScript
{
    username: "marvin",
    password: "dontpanic42",
    email: "marvin@bot.com"
}
```
_Configuración del usuario para el bot_

El bot se comunica únicamente mediante peticiones HTTP a la API de los servicios a intervalos regulares (por defecto _3 segundos_) para actualizar sus datos internos y realizar acciones. En caso de un error en la conexión el bot intentará actualizar su estado interno y dejará de realizar acciones hasta conseguirlo.

El bot además, tratará de realizar únicamente acciones válidas, aunque no garantizará que lo sean, pues es el servidor el que validará estas acciones (al igual que con el resto de jugadores).

El servidor no diferenciará entre bots y jugadores humanos, por tanto, es posible entrar al sistema con los datos de un bot y realizar acciones con dicha cuenta. Igualmente, un bot puede tomar el relevo a un jugador humano en cualquier momento. Los datos del bot se actualizarán siempre con los datos actuales del servidor, permitiendo al bot jugar en cualquier momento con cualquier usuario, incluso a la vez. También es posible usar múltiples bots distintos a la vez.

#### Heurística
El bot consiste en un _agente reactivo_ que actuará de acuerdo al estado que reciba del servidor. El agente actualizará su estado, comprobará las acciones posibles a realizar y las ejecutará a intervalos regulares.

El bot puede realizar las siguientes acciones en caso de cumplir las condiciones:

* **Login:** Identificarse en el sistema con el usuario proporcionado al comienzo de la ejecución.
* **Actualizar mapa y modelos de barco:** El agente pedirá la información general del juego al servidor.
* **Actualizar barcos del jugador y dinero:** El agente puede pedir información al servidor del su estado como jugador si se encuentra identificado en el sistema.
* **Construir barco:** El agente construirá un barco de un **modelo aleatorio** válido (con un precio menor al dinero que posee el jugador) si:
    * El agente tiene más dinero que lo que cuesta el barco más barato.
    * El agente no tiene ningún barco o tiene 3 veces más de dinero que el barco más barato.
* **Comprar productos:** El agente comprará 10 unidades de cada productos de una ciudad si:
    * El barco se encuentra amarrado.
    * Hay más de 20 unidades de dicho producto y la producción es positiva en la ciudad.
    * El agente **no** tiene en cuenta ninguna limitación en las reglas del juego para la compra de productos (simplemente el servidor no las ejecutará).
    * El agente **no** comprará ni más ni menos de 10 unidades de un producto determinado de golpe, para favorecer la compra de diversos productos en lugar de uno solo.
* **Vender productos:** El agente venderá 10 unidades de cada producto desde un barco a una ciudad si:
    * El barco se encuentra amarrado.
    * Hay menos de 2 unidades de dicho producto en la ciudad y la producción en negativa.
    * Hay al menos 10 unidades de dicho producto en el barco.
* **Mover barco:** El agente moverá un barco **después** de vender y comprar productos a una ciudad aleatoria (distinta a la actual) si el barco se encuentra amarrado.


Las acciones de comprar y vender productos se realizan para cada barco amarrado y cada producto. Mover barco se realizará después para cada barco amarrado. Para los barcos en movimiento no se realiza ninguna acción.


## Lenguajes y herramientas
Las siguientes tecnologías se eligieron como principales tecnologías para el desarrollo del sistema.

### Servidor
* **Node.js:**[@node][@node-up] Entorno de ejecución JavaScript orientado al desarrollo de servidores web. 
    * **Alternativas:** Se planteó el uso de **Python** como principal alternativa, sin embargo, se optó por Node.js al usar un lenguaje conocido (_JavaScript_), su eficiencia y su orientación a servicios de tiempo real. Se tuvo en consideración Python+Django para el servicio proveedor de web, al ser una herramienta adecuada, pero al tener experiencia con Node.js se optó por realizar todos los servicios con dicho lenguaje.
* **Express:** Principal framework para el desarrollo de servidores en Node.js
* **MongoDB:** Por velocidad e integración con _JavaScript_ se optó por MongoDB como principal base de datos del sistema, aunque esto no limita el uso de otras bases de datos en ciertos servicios
    * **Mongoose:** Herramienta de modelado de objetos para MongoDB, proporcionando una capa extra de abstracción e integridad de la base de datos mongo
    * **MySQL:** Opción planteada para aquellos servicios que requieran una base de datos relacional
* **RabbitMQ:** Framework del protocolo de colas de mensajes _AMQP_, planteado para las comunicaciones entre servicios, permitiendo diversos patrones (balanceo de carga, publish-subscribe,...) de comunicación eficiente y fiable.
* **Redis:** Almacenamiento estructurado de datos en memoria, útil como cache en memoria de la base de datos para reducir latencia.
    * **Alternativas:** **LokiJS** proporciona un mecanismo simple de base de datos en memoria con backup a un archivo **JSON**, sin embargo, no parece una opción apropiada para un sistema complejo que pueda requerir escalar.

### Cliente
* **Html 5:** Se aprovecharán las especificaciones de Html 5 para desarrollar el _cliente web_ principal
* **JavaScript:** Como es habitual, la lógica del cliente web se desarrollará sobre JavaScript
    * **JQuery:** Se usará JQuery como framework de JavaScript para el cliente
    * **AJAX:** Se usará AJAX para realizar peticiones HTTP asíncronas.
* **EJS:** Lenguaje de plantillas basado en Html y JavaScript. Usado para generar el código Html en el servidor
* **React:** Se aprovecharán los componentes de React para generar código dinámico y reutilizable en el cliente.
    * **JSX:** Se hace uso de la extensión JSX de JavaScript para generar el código de React.
        * **Babel:** Se usará el intérprete babel para generar código js a partir del código JSX de React mediante Browserify.
* **Bootstrap:** Framework de Html, CSS y js para crear páginas _responsive_ adaptadas a móvil.
* **Otras Alternativas:** Al ser un servicio sin un cliente definido, es posible desarrollar clientes en diversas plataformas, en concreto se plantearon otras tecnologías como clientes:
    * **Android:** Una aplicación móvil nativa (desarrollada con **Java**) y conectada por HTTP y Websockets.
    * **Unity:** Motor de desarrollo de videojuegos, permitiría el desarrollo de una aplicación cliente tanto para móvil como para escritorio.

###Comunicación
* **Api Rest:** A partir del protocolo HTTP estándar, se crearán Apis _Restful_ para conectar el cliente con el servidor  mediante **AJAX**, **supertest** o cualquier cliente HTTP.
* **Socket.io:** Framework para el uso de **Websockets** que proporciona una capa de abstracción sobre esta tecnología, permitiendo una comunicación bidireccional entre clientes y servidor a tiempo real
    * **Alternativas:** Se eligen Websockets sobre **WebRTC** o **UDP** al ser un protocolo orientado a la comunicación fiable en tiempo real de mensajes planos.
* **Json:** Se usará Json como estructura de datos para mensajes planos entre cliente y servidor, al ser relativamente eficiente y tener fácil integración con JavaScript tanto en cliente como servidor).
    * **Alternativas:** **XML** ofrece una estructura más compleja, a costa de mayor tamaño en los mensajes y necesitar código _parser_ extra tanto en cliente como servidor.
* **JWT:** Se usarán los _Json Web Tokens_ como token entre cliente y servidor, que garantice la identidad del primero al hacer uso de los servicios[@jwt].
* **CORS:** Cross-Origin Resource Sharing, el uso de servicios independientes requerirá una configuración en el sistema que permita la conexión con distintos dominios de origen[@cors-setup].


### Herramientas de desarrollo
Para ayudar al desarrollo de proyecto se eligió un conjunto de herramientas. Estas herramientas favorecen un desarrollo ágil, abierto, y de acuerdo a la metodología especificada en el Capítulo 4. Aunque se hayan seleccionado estas herramientas, el desarrollo no se encontrará limitado únicamente a estas.

* **GitHub:**[@github] Repositorio basado en **Git**[@git][@pro-git] donde se alojará el código y se realizará un seguimiento del desarrollo usando sus herramientas:
    * **Issues & Milestones:** Se aprovecharán los issues y milestones de GitHub para llevar a cabo la planificación a corto y medio plazo del proyecto mediante una metodología basada en _tareas_
    * **GitHub Pages:** La información extra del proyecto se creará en una página alojada en GitHub para proporcionar información actualizada al público.
    * **Alternativas:** GitLab, repositorio basado en git similar a GitHub, aunque menos conocido. Se elige GitHub por ser un _estándar de facto_ en proyectos libres.
* **Travis CI:**[@travis-ci] Servicio de integración continua conectado con GitHub. Automatiza los procesos de integración y testeo del código.
    * _Alternativas:_ Jenkins.
* **Npm:** Gestor de paquetes de Node.js, además de servir de herramienta principal de despliegue.
* **Atom:** Editor libre de texto usado preferentemente para el desarrollo del código aunque no exclusivamente
    * Se ha optado por el uso de un entorno simple y libre, en lugar de un IDE completo que pueda limitar la portabilidad del proyecto.
* **Markdown:** Lenguaje de marcado usado para generar la documentación y recursos de texto.
* **Browserify:** Herramienta para generar paquetes de código JavaScript para cliente.
* **Js-Beautify:** Herramienta para indentación automática del código en JavaScript, garantizando un estilo limpio y coherente.

#### Herramientas de tests
Las herramientas a continuación fueron usadas para el proceso de testeo del software (Capítulo 7) con el objetivo de garantizar su calidad y funcionalidad.

* **Mocha:**[@mocha-official] Módulo para desarrollo de tests unitarios y de integración para Node.js.
    * **Chai:** Módulo de aserciones usado junto con mocha para los tests.
    * **Supertest:** Módulo de tests de peticiones HTTP, usado para probar la API
* **Istanbul:** Módulo para realización de tests de cobertura.
* **Coveralls:** Servicio automático de análisis de cobertura, con integración con GitHub y Travis. Este servicio permite un análisis continuo de la cobertura de los tests, como parte de la integración continua del software.
* **JsHint:** Herramienta para detección de errores y análisis de la calidad del código en JavaScript.
* **BitHound:** Servicio online para comprobar calidad de código y análisis de dependencias de un repositorio.
    * **Alternativas:** Code Climate, Gemnasium.
* **Cloc:** Análisis de las líneas de código del proyecto.

## Pruebas
Siguiendo las prácticas planteadas en el Capítulo 3, se desarrollaron un conjunto de tests y comprobaciones automatizadas en el proceso de integración y despliegue. Estos tests no solo comprueban la funcionalidad en un momento dado, sino que son reescritos, mejorados y ejecutados a lo largo de todo el proyecto.

### Pruebas dinámicas
Las pruebas dinámicas consisten en pruebas ejecutando el código. Todos los tests dinámicos son implementados en la carpeta `test` de cada servicio y pueden ser ejecutados con `npm test` o las indicaciones dadas en el servicio en cuestión.
Todos los tests dinámicos han sido desarrollados para no interferir con los datos o ejecución normal del sistema, trabajando con direcciones, datos y servicios de prueba. Esta configuración se define en los _archivos JSON_ en la carpeta `test/config`.

Los tests dinámicos han sido desarrollados con la suite de tests _mocha_[@mocha-official], y las librerías _supertest_ y _chai_. Cada test posee una estructura divida en:

* **Test Case:** Definidas con la palabra `it`, definen un test independiente, que no debe afectar al resto del sistema ni tests. La configuración se reinicia con cada caso.
* **Suite:** Definidas con una palabra `describe` cada suite representa un conjunto de _tests cases_ sobre un módulo o funcionalidad. Cada suite cargará los módulos y dependencias necesarias e inicializará los parámetros de los tests, así como gestionar su ejecución.

```JavaScript
describe('Test Suite', function() {
    beforeEach(function(){
        //configuración inicial de cada test case
    });
    afterEach(function(){
        //Limpieza del test anterior
    });
    it('Test Case',function(){
        //Test
    });
    it.skip('Test Case 2',function(){
        //Test no ejecutado
    })
});
```
_Estructura de una suite de test en Mocha_

La ejecución de cada _test case_ puede producir 3 resultados:
* **Pass:** Test superado correctamente.
* **Fail:** Test fallado.
* **Skip:** Test no ejecutado. Estos tests, marcados con la palabra `skip` en el código, representan tests planificados u obsoletos que deben ser reprogramados. 


#### Tests unitarios
Cada módulo de código se desarrolla junto con una serie de pruebas que garanticen su funcionamiento con independencia del resto del sistema. Estos tests se desarrollan en conjunto con el módulo en cuestión, y es preciso que el software apruebe los tests antes de proceder a la integración de dicho módulo en el control de versiones.

Para el desarrollo de los módulos de servidor principales, se ha desarrollado una _suite_ de tests unitarios para cada módulo. Consideramos por módulo un bloque de código relevante que es gestionado mediante dependencias de acuerdo al estándar en Node.js y npm[@npm-package].

El objetivo de estos tests es garantizar códigos sin _bugs_ y probar los casos extremos de dicho código. Así como facilitar rastrear los fallos y los cambios en el código.

#### Tests de integración
Se desarrollarán además _suites_ orientadas a probar funcionalidad completa del sistema. Generalmente ejecutando múltiples módulos de código o levantando el subsistema completo (**Pruebas de Sistema**). Estos tests se desarrollan con las mismas herramientas que los tests unitarios. Los tests de integración deberán desarrollarse después de los tests unitarios con módulos ya probados individualmente. El objetivos de estos tests, sin embargo, se orienta a garantizar un correcto acoplamiento de los distintos módulos y un funcionamiento correcto en casos de uso reales.

#### Pruebas de cobertura
Al desarrollar tests automatizados, es imprescindible analizar si estos tests realmente representan el código que están probando, y si lo siguen representando tras varias iteraciones.

Los tests de cobertura, son tests automáticos generados con la herramienta _Istanbul_[@istanbul] al ejecutar los tests unitarios y de integración. Los tests de cobertura analizan la cantidad de código probado (_cobertura del código_[@test-coverage]).

Para analizar la cobertura se toman 4 parámetros:

* Líneas: Porcentaje de lineas del programa ejecutadas en los tests, es el índice principal usado para analizar la cobertura.
* Funciones: Porcentaje de funciones ejecutadas.
* Ramas: Porcentaje de posibles flujos de del programa ejecutados (por ejemplo, si un condicional `if` a sido verdadero y falso).

Este análisis resulta en un informe detallado de la cobertura del código (Figura 6.1).

![Análisis de cobertura del servicio de usuarios](imagenes/users_coverage.png)

Para considerar _estable_ un módulo de código, las pruebas automáticas deben tener un mínimo de un 75% de cobertura durante el desarrollo. Los cambios en el código afectarán a la cobertura resultante en los tests, indicando si los tests deberán ser actualizados.

#### Integración continua
Para obtener el mayor rendimiento de los tests y favorecer un flujo de trabajo automatizado, se aplicarán técnicas de _Integración Continua_ (CI)[@xp-ci][@ci-fowler] sobre cada servicio a implementar:

* Mantener un repositorio único: Todos los servicios poseen un repositorio en **GitHub**[@github] donde se aloja la totalidad del proyecto y donde se integran todos los cambios.
* Construcción automatizada: Toda la instalación y despliegue del proyecto es automática y no requiere intervención humana. Mediante el servicio de integración continua **Travis CI**[@travis-ci] cada _commit_ realizado al repositorio será automáticamente descargado y desplegado.
* Tests automáticos: Los tests funcionales descritos anteriormente son igualmente cargados en el servicio de integración, y serán ejecutados para garantizar que los cambios nuevos no afectan a la funcionalidad ya probada.

De esta forma, con cada cambio en el repositorio será probado y desplegado automáticamente, mediante el servicio **Coveralls** se realizarán también las pruebas de cobertura garantizando que los tests siguen siendo válidos.

El objetivo de la integración continua es agilizar el flujo de trabajo y una detección temprana de los errores, así como realizar un seguimiento de los cambios y garantizar la funcionalidad total del sistema en todo momento.

#### Resultados
Las pruebas dinámicas se han implementado para el sistema de usuarios y el sistema de mundo, los principales sistemas del proyecto:

|Sistema |Numero de tests|Cobertura (líneas)|
|:-------|:-------------:|:----------------:|
|Mundo   |32             |79%               |
|Usuarios|14             |95%               |
|Total   |46             |82%               |

### Pruebas estáticas
Las pruebas estáticas consisten en una serie de análisis sobre el software que no implican su ejecución. En general nos centramos en herramientas automatizadas que se usan como parte del desarrollo y se integran con la integración continua. Aunque en el proceso iterativo durante la fase de **refactorización** se realizan revisiones de código y documentación como parte de las pruebas estáticas.

El objetivo de estas pruebas, es conseguir mejorar la calidad del código, proyecto y documentación, generalmente como parte de la refactorización.

#### Pruebas de calidad del código
La calidad del código viene dada principalmente por el análisis y diseño inicial, la habilidad de los programadores y, finalmente, el proceso de refactorización. Sin embargo, se aplican diversas herramientas para agilizar estos procesos.

* JsHint: Detecta errores y malas practicas en código JavaScript garantizando un código de acuerdo a los estándares js.
* Js-Beautify: Programa para indentación automática del código, garantiza un estilo de código común en todo el proyecto, con independencia del desarrollador.
* BitHound: Automatiza el proceso de revisión de código como parte del flujo de desarrollo, indicando posibles errores y malas prácticas. Proporciona una nota entre 0 y 100 para indicar la calidad del código.

Es importante tratar de mantener un código de alta calidad y seguir unos estándares en el desarrollo para facilitar las tareas de extensión y mantenibilidad posteriores. Además, un mal código puede tener repercusiones en rendimiento o errores.

#### Análisis de dependencias
Las herramientas elegidas para el desarrollo del sistema, así como el ecosistema web en general, exigen el uso de gran cantidad de dependencias y mantenerlas actualizadas pudiendo superar la decena de paquetes de los que depende un sistema (además de las dependencias de estos).

Debido a los riesgos de seguridad, rendimiento y compatibilidad, es preciso mantener todas las dependencias actualizadas, para ello se aprovechará el propio gestor de paquetes `npm` que permite actualizar dependencias obsoletas. Además como parte del flujo de desarrollo, el servicio BitHound también permite mantener un análisis continuo de dependencias en el repositorio, avisando en caso de que se desactualicen.

Aunque algunos proyectos optan por un servicio de actualización automático de dependencias, una actualización no supervisada puede conllevar una rotura en el proyecto debido a incompatibilidad, por tanto la actualización de dependencias se mantiene como una tarea independiente del flujo automatizado.

#### Análisis de commits
Como parte de la revisión manual de código, cada _commit_ al repositorio es analizado manualmente para revisar sus cambios, se ejecutan todos los tests pertinentes y se envía a la rama de desarrollo del repositorio.

Para integrar un conjunto del proyecto con la rama _master_ es imprescindible que los commits realizados cumplan con todos los tests y no realicen cambios imprevistos.

## Despliegue
A mitad de desarrollo aproximadamente, se procedió al despliegue del sistema en servicios **PaaS** (Platform as a Service). A partir de ese despliegue se procedió a incorporar la fase de despliegue a las operaciones automáticas como parte del proceso de integración continua, desplegando cada servicio tras pasar las pruebas en una versión estable (rama _master_).

Aprovechando la arquitectura distribuida, se procedió a un despliegue en distintos PaaS para cada servicio de acuerdo a las necesidades del servicio:

* Servidor de usuarios: Desplegado en **Openshift**, servicio de RedHat. Permite el uso de base de datos mongo y escalado automático de la aplicación.
* Servidor web: Desplegado en **Heroku**, al no necesitar base de datos, se decidió desplegarlo en heroku, que aunque no permite usar mongoDB, es más fácil de integrar y más rápido en desplegar que Openshift.
* Servidor del mundo: Actualmente desplegado en **Heroku**, con una Base de datos en **Mlab**.

Este despliegue, además, trata de probar el comportamiento del sistema bajo un entorno completamente distribuido, haciendo uso simultáneo de diversos servidores por parte de un único cliente.
