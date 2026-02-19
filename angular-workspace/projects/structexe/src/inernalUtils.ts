import { _exe_, ManagementHierarchicalDataObj, ManagementReactionsObj } from "./structexe";
import { ManagementHierarchicalData } from "./structexe";

// config
export const internal_exe_property = Symbol('internal_exe_property')
export const string_exe_property = '_exe_'

export interface _exe_Property { [string_exe_property]?: ManagementHierarchicalData; }

export type TypeStruct_exe_<T> =
  T extends Map<infer K, infer V> ? Map<K, TypeStruct_exe_<V>> & _exe_Property :
  T extends Set<infer U> ? Set<TypeStruct_exe_<U>> & _exe_Property :
  T extends Array<infer E> ? Array<TypeStruct_exe_<E>> & _exe_Property :
  T extends object ? { [K in keyof T]: TypeStruct_exe_<T[K]> } & _exe_Property
  : T & _exe_Property;

export type ActionChange = (change: datChangeObj) => void
export type OptionalParams<T> = Partial<T> | undefined;
export enum typeChange { 'create', 'seter', 'change', 'geter', 'delete' }
export enum stateAmbitReaction { all, local, childens, fathers, pause } // all = local + childens + fathers

export enum processingType { unset, primitiveData, object, observ, noObserv, noMutation, array, map, set, function }

export const processingTypeSet = new Map<string, processingType>([
  ['null', processingType.unset],
  ['undefined', processingType.unset],
  ['object', processingType.object],
  ['array', processingType.array],
  ['map', processingType.map],
  ['set', processingType.set],
  ['function', processingType.function],
  ['observer', processingType.observ],
  ['noObserv', processingType.noObserv],
  ['noMutation', processingType.noMutation],
  ['regexp', processingType.primitiveData],
  ['weakSet', processingType.primitiveData],
  ['weakMap', processingType.primitiveData],
  ['date', processingType.primitiveData],
  ['error', processingType.primitiveData],
  ['promise', processingType.primitiveData],
  ['string', processingType.primitiveData],
  ['number', processingType.primitiveData],
  ['boolean', processingType.primitiveData],
  ['symbol', processingType.primitiveData],
  ['bigint', processingType.primitiveData],
])

export class InternalUtils {
  constructor() { }

  /**
   * *************************************************************************** 
   * @method get_name_simbol_internal_exe_property Método que obtiene el nombre de la propiedad internal_exe_property.
   * @returns {string} Devuelve el nombre de la propiedad internal_exe_property.
   */
  static get name_simbol_internal_exe_property() { return internal_exe_property }

  /**
   * *************************************************************************** 
   * @method get_exe_ Método que obtiene la instancia de gestor _exe_ de un objeto.
   * @param target Objeto del cual obtener la instancia de gestor _exe_.
   * @returns {ManagementHierarchicalData} Devuelve la instancia de gestor _exe_.
   * @throws Error si el objeto no es gestionado por _exe_.
   */
  static get_exe_(target: any): ManagementHierarchicalData {
    if (!_exe_.be(target)) throw new Error("El objeto no es gestionado por _exe_.")
    return target[internal_exe_property]
  }

  /**
   * @method ghostSet (USO INTERNO) Asigna un valor a una propiedad de una instancia de TypeStruct_exe_ sin lanzar reacciones.
   * @param thisArg Instancia de TypeStruct_exe_.
   * @param property property solo podrá tener nombres de las propiedades de thisArg  
   * @param value Valor a asignar.
   * @param muting Indica si se mutará el destino o no.
   * @returns {TypeStruct_exe_<T>} Devuelve la instancia con el valor asignado.
   */
  static ghostSet<T>(thisArg: any, property: string, value: T, muting?: boolean): TypeStruct_exe_<T> {
    let returValue!: TypeStruct_exe_<T>
    let manage = _exe_.intenal_utils.get_exe_(thisArg).rootManagement
    let manageBufferState = manage.getBuffer()
    let subBufferId: number = -1
    if (manageBufferState) subBufferId = manage.pushSubBuffer()
    manage.setBuffer(true)
    returValue = _exe_.set<T>(thisArg, property, value, muting)
    manage.clearBuffer()
    manage.setBuffer(false)
    if (manageBufferState) manage.popSubBuffer(subBufferId)
    manage.setBuffer(manageBufferState)
    return returValue
  }


  /**
   * *************************************************************************** 
   * @method setProperty (USO INTERNO) Asigna un valor a una propiedad de una instancia de TypeStruct_exe_.
   * @param thisArg Instancia de TypeStruct_exe_.
   * @param property property solo podrá tener nombres de las propiedades de thisArg  
   * @param value Valor a asignar.
   * @param muting Indica si se mutará el destino o no.
   * @param transformValue Indica si se transformará el valor al tipo de estructura de destino si existe
   * @returns {TypeStruct_exe_<T>} Devuelve la instancia con el valor asignado.
   */

  // PPPS en proceso: muting: boolean, transformValue: boolean, _exe_Path: string, TypeStruct_exe_: TypeStruct_exe_<any>
  static setProperty_strict<T>(thisArg: any, property: string, value: T): TypeStruct_exe_<T> {
    let typeValue!: processingType
    let typeTarget!: processingType
    // let path = _exe_.path(TypeStruct_exe_)
    let oldValue = _exe_.export(thisArg, property)
    let target = _exe_.intenal_utils.getByStr(thisArg, property)
    let transformedValue: any = value
    let propertyCreated = false

    // muting = muting || _exe_.intenal_utils.get_exe_(TypeStruct_exe_).mutating
    // typeValue = (muting) ? _exe_.intenal_utils.gestType(value) : processingType.noMutation

    typeValue = _exe_.intenal_utils.gestType(value)
    typeTarget = _exe_.intenal_utils.gestType(target)

    return transformedValue as TypeStruct_exe_<T>
  }
  /**	
   * ***************************************************************************
   * @method getByStr Devuelve el valor de una propiedad de un objeto por su nombre.
   * @param target Objeto del cual se va a obtener el valor
   * @param property Nombre de la propiedad a obtener
   * @param callBackfnOk Función que se va a llamar si se encuentra el valor
   * @param callbackfnKo Función que se va a llamar si no se encuentra el valor
   * @returns Valor encontrado o undefined si no se encuentra
   */
  static getByStr(target: any, property: string, callBackfnOk?: (value: any) => void, callbackfnKo?: (err: string) => void): any {
    let value: any = undefined
    let err: string = ''
    let objectErr: string = ''

    switch (_exe_.intenal_utils.gestType(target)) {
      case processingType.object: {
        if (!(property in (target as object))) err = `property ${property} not found in "${target.toString()}"`
        // else value = Object.getOwnPropertyDescriptor(target, property)?.value
        else value = (target as object)[property]
        break;
      }

      case processingType.map: {
        if ((target as Map<any, any>).has(property)) value = (target as Map<any, any>).get(property)
        else {
          let numProperty = Number(property)
          if (!isNaN(numProperty) && numProperty < (target as Map<any, any>).size)
            value = Array.from((target as Map<any, any>).values())[numProperty]
          else {
            objectErr = (_exe_.be(target)) ? _exe_.path(target) : target.toString()
            err = `property ${property} not found in " ${objectErr}"`
          }
        }
        break;
      }
      case processingType.set: {
        if ((target as Set<any>).has(property)) value = property
        else {
          let numProperty = Number(property)
          if (!isNaN(numProperty) && numProperty < (target as Set<any>).size) value = Array.from((target as Set<any>).values())[numProperty]
          else {
            objectErr = (_exe_.be(target)) ? _exe_.path(target) : target.toString()
            err = `property ${property} not found in " ${objectErr}"`
          }
        }
        break;
      }
      default:
        err = `Object or property typeError: ${property} in "${target.toString()}"`
    }

    if (err != '') {
      if (callbackfnKo) callbackfnKo(err)
    } else {
      if (callBackfnOk) callBackfnOk(value)
    }
    return value
  }


  /**
   * *************************************************************************** 
   * @method gestType Metodo que devolverá el tipo procesado que deberá recibir el dato.
   * @param valueTest Instancia a testear.
   * @returns {processingType} debuelve el tipo procesado dato. 
   * @see processingType
   */
  static gestType(valueTest: any): processingType {
    let detailed = _exe_.intenal_utils.gestTypeDetailed(valueTest)
    return processingTypeSet.get(detailed) || processingTypeSet.set(detailed, processingType.object).get(detailed)
  }

  /**
   * *************************************************************************** 
   * @method gestTypeDetailed Metodo que devolverá el tipo procesado que deberá recibir el dato.
   * @param valueTest Instancia a testear.
   * @returns {processingType} debuelve el tipo procesado dato. 
   * @see processingType
   */
  static gestTypeDetailed(valueTest: any): string {

    let detailed: string

    switch (typeof valueTest) {
      case 'string': detailed = "string"; break;
      case 'number': detailed = "number"; break;
      case 'boolean': detailed = "boolean"; break;
      case 'undefined': detailed = "undefined"; break;
      case 'symbol': detailed = "symbol"; break;
      case 'bigint': detailed = "bigint"; break;
      case 'function': detailed = "function"; break;
      case 'object': detailed = "object"; break;
    }
    if (detailed == "object") {
      switch (valueTest.constructor.name) {
        case "Boolean": detailed = "boolean"; break;
        case "Number": detailed = "number"; break;
        case "BigInt": detailed = "bigint"; break;
        case "String": detailed = "string"; break;
        case "Symbol": detailed = "symbol"; break;
        case "RegExp": detailed = "regexp"; break;
        case 'Date': detailed = "date"; break;
        case "WeakMap": detailed = "weakMap"; break;
        case "WeakSet": detailed = "weakSet"; break;
        case "Map": detailed = "map"; break;
        case "Set": detailed = "set"; break;
        case "Array": detailed = "array"; break;
        // case "Object": 
        default: detailed = valueTest.constructor.name; break;
      }
    }
    return detailed
  }

  /**
   * *************************************************************************** 
   * @method Data_exe_ Metodo que Mixeará el typo del objeto recibido en Obj con _exe_Property.
   * @param obj Objeto to typer.
   * @returns {TypeStruct_exe_<T>} debuelve la instancia con la propiedad definida. 
   * @see _exe_Property
   * @see TypeStruct_exe_
   */
  static typeAs_Data_exe_<T>(obj: T): TypeStruct_exe_<T> {
    return obj as unknown as TypeStruct_exe_<T>
  }

  /**
   * *************************************************************************** 
   * @method proxyStruct Metodo que creará un proxy para la instancia de la clase.
   * @param type Tipo de instancia a crear.
   * @param fatherStruct Instancia padre.
   * @param fatherProperty Propiedad padre.
   * @returns {TypeStruct_exe_} debuelve la instancia proxy. 
   */
  static newProxy<T>(thisArg: T, type: processingType, fatherStruct?: TypeStruct_exe_<any>, fatherProperty?: string): TypeStruct_exe_<T> {
    let typeProcessing = type
    let managementHierarchicalData = new ManagementHierarchicalDataObj({ processingType: type }) as ManagementHierarchicalData
    managementHierarchicalData.structObj = thisArg
    switch (type) {
      case processingType.array:
      case processingType.object: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          defineProperty(target: object, property: string, descriptor: PropertyDescriptor) {
            managementHierarchicalData.set(property.toString(), descriptor.value)
            // Posible mejora con validación de fallo creación de propiedad PPPS
            return true
          },
          set(target: object, property: string, val: any, receiver: any) {
            managementHierarchicalData.set(property.toString(), val)
            // Posible mejora con validación de fallo asignación PPPS
            return true
          },
          get(target: object, property: string | symbol, receiver: any) {
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            if (property == '_exe_' && !('_exe_' in target)) {
              return managementHierarchicalData as ManagementHierarchicalData
            } else {
              let value = Reflect.get(target, property, receiver)
              if (managementHierarchicalData.rootManagement.observingGets) {
                managementHierarchicalData.rootManagement.callReact(new datChangeObj({
                  ruta: managementHierarchicalData.path + (typeProcessing == processingType.array) ? '[' + property.toString() + ']' : '|' + property.toString(),
                  hito: typeChange.geter,
                  ambito: stateAmbitReaction.local,
                  datoNuevo: value,
                  datoActual: undefined
                }))
              }
              return value
            }

          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target, property)
          },
        } as ProxyHandler<Object>) as TypeStruct_exe_<any>
        break
      }
      case processingType.set:
      case processingType.map: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          defineProperty(target: object, property: string, descriptor: PropertyDescriptor) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (Reflect.defineProperty(target, property, descriptor)) {
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + '|' + property,
                hito: typeChange.create,
                ambito: stateAmbitReaction.local,
                datoNuevo: descriptor.value,
                datoActual: undefined
              }))
              return true
            } else return false
          },
          set(target: object, property: string, val: any, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            let oldValue = Object.getOwnPropertyDescriptor(target, property)?.value
            if (Reflect.set(target, property, val, receiver)) {
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + '|' + property,
                hito: typeChange.seter,
                ambito: stateAmbitReaction.local,
                datoNuevo: val,
                datoActual: oldValue
              }))
              return true
            } else return false
          },
          get(target: object, property: string | symbol, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property == '_exe_' && !('_exe_' in target)) ? management_exe_ : Reflect.get(target, property, receiver);
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))) {
              if (property in ['set', 'add']) {
                value = function (propertyKey: any, propertyValue: any) {
                  propertyValue = management_exe_.set(propertyKey, propertyValue)
                  return management_exe_.proxyObj
                }
              } else value = value.bind(target)
            } else if (management_exe_.rootManagement.observingGets) {
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + '[' + property.toString() + ']',
                hito: typeChange.geter,
                ambito: stateAmbitReaction.local,
                datoNuevo: value,
                datoActual: undefined
              }))
            }
            return value;
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target, property)
          },
        } as ProxyHandler<Object>) as TypeStruct_exe_<any>
        break
      }
      case processingType.noObserv: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          get(target: object, property: string | symbol, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property == '_exe_' && !('_exe_' in target)) ? management_exe_ : Reflect.get(target, property, receiver);
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))) {
              let valueBound = value.bind(target)
              value = function (propertyKey: any, propertyValue: any) {
                return valueBound(propertyKey, propertyValue)
              }
            }
            return value;
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target, property)
          },
        } as ProxyHandler<Object>) as any
        break
      }

      case processingType.observ: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          defineProperty(target: object, property: string, descriptor: PropertyDescriptor) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (Reflect.defineProperty(target, property, descriptor)) {
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + '|' + property,
                hito: typeChange.create,
                ambito: stateAmbitReaction.local,
                datoNuevo: descriptor.value,
                datoActual: undefined
              }))
              return true
            } else return false
          },
          set(target: object, property: string, val: any, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            let oldValue = Object.getOwnPropertyDescriptor(target, property)?.value
            if (Reflect.set(target, property, val, receiver)) {
              let propertySep = (Array.isArray(target)) ? '[' + property + ']' : '|' + property
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + propertySep,
                hito: typeChange.seter,
                ambito: stateAmbitReaction.local,
                datoNuevo: val,
                datoActual: oldValue
              }))
              return true
            } else return false
          },
          get(target: object, property: string | symbol, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property == '_exe_' && !('_exe_' in target)) ? management_exe_ : Reflect.get(target, property, receiver);
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))) {
              if (property === 'set' || property === 'add') {
                let valueBound = value.bind(target)
                value = function (propertyKey: any, propertyValue: any) {
                  let oldValue = Object.getOwnPropertyDescriptor(target, propertyKey)?.value
                  if (valueBound(propertyKey, propertyValue)) {
                    if (property === "set") (target as Set<any>).forEach((item: any, index: number) => { if (item === propertyValue) propertyKey = index.toString() })
                    management_exe_.rootManagement.callReact(new datChangeObj({
                      ruta: management_exe_.path + '[' + propertyKey + ']',
                      hito: typeChange.seter,
                      ambito: stateAmbitReaction.local,
                      datoNuevo: propertyValue,
                      datoActual: oldValue
                    }))
                  }
                  return management_exe_.proxyObj
                }
              }
            } else if (management_exe_.rootManagement.observingGets) {
              let propertySep = (Array.isArray(target)) ? '[' + property.toString() + ']' : '|' + property.toString()
              management_exe_.rootManagement.callReact(
                new datChangeObj({
                  ruta: management_exe_.path + propertySep,
                  hito: typeChange.geter,
                  ambito: stateAmbitReaction.local,
                  datoNuevo: value,
                  datoActual: undefined
                }))
            }
            return value;
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target, property)
          },
        } as ProxyHandler<Object>) as TypeStruct_exe_<any>
        break
      }
      case processingType.noObserv: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          get(target: object, property: string | symbol, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property == '_exe_' && !('_exe_' in target)) ? management_exe_ : Reflect.get(target, property, receiver);
            if ((typeof value === "function" && ((target instanceof Set) || (target instanceof Map))) && ((property === 'set' || property === 'add')))
              value = value.bind(target)
            return value;
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target, property)
          },
        } as ProxyHandler<Object>) as TypeStruct_exe_<any>
        break
      }
      default:
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          defineProperty(target: object, property: string, descriptor: PropertyDescriptor) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (Reflect.defineProperty(target, property, descriptor)) {
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + '|' + property,
                hito: typeChange.create,
                ambito: stateAmbitReaction.local,
                datoNuevo: descriptor.value,
                datoActual: undefined
              }))
              return true
            } else return false
          },
          set(target: object, property: string, val: any, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            let oldValue = Object.getOwnPropertyDescriptor(target, property)?.value
            if (Reflect.set(target, property, val, receiver)) {
              let propertySep = (Array.isArray(target)) ? '[' + property + ']' : '|' + property
              management_exe_.rootManagement.callReact(new datChangeObj({
                ruta: management_exe_.path + propertySep,
                hito: typeChange.seter,
                ambito: stateAmbitReaction.local,
                datoNuevo: val,
                datoActual: oldValue
              }))
              return true
            } else return false
          },
          get(target: object, property: string | symbol, receiver: any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property == '_exe_' && !('_exe_' in target)) ? management_exe_ : Reflect.get(target, property, receiver);
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))) {
              if (property === 'set' || property === 'add') {
                let valueBound = value.bind(target)
                value = function (propertyKey: any, propertyValue: any) {
                  let oldValue = Object.getOwnPropertyDescriptor(target, propertyKey)?.value
                  if (valueBound(propertyKey, propertyValue)) {
                    if (property === "set") (target as Set<any>).forEach((item: any, index: number) => { if (item === propertyValue) propertyKey = index.toString() })
                    management_exe_.rootManagement.callReact(new datChangeObj({
                      ruta: management_exe_.path + '[' + propertyKey + ']',
                      hito: typeChange.seter,
                      ambito: stateAmbitReaction.local,
                      datoNuevo: propertyValue,
                      datoActual: oldValue
                    }))
                  }
                  return management_exe_.proxyObj
                }
              }
            } else if (management_exe_.rootManagement.observingGets) {
              let propertySep = (Array.isArray(target)) ? '[' + property.toString() + ']' : '|' + property.toString()
              management_exe_.rootManagement.callReact(
                new datChangeObj({
                  ruta: management_exe_.path + propertySep,
                  hito: typeChange.geter,
                  ambito: stateAmbitReaction.local,
                  datoNuevo: value,
                  datoActual: undefined
                }))
            }
            return value;
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target, property)
          },
        } as ProxyHandler<Object>) as TypeStruct_exe_<any>
        break
    }
    if (fatherStruct && fatherProperty) {
      if (_exe_.intenal_utils.gestType(fatherStruct) in [processingType.array, processingType.set, processingType.map])
        fatherProperty = '[' + fatherProperty + ']'
      else
        fatherProperty = '|' + fatherProperty
      managementHierarchicalData.path = _exe_.path(fatherStruct) + fatherProperty
      managementHierarchicalData.rootManagement = _exe_.intenal_utils.get_exe_(fatherStruct).rootManagement
    } else managementHierarchicalData.rootManagement = new ManagementReactionsObj(managementHierarchicalData.proxyObj)
    return managementHierarchicalData.proxyObj
  }

}

export interface ManagementReaction extends ManagementReactionObj { }
/**
 * @class ManagementReactionObj para las instancias de @see ManagementReactionObj
 * Este objeto es utilizado como respuesta en los eventos de _exe_
 * @see _exe_
 * @see ManagementReaction
 */
export class ManagementReactionObj {
  /**
   * Crea una instancia de ManagementReactionObj con parámetros opcionales.
   * @param parametros Parámetros de inicialización.
   */
  constructor(inicialValues?: Partial<ManagementReactionObj>) { Object.assign(this, inicialValues) }
  [index: string]: any
  /** @property Número de llamadas al evento */
  "calls": number = 0
  /** @property Estado de la subscripción */
  "status": stateAmbitReaction = stateAmbitReaction.local
  /** @property Indice de la subscripción */
  "id": number = 0
}


export interface Reaction extends ReactionObj { }
/**
 * @class ReactionObj Instancia de Reaction
 * Este objeto es utilizado como respuesta del contrato en _exe_.react
 * @see Reaction
 * @see _exe_
 */
export class ReactionObj {
  /**
   * Crea una reacción y normaliza sus objetos de cambio y gestión.
   * @param parametros Parámetros de inicialización.
   */
  constructor(inicialValues?: Partial<ReactionObj>) {
    Object.assign(this, inicialValues)
    this.change = new datChangeObj(this.change)
    this.manage = new ManagementReactionObj(this.manage)
  }
  [index: string]: any
  /** @property Objeto de cambio de datos */
  "change": datChangeObj = new datChangeObj()
  /** @property Función a ejecutar cuando cambia el valor */
  "action": ActionChange = () => { }
  /** @property Contexto en el que se ejecutará la función */
  "thisArg": any = undefined
  /** @property Objeto de gestión de subscripción */
  "calls": number = 0
  /** @property Objeto de gestión de subscripción */
  "manage"!: ManagementReaction
  /** @property Función para cancelar la subscripción */
  "declineReact": () => void
}

export interface datChange extends datChangeObj { }
/**
 * @interface datChange Este objeto es utilizado como respuesta en los eventos de la estructura
 * @class datChangeObj
 * @see datChange
 * @see TypeStruct_exe_
 */
export class datChangeObj {
  /**
   * @constructor 
   * @param ruta Ruta del cambio o listaParametros
   * @param hito Hito del cambio
   * @param ambito Ambito del cambio
   * @param datoNuevo Dato Nuevo
   * @param datoActual Dato Actual
   */
  constructor(inicialValues?: Partial<datChangeObj>) { Object.assign(this, inicialValues) }
  "ruta": string = ''
  "datoNuevo": any = undefined
  "datoActual": any = undefined
  "hito": typeChange = typeChange.change
  "ambito": stateAmbitReaction = stateAmbitReaction.local
  "thisArg": any = undefined
}
