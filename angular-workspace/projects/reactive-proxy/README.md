# ReactiveProxy Library (Albacete Edition)

**Versión:** 2.0.0

## 1. Filosofía de la Librería
La librería se basa en el principio de Asimilación Recursiva. A diferencia de otros gestores de estado que tratan los datos como entidades pasivas, `ReactiveState` convierte cada nodo del árbol de datos en una entidad "consciente" de su ubicación, su genealogía y sus suscriptores.

**Pilares Fundamentales:**
- **Transparencia:** Se comporta como un objeto JS estándar, pero intercepta todas las operaciones.
- **Ubicuidad de Metadatos:** Cada dato (incluso un `number` o `string`) posee una puerta de enlace `_exe_`.
- **Auto-vivienda:** El estado crece orgánicamente; si una ruta no existe, se crea al ser accedida.
- **Hibridación:** Los `Map` y `Set` ganan superpoderes de objetos planos sin perder su interfaz nativa.

## 2. El Objeto `_exe_`: El Centro de Mando
Cada nodo de la estructura (exceptuando `null` o `undefined`) expone una propiedad no enumerable y protegida llamada `_exe_`.

### Propiedades y Métodos de `_exe_`

| Propiedad/Método | Tipo | Descripción |
| :--- | :--- | :--- |
| `path` | `Path` | Array con la ruta completa desde la raíz (ej: `['users', 0, 'name']`). |
| `parent` | `Proxy` | Referencia al nodo padre directo. |
| `key` | `string` \| `number` | La llave o índice bajo el cual este nodo está registrado en su padre. |
| `type` | `string` | Indica si el contenedor es `'object'`, `'array'`, `'map'`, `'set'` o `'root'`. |
| `cleanNode` | `any` | Referencia al objeto real (target) sin el envoltorio del Proxy. |
| `subscribe()` | `Function` | Registra un callback que se ejecuta cuando este nodo o sus hijos cambian. |
| `getRoot()` | `Function` | Función que devuelve el Proxy de la raíz del estado de forma instantánea. |
| `toJS()` | `Function` | Genera una copia limpia (Deep Copy) desboxeando todos los primitivos y Proxies. |

## 3. Comportamientos Especiales y Estructuras

### 3.1. Boxeo de Primitivos (Primitive Boxing)
Cuando intentas asignar un valor primitivo (ej: `estado.edad = 30`), la librería no guarda el número literal. Crea una instancia de `PrimitiveBox`.
- **Comportamiento:** Se comporta como el valor original en operaciones matemáticas o de texto gracias a que sobrecarga `valueOf()` y `toString()`.
- **Ventaja:** Permite hacer `estado.edad._exe_.subscribe(...)`, algo imposible con un número normal en JS.

### 3.2. Mapas Híbridos (Dot Notation en Maps)
La librería resuelve la verbosidad de los `Map`.
- **Acceso:** Puedes usar `map.get('key')` o simplemente `map.key`.
- **Asignación:** Puedes usar `map.set('key', 1)` o `map.key = 1`.
- **Protección:** Propiedades nativas como `.size` o métodos como `.clear` están protegidos. No puedes sobrescribirlos con asignaciones por punto.

### 3.3. Auto-vivienda (Auto-vivification)
Si accedes a una ruta inexistente como `store.a.b.c.d`, la librería:
1. Detecta que `a` no existe.
2. Crea un objeto reactivo vacío en `a`.
3. Repite el proceso para `b`, `c` y `d` de forma recursiva.
4. Si la propiedad parece un número (ej: `store.usuarios[0]`), creará un Array en lugar de un Objeto.

## 4. Sistema de Reactividad (Pub/Sub)
El sistema de notificaciones es granular y burbujeante:
- **Cambio Local:** Al modificar `store.user.name`, se notifican todos los suscriptores de la ruta exacta `user.name`.
- **Burbujeo:** Se envía una señal de "actualización de hijo" a los padres (`user` y `root`). Esto permite que componentes que escuchan al objeto `user` sepan que deben repintarse.
- **Desuscripción:** El método `subscribe` devuelve una función de limpieza para evitar fugas de memoria.

## 5. Casos de Uso Recomendados

### A. Gestión de Estado Global (Alternativa a Redux/Pinia)
Ideal para aplicaciones donde el estado es muy jerárquico. La capacidad de obtener `getRoot()` desde cualquier parte permite a los componentes "hijo" comunicarse con el "padre" sin pasar props interminables.

### B. Formularios Dinámicos Complejos
Para formularios donde los campos se crean dinámicamente. Puedes suscribirte a `form.seccion_A.campo_X` antes de que el usuario siquiera haya abierto la sección A, gracias a la auto-vivienda.

### C. Sincronización con Bases de Datos NoSQL
Debido a que la estructura imita un árbol (como Firebase o MongoDB), `toJS()` permite exportar el estado limpio para enviarlo a la base de datos, y la asimilación permite importar el JSON y volverlo reactivo al instante.

## 6. Restricciones y Advertencias
- **Igualdad Estricta:** `store.valor === 10` será `false` porque `store.valor` es un objeto `PrimitiveBox`. Se recomienda usar `==` o comparar contra `store.valor.value`.
- **Propiedades Protegidas:** Intentar eliminar o sobrescribir `_exe_` lanzará una excepción para proteger la integridad del sistema.
- **Rendimiento:** Aunque es eficiente, el uso de Proxies y Boxeo en estructuras de millones de elementos puede tener un impacto en memoria mayor que los objetos planos.

> Este documento asegura que cualquier desarrollador pueda entender no solo cómo funciona la librería, sino por qué toma las decisiones de diseño que toma.
