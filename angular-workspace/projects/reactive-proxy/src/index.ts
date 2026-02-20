/**
 * ReactiveProxy Library
 * Versión: 2.0.0 - "Albacete Edition"
 */

export type Path = (string | symbol | number)[];

export interface ExeContext {
    path: Path;
    parent: any;
    key: string | symbol | number;
    type: 'object' | 'array' | 'map' | 'set' | 'root';
    cleanNode: any;
    subscribe: (cb: (val: any) => void) => () => void;
    getRoot: () => any;
    toJS: () => any;
}

/**
 * Clase para envolver valores primitivos y dotarlos de metadatos _exe_
 */
export class PrimitiveBox {
    constructor(public value: any, public _exe_: ExeContext) { }
    valueOf() { return this.value; }
    toString() { return String(this.value); }
    toJSON() { return this.value; }
}

// Claves que no pueden ser sobrescritas para no romper la lógica interna
const RESERVED_MAP_KEYS = new Set(['size', 'get', 'set', 'has', 'delete', 'clear', 'entries', 'keys', 'values', 'forEach', 'constructor']);
const RESERVED_SET_KEYS = new Set(['size', 'add', 'has', 'delete', 'clear', 'entries', 'keys', 'values', 'forEach', 'constructor']);
const PROTECTED_CORE_KEYS = new Set(['_exe_']);

export class ReactiveState {
    private _subscribers = new Map<string, Set<(val: any) => void>>();

    constructor(initialData: any = {}) {
        // Al instanciar, la clase se retorna a sí misma como un Proxy
        return this._createProxy([], initialData, null, 'root', 'root');
    }

    /**
     * Helper estático para desenvolver recursivamente cualquier nodo
     */
    private static unwrap(val: any): any {
        if (val instanceof PrimitiveBox) return val.value;
        if (val && val._exe_ && typeof val._exe_.toJS === 'function') {
            return val._exe_.toJS();
        }
        return val;
    }

    private _createProxy(
        path: Path,
        target: any,
        parent: any,
        key: any,
        type: ExeContext['type']
    ): any {
        const self = this;
        const isMap = target instanceof Map;
        const isSet = target instanceof Set;
        const isArray = Array.isArray(target);
        const currentType = type || (isArray ? 'array' : isMap ? 'map' : isSet ? 'set' : 'object');

        let proxyInstance: any;

        proxyInstance = new Proxy(target, {
            get(target, prop, receiver) {
                // 1. Intercepción de metadatos _exe_
                if (prop === '_exe_') {
                    return {
                        path,
                        parent,
                        key,
                        type: currentType,
                        cleanNode: target,
                        subscribe: (cb: any) => self._subscribe(path, cb),
                        getRoot: () => {
                            let current = proxyInstance;
                            while (current._exe_ && current._exe_.parent !== null) {
                                current = current._exe_.parent;
                            }
                            return current;
                        },
                        toJS: () => {
                            if (isArray) return target.map((i: any) => ReactiveState.unwrap(i));
                            if (isMap) {
                                const copy = new Map();
                                target.forEach((v: any, k: any) => copy.set(ReactiveState.unwrap(k), ReactiveState.unwrap(v)));
                                return copy;
                            }
                            if (isSet) {
                                const copy = new Set();
                                target.forEach((v: any) => copy.add(ReactiveState.unwrap(v)));
                                return copy;
                            }
                            const copy: any = {};
                            Object.keys(target).forEach(k => copy[k] = ReactiveState.unwrap(target[k]));
                            return copy;
                        }
                    } as ExeContext;
                }

                // 2. Soporte Híbrido para Map (Notación de puntos)
                if (isMap && typeof prop === 'string' && !RESERVED_MAP_KEYS.has(prop)) {
                    if (target.has(prop)) return target.get(prop);
                    if (typeof prop !== 'symbol') {
                        const newChild = self._assimilate({}, [...path, prop], proxyInstance, prop, 'map');
                        target.set(prop, newChild);
                        return newChild;
                    }
                }

                // 3. Acceso a valor real o métodos
                let value = (isMap || isSet) && typeof prop === 'string' && (RESERVED_MAP_KEYS.has(prop) || RESERVED_SET_KEYS.has(prop))
                    ? Reflect.get(target, prop, target)
                    : Reflect.get(target, prop, receiver);

                // 4. Intercepción de métodos nativos (Binding)
                if (typeof value === 'function') {
                    return (...args: any[]) => {
                        const method = prop as string;

                        if (isMap) {
                            if (method === 'get') {
                                const [k] = args;
                                const res = target.get(k);
                                return res !== undefined ? res : self._assimilate({}, [...path, k], proxyInstance, k, 'map');
                            }
                            if (method === 'set') {
                                const [k, v] = args;
                                const assimilated = self._assimilate(v, [...path, k], proxyInstance, k, 'map');
                                target.set(k, assimilated);
                                self._notify([...path, k], assimilated);
                                return proxyInstance;
                            }
                        }

                        if (isSet && method === 'add') {
                            const [v] = args;
                            const assimilated = self._assimilate(v, [...path, String(v)], proxyInstance, v, 'set');
                            target.add(assimilated);
                            self._notify(path, target);
                            return proxyInstance;
                        }

                        // Ejecución de métodos mutadores estándar
                        const result = value.apply(target, args);
                        if (['delete', 'clear', 'push', 'pop', 'splice', 'shift', 'unshift'].includes(method)) {
                            self._notify(path, target);
                        }
                        return result;
                    };
                }

                // 5. Autovivificación para Objetos/Arrays
                if (value === undefined && !isMap && !isSet && typeof prop !== 'symbol') {
                    const isNextIndex = !isNaN(Number(prop));
                    const newChild = self._assimilate(isNextIndex ? [] : {}, [...path, prop], proxyInstance, prop, isArray ? 'array' : 'object');
                    target[prop] = newChild;
                    return newChild;
                }

                // 6. Asimilación Lazy
                if (value !== undefined && typeof prop !== 'symbol' && typeof value !== 'function' && prop !== '_exe_' && !PROTECTED_CORE_KEYS.has(String(prop))) {
                    const isReserved = (isMap && RESERVED_MAP_KEYS.has(String(prop))) || (isSet && RESERVED_SET_KEYS.has(String(prop)));
                    if (!isReserved) {
                        if (value !== null && typeof value === 'object' && !(value instanceof PrimitiveBox)) {
                            let childType: ExeContext['type'] = Array.isArray(value) ? 'array' : value instanceof Map ? 'map' : value instanceof Set ? 'set' : 'object';
                            const asim = self._assimilate(value, [...path, String(prop)], proxyInstance, prop, childType);
                            target[prop] = asim;
                            return asim;
                        }
                        if (typeof value !== 'object' && typeof value !== 'function') {
                            const asim = self._assimilate(value, [...path, String(prop)], proxyInstance, prop, currentType);
                            target[prop] = asim;
                            return asim;
                        }
                    }
                }

                return value;
            },

            set(target, prop, value, receiver) {
                const propStr = String(prop);

                // Protecciones
                if (PROTECTED_CORE_KEYS.has(propStr)) throw new Error(`[ReactiveState] Error: '${propStr}' es de solo lectura.`);
                if (isMap && RESERVED_MAP_KEYS.has(propStr)) throw new Error(`[ReactiveState] Error: No puedes sobrescribir el método '${propStr}' en Map.`);
                if (isSet && RESERVED_SET_KEYS.has(propStr)) throw new Error(`[ReactiveState] Error: No puedes sobrescribir el método '${propStr}' en Set.`);

                // Asignación en Map vía punto
                if (isMap && typeof prop === 'string') {
                    const assimilated = self._assimilate(value, [...path, prop], proxyInstance, prop, 'map');
                    target.set(prop, assimilated);
                    self._notify([...path, prop], assimilated);
                    return true;
                }

                // Asignación de Primitivos: Evitar re-boxeo si ya existe
                let assimilated: any;
                if (Reflect.has(target, prop) && target[propStr] instanceof PrimitiveBox && typeof value !== 'object') {
                    // Update only inner value
                    target[propStr].value = ReactiveState.unwrap(value);
                    assimilated = target[propStr];
                } else {
                    // Asignación estándar
                    assimilated = self._assimilate(value, [...path, propStr], proxyInstance, prop, isArray ? 'array' : 'object');
                    Reflect.set(target, prop, assimilated, receiver);
                }

                self._notify([...path, propStr], assimilated);
                return true;
            },

            deleteProperty(target, prop) {
                if (PROTECTED_CORE_KEYS.has(String(prop))) throw new Error(`[ReactiveState] Error: No se puede eliminar '_exe_'.`);
                const success = Reflect.deleteProperty(target, prop);
                if (success) self._notify(path, target);
                return success;
            }
        });

        return proxyInstance;
    }

    private _assimilate(value: any, path: Path, parent: any, key: any, type: ExeContext['type']): any {
        // Si ya es un PrimitiveBox o el objeto es null, devolvemos tal cual o boxeamos
        if (value !== null && typeof value === 'object' && !(value instanceof PrimitiveBox)) {
            return this._createProxy(path, value, parent, key, type);
        }

        // Si ya es un PrimitiveBox, solo actualizamos su contexto (opcional, aquí creamos uno nuevo)
        const primitiveExe: ExeContext = {
            path, parent, key, type,
            cleanNode: value,
            toJS: () => value,
            subscribe: (cb: any) => this._subscribe(path, cb),
            getRoot: () => {
                let current = parent;
                while (current && current._exe_ && current._exe_.parent !== null) current = current._exe_.parent;
                return current;
            }
        };
        return new PrimitiveBox(value, primitiveExe);
    }

    private _subscribe(path: Path, callback: (val: any) => void) {
        const key = path.join('.');
        if (!this._subscribers.has(key)) this._subscribers.set(key, new Set());
        this._subscribers.get(key)!.add(callback);
        return () => this._subscribers.get(key)?.delete(callback);
    }

    private _notify(path: Path, value: any) {
        const key = path.join('.');
        this._subscribers.get(key)?.forEach(cb => cb(value));
        // Notificación burbujeante (opcional: notificar al padre)
        if (path.length > 0) {
            const parentPath = path.slice(0, -1).join('.');
            this._subscribers.get(parentPath)?.forEach(cb => cb("child_updated"));
        }
    }
}
