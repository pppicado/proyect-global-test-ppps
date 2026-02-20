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
export declare class PrimitiveBox {
    value: any;
    _exe_: ExeContext;
    constructor(value: any, _exe_: ExeContext);
    valueOf(): any;
    toString(): string;
    toJSON(): any;
}
export declare class ReactiveState {
    private _subscribers;
    constructor(initialData?: any);
    /**
     * Helper estático para desenvolver recursivamente cualquier nodo
     */
    private static unwrap;
    private _createProxy;
    private _assimilate;
    private _subscribe;
    private _notify;
}
//# sourceMappingURL=index.d.ts.map