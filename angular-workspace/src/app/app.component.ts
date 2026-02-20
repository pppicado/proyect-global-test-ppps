import { Component } from '@angular/core';
import { FloatingWindowService } from '@pppicado/redim-frame';
import { ChartComponent } from './chart/chart.component';
import { FormComponent } from './form/form.component';
import { _exe_, datChangeObj, Reaction, stateAmbitReaction, typeChange } from '@pppicado/structexe';
import { ReactiveState } from '@pppicado/reactive-proxy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'angular-workspace';
  store: any;

  constructor(private floatingWindowService: FloatingWindowService) {

    let test: string = 'reactive-proxy' // structexe

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
      */

      const persona =
      {
        name: 'John Doe',
        sex: 'male',
        age: 15,
        adult: false,
        address: [
          {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345'
          },
          {
            street: '456 Secondary St',
            city: 'otherAnytown',
            state: 'CA',
            zip: '12346'
          },
        ]
      }

      let data = _exe_.newStruct_exe_({ persona: persona })

      _exe_.path(data.persona.name)
      _exe_.path(data.persona)

      data.persona.name._exe_
      data.persona._exe_!.path
      data.persona.name._exe_!.path
      data.persona.address._exe_!.path
      data.persona.address[0]._exe_!.path
      data.persona.address[0].state._exe_!.path

      data.persona.name // 'John Doe'
      data.persona.age // 15
      data.persona.adult // false
      data.persona.address[0].street // '123 Main St'
      data.persona.address[1].city // 'otherAnytown'
      data.persona

      let reaccion: Reaction = _exe_.react(data, '?', (change) => { console.log(change) },)


      _exe_.react(data, '?', (change) => { console.log(change) })

      data.persona._exe_!.react('age', (change) => {
        if (change.datoNuevo >= 18) {
          data.persona.adult = true
        }
      })

      data.persona.age = 18 // console { oldValue: 15, newValue: 18, type: 'set', path: '/|age' } , { oldValue: false, newValue: true, type: 'set', path: '/|adult' }
      data.persona.adult // true  
      data.persona.age = 15 // console { oldValue: 18, newValue: 15, type: 'set', path: '/|age' } , console { oldValue: true, newValue: false, type: 'set', path: '/|adult' }
      data.persona.adult // false 

      _exe_.react(data, 'persona|address[0]|city', (change) => { console.log(change) })

      data._exe_!.react('persona|address[0]|city', (change) => { console.log(change) })

      _exe_.react(data.persona.address, '[?]|city', (change) => { console.log(change) })

      data.persona.address._exe_!.react('[?]|city', (change) => { console.log(change) })

      _exe_.react(data, 'persona|address[(city:Anytown)]|city', (change) => { console.log(change) })

      data._exe_!.react('persona|address[(city:Anytown)]|city', (change) => { console.log(change) })

      data._exe_!.react(new datChangeObj({
        ruta: 'persona|address',
        hito: typeChange.seter,
        ambito: stateAmbitReaction.childens
      }
      ), (change) => { console.log(change) }, this)

      data.persona.address._exe_!.react('[?]|city', (change) => {
        if (change.datoNuevo != change.datoActual) {
          console.log('city changed to', change.datoNuevo)
        }
      })

      data.persona.address[0].city = 'otherNewAnytown'
      // console { oldValue: 'Anytown', newValue: 'otherNewAnytown', type: 'set', path: '/|address[0]|city' }
      // console 'city changed to otherNewAnytown'
      data.persona.address[1].city = 'otherNewAnytown'
      // console { oldValue: 'otherAnytown', newValue: 'otherNewAnytown', type: 'set', path: '/|address[1]|city' }
      // console 'city changed to otherNewAnytown'

      data.persona.address = [
        {
          street: '000 Secondary St',
          city: 'otherAnytown',
          state: 'CA',
          zip: '12346'
        },
      ]

      // console { oldValue: {...}, newValue: undefined, type: 'del', path: '/|address[1]' }
      // console { oldValue: {...}, newValue: undefined, type: 'del', path: '/|address[1]|street' }
      // console { oldValue: {...}, newValue: undefined, type: 'del', path: '/|address[1]|city' }
      // console { oldValue: {...}, newValue: undefined, type: 'del', path: '/|address[1]|state' }
      // console { oldValue: {...}, newValue: undefined, type: 'del', path: '/|address[1]|zip' }
      // console { oldValue: {...}, newValue: {...}, type: 'mod', path: '/|address[0]' }
      // console { oldValue: {...}, newValue: {...}, type: 'mod', path: '/|address[0]|street' }
      // console { oldValue: {...}, newValue: {...}, type: 'mod', path: '/|address[0]|city' }
      // console { oldValue: {...}, newValue: {...}, type: 'mod', path: '/|address[0]|state' }
      // console { oldValue: {...}, newValue: {...}, type: 'mod', path: '/|address[0]|zip' }

      data.persona.address._exe_!.path // '/|address'

      // ***************************************************************************/
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
      y: 20
    });
  }
}
