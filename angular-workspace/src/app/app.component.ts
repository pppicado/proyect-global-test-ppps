import { Component } from '@angular/core';
import { RedimFrameService } from '@pppicado/redim-frame';
import { ChartComponent } from './chart/chart.component';
import { FormComponent } from './form/form.component';
import { _exe_, TypeStruct_exe_ } from '@pppicado/structexe';
import { ReactiveState } from '@pppicado/reactive-proxy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  rawData = {
    app: {
      nombre: "Mi App Básica",
      versiones: [1, 2]
    },
    ajustes: new Map([['idioma', 'es']]),
    etiquetas: new Set(['urgente'])
  };

  store!: any;
  store_typed!: TypeStruct_exe_<typeof this.rawData>;

  constructor(private floatingWindowService: RedimFrameService) {

    let test: string = 'structexe' // reactive-proxy

    /*************************************************************************** 
     * Use ReactiveState
     *
     * GUÍA MAESTRA DE FUNCIONALIDADES - REACtIVESTATE
     * Este archivo recorre todas las capacidades de la librería en un flujo lógico.
     */

    if (test === 'reactive-proxy') {

      // 1. INICIALIZACIÓN COMPLEJA
      // Podemos empezar con datos o con un objeto vacío.
      this.store = new ReactiveState({
        app: {
          nombre: "Mi App Reactiva",
          versiones: [1, 2]
        },
        ajustes: new Map([['idioma', 'es']]),
        etiquetas: new Set(['urgente'])
      }) as any;

      console.log("--- 1. Acceso y Boxeo de Primitivos ---");
      // Los primitivos se comportan como tal, pero tienen superpoderes.
      console.log(this.store.app.nombre + " v" + this.store.app.versiones[0]); // "Mi App Reactiva v1"
      console.log("Ruta del nombre:", this.store.app.nombre._exe_.path); // ["app", "nombre"]


      console.log("\n--- 2. Auto-vivienda (Creación Automática) ---");
      // No existe 'usuarios', ni el índice 0, ni 'perfil'. La librería lo crea todo.
      // Al usar un número [0], detecta que debe crear un Array.
      this.store.usuarios[0].perfil.avatar = "http://imagen.png";
      console.log("Estructura creada:", this.store._exe_.toJS().usuarios);
      // Resultado: [{ perfil: { avatar: "http://imagen.png" } }]


      console.log("\n--- 3. Suscripciones Inteligentes ---");
      // Nos suscribimos a una ruta que acaba de ser creada.
      const unsub = this.store.usuarios[0].perfil.avatar._exe_.subscribe((nuevoUrl: string) => {
        console.log("📢 El avatar ha cambiado a:", nuevoUrl);
      });

      this.store.usuarios[0].perfil.avatar = "http://nuevo-avatar.jpg"; // Dispara el log


      console.log("\n--- 4. Mapas Híbridos (Puntos + Métodos) ---");
      // Podemos usar el Map como un objeto normal (notación de puntos)
      this.store.ajustes.tema = "oscuro";

      // O usar sus métodos nativos (siguen funcionando y son reactivos)
      this.store.ajustes.set('notificaciones', true);

      console.log("¿Tiene tema?:", this.store.ajustes.has('tema')); // true
      console.log("Acceso por punto:", this.store.ajustes.tema);    // "oscuro"
      console.log("Acceso por get():", this.store.ajustes.get('tema')); // "oscuro"


      console.log("\n--- 5. Sets Transparentes ---");
      // Los Sets gestionan la identidad para que el boxeo no rompa la lógica.
      this.store.etiquetas.add("leído");
      console.log("¿Existe 'leído'?:", this.store.etiquetas.has("leído")); // true (Transparente)


      console.log("\n--- 6. Introspección y Navegación (Parent/Root) ---");
      const nodoHijo = this.store.usuarios[0].perfil.avatar;

      console.log("Key propia:", nodoHijo._exe_.key);           // "avatar"
      console.log("Tipo de padre:", nodoHijo._exe_.type);       // "object"
      console.log("¿Quién es mi padre?:", nodoHijo._exe_.parent._exe_.path); // ["usuarios", 0, "perfil"]

      // Salto directo a la raíz desde las profundidades
      const root = nodoHijo._exe_.getRoot();
      console.log("Nombre desde la raíz:", root.app.nombre); // "Mi App Reactiva"


      console.log("\n--- 7. Protecciones del Sistema ---");
      try {
        this.store.app._exe_ = "intento de hack"; // Error: _exe_ es de solo lectura
      } catch (e) {
        console.log("🛡️ Protección activada: No se puede sobrescribir _exe_");
      }

      try {
        this.store.ajustes.size = 999; // Error: size es propiedad protegida del Map
      } catch (e) {
        console.log("🛡️ Protección activada: Métodos nativos de Map protegidos");
      }


      console.log("\n--- 8. Exportación de Datos (toJS vs cleanNode) ---");
      // cleanNode nos da la referencia real (target) del proxy actual
      const rawMap = this.store.ajustes._exe_.cleanNode;
      console.log("¿Es el Map real?:", rawMap instanceof Map);

      // toJS nos da una copia profunda totalmente limpia (sin Proxies, sin Boxes)
      const copiaLimpia = this.store._exe_.toJS();

      console.log("Copia JSON-ready:", JSON.stringify(copiaLimpia));
      // En la copia limpia, las comparaciones estrictas funcionan:
      console.log("¿Es 'es' un string puro?:", typeof copiaLimpia.ajustes.get('idioma') === 'string'); // true

      console.log("\n--- 9. Borrado Reactivo ---");
      delete this.store.app.versiones;
      console.log("Versiones eliminadas. ¿Existe?:", this.store.app.versiones === undefined);

      console.log("\n--- FIN DE LA DEMOSTRACIÓN ---");
    }

    if (test === 'structexe') {

      /*************************************************************************** 
      * Use StructExe
      *
      * GUÍA MAESTRA DE FUNCIONALIDADES - STRUCTEXE
      * Este archivo recorre todas las capacidades de la librería base en un flujo lógico.
      */

      // 1. INICIALIZACIÓN COMPLEJA
      // Empezamos con un objeto raw de datos
      this.store_typed = _exe_.newStruct_exe_(this.rawData);

      console.log("--- 1. Acceso y Uso de Primitivos (StructExe) ---");
      // Los datos primitivos se envuelven pero se acceden de forma normal
      console.log(this.store_typed.app.nombre + " v" + this.store_typed.app.versiones[0]); // "Mi App Básica v1"
      console.log("Ruta del nombre:", _exe_.path(this.store_typed.app.nombre)); // "/[app]|nombre"
      console.log("Ruta del nombre:", this.store_typed.app.nombre._exe_!.path); // "/[app]|nombre"

      console.log("\n--- 2. Auto-vivienda (Creación Automática) ---");
      // Creación de ramas completas que no existían previamente mediante _exe_.set
      _exe_.set(this.store_typed, 'usuarios|0|perfil|avatar', "http://imagen.png");
      console.log("Estructura dinámica:", _exe_.export((this.store_typed as any).usuarios[0]));
      console.log("Estructura dinámica:", this.store_typed._exe_!.export());
      // Resultado: { perfil: { avatar: "http://imagen.png" } }

      console.log("\n--- 3. Reacciones (Suscripciones Base) ---");
      // Nos suscribimos a una ruta específica desde el manejador global
      _exe_.react(this.store_typed, "/|usuarios|0|perfil|avatar", (cambio: any) => {
        console.log("📢 El avatar ha cambiado a:", cambio.datoNuevo);
      });

      (this.store_typed as any).usuarios[0].perfil.avatar = "http://nuevo-avatar.jpg"; // Dispara el log

      console.log("\n--- 4. Mapas Híbridos ---");
      // Al ser proxies puros, utilizamos el API original de Map de ES6.
      this.store_typed.ajustes.set('tema', 'oscuro');

      console.log("¿Existe 'tema'?:", this.store_typed.ajustes.has('tema')); // true
      console.log("Acceso por get():", this.store_typed.ajustes.get('tema'));    // "oscuro"

      console.log("\n--- 5. Sets Transparentes ---");
      // Los Sets añaden reactividad sin romper la experiencia estándar.
      this.store_typed.etiquetas.add("leído");
      console.log("¿Existe 'leído'?:", this.store_typed.etiquetas.has("leído")); // true

      console.log("\n--- 6. Introspección y Validación ---");
      const nodoHijo = this.store_typed.app.nombre;

      console.log("¿Es un nodo reactivo controlado por _exe_?:", _exe_.be(nodoHijo)); // true
      console.log("Path calculado de este primitivo:", _exe_.path(nodoHijo));

      console.log("\n--- 7. Exportación de Datos a formato Plano ---");
      // _exe_.export limpia el contenedor proxy de los datos para serialización.
      const copiaLimpia = _exe_.export(this.store_typed);

      console.log("Copia JSON-ready:", JSON.stringify(copiaLimpia));
      console.log("¿Es map plano limpio?:", copiaLimpia.ajustes instanceof Map); // true

      console.log("Estructura:", this.store_typed);
      console.log("JSON-ready:", JSON.stringify(this.store_typed));
      console.log("\n--- FIN DE LA DEMOSTRACIÓN STRUCTEXE ---");
      this.store = this.store_typed;
    }

  }

  openChart() {
    this.floatingWindowService.open(ChartComponent, {
      width: 50,
      height: 40,
      x: 5,
      y: 30,
      data: { id: 1, name: this.store.app.nombre }
    });
  }

  openForm() {
    this.store.app.nombre = 'Juan'
    this.floatingWindowService.open(FormComponent, {
      width: 40,
      height: 30,
      x: 30,
      y: 20,
      data: { email: 'x@ejemplo.com' }
    });
  }
}
