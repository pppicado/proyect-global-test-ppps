import { ReactiveState, PrimitiveBox } from './index';
async function runTests() {
    console.log("🚀 Iniciando Test Suite de ReactiveState...");
    let successCount = 0;
    const test = (name, fn) => {
        try {
            fn();
            console.log(`✅ PASSED: ${name}`);
            successCount++;
        }
        catch (e) {
            console.error(`❌ FAILED: ${name}`);
            console.error(e);
        }
    };
    // --- TEST 1: Instanciación y Estructura Básica ---
    test("Estructura recursiva y tipos", () => {
        const store = new ReactiveState({ user: { profile: { name: "Aria" } } });
        console.assert(store.user.profile.name == "Aria", "El valor debe ser Aria");
        console.assert(store.user.profile.name._exe_.type === 'object', "El tipo debe ser object");
    });
    // --- TEST 2: Boxeo de Primitivos y Operaciones ---
    test("Boxeo de primitivos (PrimitiveBox)", () => {
        const store = new ReactiveState({ contador: 10 });
        // Operación matemática
        const suma = store.contador + 5;
        console.assert(suma === 15, "La suma debe funcionar mediante valueOf");
        // Concatenación
        const texto = "Valor: " + store.contador;
        console.assert(texto === "Valor: 10", "La conversión a string debe funcionar");
        // Existencia de _exe_ en un primitivo
        console.assert(store.contador._exe_.path.includes('contador'), "El primitivo debe tener path");
    });
    // --- TEST 3: Auto-vivienda (Auto-vivification) ---
    test("Creación automática de rutas (Objetos y Arrays)", () => {
        const store = new ReactiveState();
        // Crea objeto automáticamente
        store.config.tema.color = "azul";
        console.assert(store.config.tema.color == "azul", "Debería crear la ruta de objetos");
        // Crea array automáticamente al detectar índice numérico
        store.items[0].id = 1;
        console.assert(Array.isArray(store.items._exe_.cleanNode), "Debería haber creado un Array");
        console.assert(store.items[0]._exe_.type === 'array', "El tipo de padre debe ser array");
    });
    // --- TEST 4: Suscripciones y Notificaciones ---
    test("Suscripciones granulares y burbujeo", () => {
        const store = new ReactiveState({ datos: { valor: 100 } });
        let notified = false;
        let parentNotified = false;
        // Suscripción exacta
        store.datos.valor._exe_.subscribe((v) => {
            if (v == 200)
                notified = true;
        });
        // Suscripción al padre (burbujeo)
        store.datos._exe_.subscribe((msg) => {
            if (msg === "child_updated")
                parentNotified = true;
        });
        store.datos.valor = 200;
        console.assert(notified, "El suscriptor directo debería haber sido notificado");
        console.assert(parentNotified, "El padre debería haber detectado el cambio del hijo");
    });
    // --- TEST 5: Mapas Híbridos (Puntos + Métodos) ---
    test("Maps: Notación de puntos y protección", () => {
        const store = new ReactiveState({ ajustes: new Map() });
        // Asignación por punto
        store.ajustes.idioma = "es";
        console.assert(store.ajustes.get('idioma') == "es", "Debería poder leerse con .get()");
        // Asignación por .set()
        store.ajustes.set('modo', 'oscuro');
        console.assert(store.ajustes.modo == "oscuro", "Debería poder leerse con punto");
        // Protección de métodos nativos
        try {
            store.ajustes.size = 500; // Intento ilegal
            console.assert(false, "No debería haber permitido sobrescribir 'size'");
        }
        catch (e) {
            console.assert(true);
        }
    });
    // --- TEST 6: Sets Transparentes ---
    test("Sets: Transparencia de identidad", () => {
        const store = new ReactiveState({ etiquetas: new Set() });
        store.etiquetas.add("importante");
        // El .has() debe funcionar con el valor original
        console.assert(store.etiquetas.has("importante"), "Set.has() debería encontrar el primitivo");
        // Borrado
        store.etiquetas.delete("importante");
        console.assert(store.etiquetas.size === 0, "Debería haber borrado el elemento");
    });
    // --- TEST 7: Navegación (Parent y getRoot) ---
    test("Navegación por el árbol (Parent/Root)", () => {
        const store = new ReactiveState({ a: { b: { c: 1 } } });
        const nodoC = store.a.b.c;
        const root = nodoC._exe_.getRoot();
        console.assert(root === store, "getRoot debería devolver la raíz exacta");
        const padreB = nodoC._exe_.parent;
        console.assert(padreB === store.a.b, "parent debería devolver el nodo b");
    });
    // --- TEST 8: Exportación (cleanNode y toJS) ---
    test("Exportación limpia (toJS vs cleanNode)", () => {
        const dataInicial = { user: { name: "Pedro" }, tags: new Set([1, 2]) };
        const store = new ReactiveState(dataInicial);
        // cleanNode: Referencia viva (peligrosa)
        const raw = store._exe_.cleanNode;
        console.assert(raw !== store, "cleanNode no es el Proxy");
        // toJS: Copia profunda limpia
        const snapshot = store._exe_.toJS();
        console.assert(!(snapshot.user.name instanceof PrimitiveBox), "toJS debería desboxear");
        console.assert(snapshot.tags instanceof Set, "toJS debería mantener el tipo Set");
        // Comprobar que es una COPIA
        snapshot.user.name = "Juan";
        console.assert(store.user.name == "Pedro", "toJS debería devolver una copia independiente");
    });
    // --- TEST 9: Protección de _exe_ ---
    test("Protección de la propiedad _exe_", () => {
        const store = new ReactiveState({ a: 1 });
        try {
            store.a._exe_ = "intento de hack";
            console.assert(false, "No debería permitir sobrescribir _exe_");
        }
        catch (e) {
            console.assert(true);
        }
        try {
            delete store.a._exe_;
            console.assert(false, "No debería permitir borrar _exe_");
        }
        catch (e) {
            console.assert(true);
        }
    });
    // --- TEST 10: Mutación y Auto-asignación ---
    test("Mutación directa de primitivos (+=)", () => {
        const store = new ReactiveState({ app: { nombre: "Mi App" } });
        const pathOriginal = store.app.nombre._exe_.path;
        // Mutación que fallaba creando un Box dentro de otro Box
        store.app.nombre += '+';
        console.assert(store.app.nombre == "Mi App+", "El valor debería haberse actualizado correctamente");
        console.assert(!store.app.nombre.value, "No debería haberse creado un doble PrimitiveBox");
        // @ts-ignore
        console.assert(store.app.nombre._exe_.path === pathOriginal, "El contexto _exe_ debería mantenerse intacto");
    });
    console.log(`\n⭐ Test Suite finalizado. ${successCount}/10 tests pasados con éxito.`);
}
runTests();
//# sourceMappingURL=test.js.map