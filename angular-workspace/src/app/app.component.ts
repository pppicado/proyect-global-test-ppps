import { Component, ViewChild, ElementRef } from '@angular/core';
import { RedimFrameService } from '@pppicado/redim-frame';
import { ChartComponent } from './chart/chart.component';
import { FormComponent } from './form/form.component';
import { _exe_, TypeStruct_exe_ } from '@pppicado/structexe';

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

  @ViewChild('windowOrigin', { read: ElementRef }) windowOrigin!: ElementRef;

  constructor(private floatingWindowService: RedimFrameService) {

    // desactivamos los tests
    let test: string = 'structexe' // 'structexe'

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
    this.floatingWindowService.openWindows(ChartComponent, {
      width: 50,
      height: 40,
      x: 5,
      y: 30,
      data: { id: 1, name: this.store.app.nombre },
      origin: this.windowOrigin.nativeElement
    });
  }

  openForm() {
    // https://png.pngtree.com/png-clipart/20250116/original/pngtree-beautiful-amber-stone-featuring-unique-translucent-textures-png-image_20234893.png'; // 'https://png.pngtree.com/png-clipart/20250116/original/pngtree-beautiful-amber-stone-featuring-unique-translucent-textures-png-image_20234893.png
    this.store.app.nombre = 'Juan'
    this.floatingWindowService.openWindows(FormComponent, {
      width: 40,
      height: 30,
      x: 30,
      y: 20,
      data: { email: 'x@ejemplo.com' },
      origin: this.windowOrigin.nativeElement
    });
  }

  openModalExample() {
    this.floatingWindowService.openModal(FormComponent, {
      data: { email: 'modal@ejemplo.com' },
      origin: this.windowOrigin.nativeElement
    });
  }
}

