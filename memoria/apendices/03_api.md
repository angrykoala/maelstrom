## Especificación de la API
La API de Maelström sigue las normas básicas de una **REST API**:

* Peticiones **HTTP**
* Uso de los métodos HTTP:
    * **GET**
    * **POST**
    * **UPDATE**
    * **DELETE**
* Todas las peticiones devolverán una respuesta **JSON** indicando el resultado de la operación
* Todas las peticiones devolverán un código de estado (especificado más adelante)    
* Las peticiones GET no tendrán ninguna carga en el _body_ del mensaje, mientras que el resto si
* Todos los datos en el _body_ han de ser provistos en formato **JSON**
    * Ejemplo:
    ```JSON
    {
        "username": "arthur",
        "password": "dontpanic42"        
    }
    ```

### Identificación
La verificación del usuario entre los diversos servicios se realizará mediante un _JSON Web Token_[@jwt] (JWT) con una id común para cada usuario.

El payload del token poseerá la siguiente estructura

```JSON
{
"id": "56d96ce3a5e8cf4c28e1a4a4",
"username": "my user",
...
}
```
Este token podrá ser almacenado por el cliente (una cookie, en memoria o en un archivo) y se podrá usar como token de acceso a los servicios y acciones que requieran identificación. Para ellos, se enviará el _header_ de autentificación `Bearer [token jwt]`


### Maelström user

* `POST /login`
    * Da de alta al usuario
    * **Respuesta:** token de acceso `{"token"}`
    * **Argumentos**
        * `username`: Nombre de usuario en el sistema
        * `password`: contraseña del usuario
    * **Status**
        * 200: Operación correcta
        * 403: Password inválido
        * 404: Usuario no registrado
        * 500: En caso de error interno en servidor

* `POST /signup`
    * Crea un nuevo usuario en el servidor si o existe
    * **Respuesta:** token de acceso `{"token"}`
    * **Argumentos**
        * `username`: Nombre del nuevo usuario
        * `password`: Contraseña del nuevo usuario
        * `email`: Correo electrónico del usuario
    * **Status**
        * 201: Usuario se ha creado correctamente
        * 400: Algún formulario se encuentra vacío
        * 500: Error interno, formulario incorrecto o usuario ya existente

* `PUT /restricted/update`
    * Actualiza los datos de usuario con nuevos datos si estos datos no coinciden con otro usuario
    * **Respuesta:** Mensaje de error si hubiera
    * **Identificación necesaria**
    * **Argumentos**
        * `username`: Nuevo nombre de usuario
        * `email`: Nuevo email
        * `password`: Nuevo password
    * **Status**
        * 204: Operación correcta
        * 400: Operación inválida (usuario no existe o nuevos datos no válidos)
        * 401: No autorizado (token inválido)

* `DELETE /restricted/remove`
    * Elimina el usuario (el token no será válido después de esta operación)
    * **Respuesta:** Vacío si la operación es correcta, error en otro caso
    * **Identificación necesaria**
    * **Argumentos:** Sin Argumentos
    * **Status**
        * 204: Operación correcta
        * 400: Operación inválida (usuario no existe o nuevos datos no válidos)
        * 401: No autorizado (token inválido)

* `GET /restricted/dash`
    * Obtiene la información del usuario
    * **Respuesta**
    ```JSON
    {
        "_id":"Id del usuario",
        "username":"Nombre del usuario",
        "email":"Correo del usuario"
    }
    ```
    * **Identificación necesaria**
    * **Status**
        * 200: Operación correcta
        * 400: Operación inválida (usuario no encontrado)
        * 401: No autorizado (token inválido)


### Maelström world

* `GET /map`
    * Obtiene información del mapa, lista de todas las ciudades
    * **Respuesta:** Array de las ciudades `[city1,city2,...]`, mensaje de error si lo hubiera
    * **Status**
        * 200: Operación correcta
        * 500: Error
* `GET /city/:city_name`
    * Obtiene información de la ciudad `city_name`
    * **Respuesta:** Datos de la ciudad en formato JSON
    ```JSON
    {
        "name":"Nombre de la ciudad",
        "position": "posición de la ciudad en formato [x,y]",
        "products": "Lista de productos (nombre{quantity,production})",
        "slug": "nombre-de-la-ciudad"        
    }
    ```
    * **Status**
        * 200: Operación correcta
        * 500: Error
* `GET /city/products/:city_name`
    * Obtiene información de todos los productos de una ciudad (cantidad, producción y precio)
    * **Respuesta**
    ```JSON
    {
        "product1":{
            "quantity": "Cantidad de producto en ciudad",
            "production": "Producción de la ciudad",
            "price": "Precio actual del producto"
        },
        "product2":{...}
    }
    ```
    * **Status**
        * 200: Operación correcta
        * 500: Error

* `GET /ship_models`
    * Obtiene un array de los modelos de barcos
    * **Respuesta**
    ```JSON
    [
        {
            "name":"Nombre del modelo",
            "life": "Vida del barco",
            "speed": "Velocidad del barco",
            "price": "Precio de construcción",
            "cargo": "Capacidad de carga del barco",
            "slug": "nombre-del-modelo"
        },
        {
            ...
        }
    ]
    ```
    * **Status**
        * 200: Operación correcta
        * 500: Error

* `GET /products`
    * Obtiene una lista de todos los productos del juego
    * **Respuesta:** Array de productos `[product1,product2,..]`
    * **Status**
        * 200: Operación correcta
        * 500: Error

* `GET /user/ships`
    * Devuelve la lista de barcos del usuario autenticado
    * **Identificación necesaria**
    * **Respuesta:** Un array con la información básica de los barcos del usuario    

    ```JSON
    [
        {
            "name": "Nombre del barco",
            "model": "Modelo del barco",
			"slug": "nombre-del-barco",
			"life": "Vida del barco",
			"status": "Estado actual del barco"
        },
        {
            ...
        }
    ]

    ```    
    * **Status**
        * 200: Operación correcta
        * 401: No autorizado (token inválido)
        * 500: Error

* `GET /user/ship/:ship_id`
    * Devuelve los datos del barco del usuario con id dada
    * **Identificación necesaria**
    * **Argumentos**
        * `:ship_id` id del barco
    * **Respuesta**
    ```JSON
    {
        "name": "Nombre del barco",
        "owner": "Nombre del propietario (jugador)",
        "model": "Modelo del barco",
        "life": "Vida del barco",
        "city": "Ciudad actual del barco",
        "status": "Estado actual del barco",
        "cargo": {"producto1":"cantidad1","producto2":"cantidad2",...},
        "slug": "nombre-del-barco",
    }
    ```     
    * **Status**
        * 200: Operación correcta
        * 401: No autorizado (token inválido)
        * 500: Error

* `GET /user/data`
    * Devuelve información del usuario
    * **Identificación necesaria**
    * **Respuesta**
        ```JSON
        {
            "id":"Id del usuario",
            "money": "Dinero del usuario"            
        }
        ```
    * **Status**
        * 200: Operación correcta
        * 401: No autorizado (token inválido)
        * 500: Error

* `POST /user/signup`
    * Crea un nuevo usuario en el servicio si no existe
        * **Identificación necesaria**
        * **Status**
            * 201: Operación correcta
            * 401: No autorizado (token inválido)
            * 500: Error

* `PUT /user/build/ship`
    * Realiza la acción de construir un barco
    * **Identificación necesaria**
    * **Argumentos**
    ```JSON
    {
        "model":"Modelo del barco",
        "ship_name":"Nombre del barco",
        "city":"Ciudad de origen"
    }
    ```
    * **Respuesta:** Datos del barco
    * **Status**
        * 201: Operación correcta
        * 400: Formato inválido
        * 401: No autorizado (token inválido)
        * 500: Error

* `PUT /user/move/ship`
    * Acción de mover barco
    * **Identificación necesaria**
    * **Argumentos**
    ```JSON
    {
        "ship":"Id del barco",
        "city":"Ciudad destino"
    }
    ```
    * **Status**
        * 200: Operación correcta
        * 400: Formato inválido
        * 401: No autorizado (token inválido)
        * 500: Error

* `PUT /user/buy`
    * Acción de comprar productos
    * **Identificación necesaria**
    * **Argumentos**
    ```JSON
    {
        "ship":"Id del barco",
        "product":"Producto a comprar",
        "quantity":"Cantidad a comprar"
    }
    ```
    * **Status**
        * 200: Operación correcta
        * 400: Formato inválido
        * 401: No autorizado (token inválido)
        * 500: Error

* `PUT /user/sell`
    * Acción de vender productos
    * **Identificación necesaria**
    * **Argumentos**
    ```JSON
    {
        "ship":"Id del barco",
        "product":"Producto a vender",
        "quantity":"Cantidad a vender"
    }
    ```
    * **Status**
        * 200: Operación correcta
        * 400: Formato inválido
        * 401: No autorizado (token inválido)
        * 500: Error

#### Eventos de sockets


### Códigos de estado

|Code|Significado                       |
|:--:|:---------------------------------|
|200 |Operación correcta                |
|201 |Operación de añadido correcta     |
|204 |Operación de modificación correcta|
|400 |Petición inválida                 |
|401 |No autorizado (token inválido)    |
|403 |Prohibido (error en contraseña)   |
|404 |Datos no encontrados              |
|500 |Error interno en servidor         |


\newpage
