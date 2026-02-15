/*********************************************************************************************************
** ███████╗ ████████╗ ██████╗  ██╗   ██╗  ██████╗ ████████╗            ███████╗██╗  ██╗███████╗         **
** ██╔════╝ ╚══██╔══╝ ██╔══██╗ ██║   ██║ ██╔════╝ ╚══██╔══╝            ██╔════╝╚██╗██╔╝██╔════╝         **
** ███████╗    ██║    ██████╔╝ ██║   ██║ ██║         ██║               █████╗   ╚███╔╝ █████╗           **
** ╚════██║    ██║    ██╔══██╗ ██║   ██║ ██║         ██║               ██╔══╝   ██╔██╗ ██╔══╝           **
** ███████║    ██║    ██║  ██║ ╚██████╔╝ ╚██████╗    ██║       ███████╗███████╗██╔╝ ██╗███████╗███████╗ **
** ╚══════╝    ╚═╝    ╚═╝  ╚═╝  ╚═════╝   ╚═════╝    ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝ **
*********************************************************************************************************/
/* Structexe
** Estructure of hierarchical mutagenic & deep proxy reactive , EHM&DPC
** By Pedro Pablo Picado Sánchez
*/ 

// El tipo params<T> tiene que representar un objeto con las propiedades del tipo T que sean opcionales pero no permitir propiedades que no esten el T , T tiene que ser una clase

// export type Params<T extends object> = {
//   [K in keyof T]?: T[K];
// } & { [K in keyof any]: K extends keyof T ? T[K] : never };

// export function autoConstructorClass<T>(thisArg:T,params:Params<T>):T{

const internal_exe_property = Symbol('internal_exe_property')

type OptionalParams<T> = Partial<T>|undefined;
function autoConstructorClass<T extends object>(instance: T, params: OptionalParams<T>): T {
  if (params!=undefined){
    Object.keys(params).forEach( (prop) =>{       
      let propertyDescriptor = Object.getOwnPropertyDescriptor(instance,prop)      
      let valor = Object.getOwnPropertyDescriptor(params,prop)?.value 
      if (valor == undefined) valor = Object.getOwnPropertyDescriptor(params,'_' + prop)?.value           
      
      if (propertyDescriptor){
        if (!propertyDescriptor.hasOwnProperty('value')){           
          propertyDescriptor = Object.getOwnPropertyDescriptor(instance,'_' + prop) 
          if (propertyDescriptor) {
            prop = '_' + prop
          }else{
            propertyDescriptor = { configurable: true, enumerable: true, value:undefined } as PropertyDescriptor                      
          }            
        }         
        propertyDescriptor.value = valor
        Object.defineProperty(instance,prop,propertyDescriptor)
      } 
    })  
  }
  return instance
}

export type _exe_Struct = Data_exe_ | Array_exe_ | Map_exe_ | Set_exe_ 

export type ActionChange = (change:datChangeObj)=>void
export type With_exe_opt<T> = 
   T extends Map<infer K, infer V> ? Map<K, With_exe_opt<V>> & _exe_Property_opt : 
   T extends Set<infer U>          ? Set<With_exe_opt<U>> & _exe_Property_opt : 
   T extends Array<infer E>        ? Array<With_exe_opt<E>> & _exe_Property_opt : 
   T extends object                ? { [K in keyof T]: With_exe_opt<T[K]> } & _exe_Property_opt
   : T; 
export type With_exe_<T> = 
   T extends Map<infer K, infer V> ? Map<K, With_exe_<V>> & _exe_Property : 
   T extends Set<infer U>          ? Set<With_exe_<U>> & _exe_Property : 
   T extends Array<infer E>        ? Array<With_exe_<E>> & _exe_Property : 
   T extends object                ? { [K in keyof T]: With_exe_<T[K]> } & _exe_Property
   : T; 

export interface _exe_Property_opt { _exe_?:ManagementHierarchicalData; }
export interface _exe_Property { _exe_:ManagementHierarchicalData; }
export interface Data_exe_ extends Data_exe_Obj , _exe_Property { }
export interface Array_exe_ extends Array_exe_Obj , _exe_Property { }
export interface Map_exe_ extends Map_exe_Obj , _exe_Property { }
export interface Set_exe_ extends Set_exe_Obj , _exe_Property { }

export enum typeChange {'create','seter','change','geter','delete'}    
export enum stateAmbitReaction { all,local,childens,fathers,pause } // all = local + childens + fathers
export enum processingType { unset,primitiveData,object,NoObserver,NoMutation,array,map,set,Data_exe_,Array_exe_,Map_exe_,Set_exe_,function }

/**
 * *************************************************************************** 
 * @class _exe_
 *  Esta clase es la encargada de la gestión jerárquica de datos.
 *  Proporciona métodos para definir, liberar , aplicar trampas proxy y mutar propiedades de objetos.
 */
export class _exe_ {
  /**
   * Crea una instancia de gestor _exe_ sin estado interno.
   */
  constructor(){}


  static get name_simbol_internal_exe_property(){ return internal_exe_property }

  /**
   * Comprueba si un objeto tiene la propiedad internal_exe_property e implica que es un objeto gestionado por _exe_ con proxy.
   * @param target Objeto a comprobar.
   * @returns Verdadero si el objeto tiene la propiedad internal_exe_property, falso en caso contrario.
   */
  static be(target:any){ return internal_exe_property in target }


  static get_exe_(target:any):ManagementHierarchicalData{ 
    if (!_exe_.be(target)) throw new Error("El objeto no es gestionado por _exe_.")      
    return target[internal_exe_property] 
  }

  /**
   * Crea una instancia Data_exe_ a partir de un objeto.
   * @param importObj Objeto a importar.
   * @returns Instancia Data_exe_ creada.
   */
  static newData_exe_(importObj:Object):Data_exe_{
    return new Data_exe_Obj(importObj) as Data_exe_
  }

  /**
   * *************************************************************************** 
   * @method newStruct_exe_ Método que crea una instancia de Array_exe_Obj, 
   * Map_exe_Obj, Set_exe_Obj o Data_exe_Obj dependiendo del tipo de objeto y la retorna como _exe_Struct.
   * @param importObj Objeto a importar.
   * @returns {_exe_Struct} Devuelve la instancia creada como _exe_Struct.
   * @throws Error si el tipo de objeto no es compatible.
   */
  static newStruct_exe_<T>(importObj:T):_exe_Struct{    
    
    if (importObj instanceof Array) return new Array_exe_Obj(importObj) as _exe_Struct
    else if (importObj instanceof Map) return new Map_exe_Obj(importObj) as _exe_Struct
    else if (importObj instanceof Set) return new Set_exe_Obj(importObj) as _exe_Struct
    else if (importObj instanceof Object) return new Data_exe_Obj(importObj) as _exe_Struct
    else throw new Error("El tipo de objeto no es compatible con la estructura jerárquica de datos.")
  }  
  /**
   * Crea una estructura _exe_Struct y fuerza el tipado With_exe_.
   * @param importObj Objeto a importar.
   * @returns Instancia creada con el tipado With_exe_.
   */
  static newStruct_exe_fix<T>(importObj:T):With_exe_<T>{    
    return (_exe_.newStruct_exe_(importObj) as unknown) as With_exe_<T>
  }
  /**
   * Crea una estructura _exe_Struct con tipado opcional de la propiedad _exe_.
   * @param importObj Objeto a importar.
   * @returns Instancia creada con el tipado With_exe_opt.
   */
  static newStruct_exe_opt<T>(importObj:T):With_exe_opt<T> {    
    return (_exe_.newStruct_exe_(importObj) as unknown) as With_exe_opt<T>
  }

  /**
   * *************************************************************************** 
   * @method free Metodo que borra la propiedad de la instancia.
   * @param property Nombre de la propiedad
   * @returns {Data_exe_} debuelve el objeto contenedor de la instancia. 
   */
  static free<T>(target:T,property:string=''):T{
    if ((typeof target).toString() == "Data_exe_") delete (target as unknown as Data_exe_)[property]
    else if ((typeof target).toString() == "Array_exe_") delete (target as unknown as Array_exe_)[Number(property)]
    else if ((typeof target).toString() == "Map_exe_") (target as unknown as Map_exe_).delete(property)
    else if ((typeof target).toString() == "Set_exe_") (target as unknown as Set_exe_).delete(property)
    return target
  }

  /**
   * *************************************************************************** 
   * @method defineIfn Metodo que definirá y/o creará condicionalmente una propiedad de 
   * esta instancia si no está definida , entá definida a Undefined o tiene el valor indicado en el parametro oval.
   * @param property Nombre de la propiedad
   * @param value Objeto o valor a asignar
   * @param oval Valor de la propiedad que asumirá como Undefined , asignando value a la propiedad como si no estubiese definida.
   * @param muting Indica si se mutará el destino o no.
   * @returns {_exe_Struct} debuelve el objeto contenedor de la instancia. 
   * @see define Este método utiliza el metodo define en caso de definir la propiedad     
   */    
  static setIfn_<T>(target:T,property:string,value?:any,oval:any=undefined,muting?:boolean):With_exe_<T> {               
    let actVal = _exe_.getByStr(target,property)
    if (actVal==undefined || actVal.toString()!=oval.toString()) 
      _exe_.set(target,property,value,muting)
    return (target as unknown as With_exe_<T>)
  }  

  /**
   * @method ghostSet (USO INTERNO) Asigna un valor a una propiedad de una instancia de _exe_Struct sin lanzar reacciones.
   * @param thisArg Instancia de _exe_Struct.
   * @param property property solo podrá tener nombres de las propiedades de thisArg  
   * @param value Valor a asignar.
   * @param muting Indica si se mutará el destino o no.
   * @returns {With_exe_<T>} Devuelve la instancia con el valor asignado.
   */
  static ghostSet<T>(thisArg:any,property:string,value:T,muting?:boolean):With_exe_<T>{
    let returValue!:With_exe_<T>    
    let manage = _exe_.get_exe_(thisArg).rootManagement
    let manageBufferState = manage.getBuffer()
    let subBufferId:number = -1
    if (manageBufferState) subBufferId = manage.pushSubBuffer()
    manage.setBuffer(true)
    returValue = _exe_.set<T>(thisArg,property,value,muting)
    manage.clearBuffer()
    manage.setBuffer(false)    
    if (manageBufferState) manage.popSubBuffer(subBufferId)
    manage.setBuffer(manageBufferState)
    return returValue    
  }

  /**
   * *************************************************************************** 
   * @method setProperty (USO INTERNO) Asigna un valor a una propiedad de una instancia de _exe_Struct.
   * @param thisArg Instancia de _exe_Struct.
   * @param property property solo podrá tener nombres de las propiedades de thisArg  
   * @param value Valor a asignar.
   * @param muting Indica si se mutará el destino o no.
   * @param transformValue Indica si se transformará el valor al tipo de estructura de destino si existe
   * @returns {With_exe_<T>} Devuelve la instancia con el valor asignado.
   */
  
  static setProperty_strict<T>(thisArg:any,property:string,value:T,muting:boolean,transformValue:boolean,_exe_Path:string,_exe_Struct:_exe_Struct):With_exe_<T>{
    let typeValue!:processingType
    let typeTarget!:processingType
    let path = _exe_.path(_exe_Struct)
    let oldValue = _exe_.export(thisArg,property)
    let target = _exe_.getByStr(thisArg,property)
    let transformedValue:any = value
    let propertyCreated = false

    muting = muting || _exe_.get_exe_(_exe_Struct).mutating    
    typeValue = (muting) ? _exe_.gestType(value) : processingType.NoMutation
    typeTarget = _exe_.gestType(target)    

    // Transform value to _exe_ structure if transformValue is enabled and muting is enabled
    if (transformValue && muting) {
      switch (typeValue) {
        case processingType.array:
          transformedValue = new Array_exe_Obj(value as any[], _exe_Struct, property)
          break
        case processingType.map:
          transformedValue = new Map_exe_Obj(value as Map<any,any>, _exe_Struct, property)
          break
        case processingType.set:
          transformedValue = new Set_exe_Obj(value as Set<any>, _exe_Struct, property)
          break
        case processingType.object:
          transformedValue = new Data_exe_Obj(value as object, _exe_Struct, property)
          break
        default:
          transformedValue = value
      }
    }

    // Handle property creation and assignment based on target type
    switch (typeTarget) {
      case processingType.Array_exe_: {                         
        while ((target as any[]).length < (Number(property)+1)){            
          (target as any[]).push(undefined)  
          thisArg._exe_.rootManagement.callReact(new datChangeObj({ 
            ruta:path+'['+((target as any[]).length-1)+']',
            hito:typeChange.create,
            ambito:stateAmbitReaction.local,
            datoNuevo:undefined,
            datoActual:undefined
          }))                                             
        } 
        (target as Array_exe_)[Number(property)] = transformedValue
        path += '['+property+']'
        break  
      }
      case processingType.Map_exe_: { 
        if (!(target as Map_exe_).has(property)){
          (target as Map_exe_).set(property, undefined)
          propertyCreated = true
          thisArg._exe_.rootManagement.callReact(new datChangeObj({
            ruta:path+'['+property+']',
            hito:typeChange.create,
            ambito:stateAmbitReaction.local,
            datoNuevo:undefined,
            datoActual:undefined
          }))                                             
        }
        (target as Map_exe_).set(property, transformedValue)
        path += '['+property+']'
        break  
      }
      case processingType.Set_exe_: { 
        if (!(target as Set_exe_).has(transformedValue)){
          property = (target as Set_exe_).size.toString();
          (target as Set_exe_).add(transformedValue)
          propertyCreated = true
          thisArg._exe_.rootManagement.callReact(new datChangeObj({
            ruta:path+'['+property+']',
            hito:typeChange.create,
            ambito:stateAmbitReaction.local,
            datoNuevo:transformedValue,
            datoActual:undefined
          }))                                             
        } else {
          (target as Set_exe_).forEach((item:any, index:number) => { 
            if (item === transformedValue) property = index.toString() 
          })
        }
        path += '['+property+']'
        break  
      }               
      case processingType.Data_exe_: {
        if (!(property in (target as Data_exe_))){
          (target as Data_exe_)[property] = undefined
          propertyCreated = true
          thisArg._exe_.rootManagement.callReact(new datChangeObj({
            ruta:path+'|'+property,
            hito:typeChange.create,
            ambito:stateAmbitReaction.local,
            datoNuevo:undefined,
            datoActual:undefined
          }))                                             
        } 
        (target as Data_exe_)[property] = transformedValue
        path += '|'+property
        break
      }
      default: {
        // For primitive targets or unknown types, assign directly to thisArg
        (thisArg as any)[property] = transformedValue
        path += '|'+property
      }
    } 

    // Trigger set reaction
    thisArg._exe_.rootManagement.callReact(new datChangeObj({
      ruta:path,
      hito:typeChange.seter,
      ambito:stateAmbitReaction.local,
      datoNuevo:transformedValue,
      datoActual:oldValue
    }))

    return transformedValue as With_exe_<T>
  }

  /**
   * *************************************************************************** 
   * @method set Metodo que asignará y/o creará una o varias propiedades de 
   * esta instancia.
   * @param target Objeto de destino para la asignación 
   * @param path Ruta de la propiedad 
   * @param value Objeto o valor a asignar
   * @param muting Indica si se mutará el destino o no.
   * @param transformValue Indica si se transformará el valor al tipo de estructura de destino si existe
   * @returns {With_exe_<T>} debuelve el objeto contenedor de la instancia. 
   */  
  static set<T>(thisArg:any,path:string,value:T,muting?:boolean,transformValue:boolean = true):With_exe_<T>{
    let returnValue : With_exe_<T> = undefined as any        
    if (!_exe_.be(thisArg)){
      throw new Error("El objeto no tiene la propiedad _exe_ o no es compatible con la estructura jerárquica de datos.")
      // PPPS mejorar el mensaje de error
    }        
    // Multiplexa la asignación de la propiedad a través de la ruta jerárquica con comodines
    _exe_.route(thisArg,path,(propertyValue:any,propertyName:string,structTarget:any,_exe_Path:string,_exe_Struct:_exe_Struct) => {
      muting = (muting!=undefined)? muting : _exe_.get_exe_(_exe_Struct).mutating    
      returnValue = _exe_.setProperty_strict(structTarget,propertyName,value,muting,transformValue,_exe_Path,_exe_Struct) 
    },(err:string) => { throw new Error(err) })
    return returnValue
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
  static getByStr(target:any,property:string,callBackfnOk?:(value:any)=>void,callbackfnKo?:(err:string)=>void):any{    
    let value : any = undefined
    let err : string = ''
    let objectErr : string = ''
    
    switch (_exe_.gestType(target)){
      case processingType.object:{
        if (!(property in (target as object))) err = `property ${property} not found in "${target.toString()}"`          
        else value = Object.getOwnPropertyDescriptor(target,property)?.value
        break; 
      }
      case processingType.Data_exe_:{
        if (!(target.hasOwnProperty(property))) err = `property ${property} not found in "${_exe_.path(target)}"`
        else value = (target as Data_exe_)[property]
        break; 
      }        
      case processingType.map:
      case processingType.Map_exe_:{
        if ((target as Map<any,any>).has(property)) value = (target as Map<any,any>).get(property)
        else {
          let numProperty = Number(property)
          if (!isNaN(numProperty) && numProperty<(target as Map<any,any>).size) 
            value = Array.from((target as Map<any,any>).values())[numProperty]
          else {
            objectErr = ( _exe_.be(target) )? _exe_.path(target) : target.toString()
            err = `property ${property} not found in " ${ objectErr }"`
          }          
        }
        break; 
      }        
      case processingType.set:
      case processingType.Set_exe_:{
        if ((target as Set<any>).has(property)) value = property
        else {
          let numProperty = Number(property)
          if (!isNaN(numProperty) && numProperty<(target as Set<any>).size) value = Array.from((target as Set<any>).values())[numProperty]  
          else {
            objectErr = ( _exe_.be(target) )? _exe_.path(target) : target.toString()
            err = `property ${property} not found in " ${ objectErr }"`
          }
        }
        break; 
      }        
      default:
        err = `Object or property typeError: ${property} in "${target.toString()}"`
    }    

    if (err!=''){
      if (callbackfnKo) callbackfnKo(err)
    } else {
      if (callBackfnOk) callBackfnOk(value)
    }
    return value
  }

  /**	
   * ***************************************************************************
   * Recorre un Objeto por un path y devuelve el valor encontrado o undefined si no lo encuentra.
   * @param cursor Objeto por el cual se va a recorrer el path
   * @param path Path por el cual se va a recorrer el cursor
   * @param callBackfnOk Función que se va a llamar si se encuentra el valor
   * @param callbackfnKo Función que se va a llamar si no se encuentra el valor
   * @returns Valor encontrado o undefined si no se encuentra
   */
  static route(cursor:Object,path:string='',callBackfnOk?:(value:any,property:string,struct:any,_exe_Path:string,_exe_Struct:_exe_Struct)=>void,callbackfnKo?:(err:string)=>void,altOrigin?:{cursor:Object,path:string,_exe_Path:string,_exe_Struct:_exe_Struct}):any{    
    let pathCursor = path
    let keyFind!:string 
    let valueFind!:string 
    let all!:boolean 
    let propertyes!:Array<string>
    let property!:string 
    let ok!:boolean 
    let returnValue:any = undefined
    let iteration:boolean = false
    let _exe_Path:string|undefined = undefined
    let _exe_Struct:_exe_Struct|undefined = undefined

    let koFunction = () => {
      // ¡¡¡ En desarrollo navegación por path no soportada totalmente para objetos no Data_exe_ PPPS        
      if (callbackfnKo) callbackfnKo('this is not a Data_exe_ object')
      return undefined
    }

    if (typeof cursor=='object'){
      if ( _exe_.be(cursor) ){
        if (path==='') path = _exe_.path(cursor)
        if (path[0]=='/'){
          cursor = _exe_.get_exe_(cursor).rootManagement.root
          pathCursor = path.slice((path.length>1 && path[1]==='|')?2:1)                  
        } 
      } else if (altOrigin){
        if (path==='') {
          if (callBackfnOk) callBackfnOk(cursor,altOrigin.path,altOrigin.cursor,altOrigin._exe_Path,altOrigin._exe_Struct)          
          return cursor
        }
        if  (path[0]==='/'){
          cursor = altOrigin.cursor
          pathCursor = path.slice((path.length>1 && path[1]==='|')?2:1)  // eliminamos el primer / si hay uno y el | si hay uno
        }
      } else koFunction()

      propertyes = pathCursor.replaceAll('[','|').replaceAll(']','').split('|')
      property = (altOrigin)?  altOrigin.path : ''
      ok = true
      returnValue = cursor

      while (ok && propertyes.length){

        if ( _exe_.be(returnValue) ){
          _exe_Path = propertyes.join('|')           
          _exe_Struct = returnValue as unknown as _exe_Struct
        } else if (altOrigin){
          _exe_Path = _exe_Path || altOrigin._exe_Path
          _exe_Struct = _exe_Struct || altOrigin._exe_Struct
        } else if (_exe_Struct===undefined || _exe_Path===undefined){
          throw new Error(`Error of hierarchy , path "${path}" , property "${property}", not found in cursor "${returnValue.toString()}" `)
        }

        property = (propertyes.shift() || '')
        cursor = returnValue 

        if (['?','*','(?)','(*)'].includes(property)) { 
          all = true; 
          property = "(?:?)" 
        } else {
          all = false
        }         

        if (property[0]!='('){
          returnValue = _exe_.getByStr(cursor,property,() => {},(err) => ok=false)                
        } else {
          [keyFind,valueFind] = property.slice(1,property.length-1).split(':')          
          ok = false
          _exe_.forEach(cursor,(value,realKey,stringKey) => {
            if ( (keyFind==='?' || keyFind===stringKey) && (all || valueFind===value.toString()) ) {
               ok = true 
               iteration = true
               returnValue = _exe_.route(value,propertyes.join('|'),callBackfnOk,callbackfnKo,{cursor:cursor,path:stringKey||'',_exe_Path:_exe_Path!,_exe_Struct:_exe_Struct!})               
            }
          })
          propertyes = []
        }
      }

      if (callbackfnKo && !ok && !iteration) callbackfnKo(`property ${property} not found in "${path}" rest path => ${propertyes.join('|')}`)        
      if (callBackfnOk && ok && !iteration) callBackfnOk(returnValue,property,cursor,_exe_Path!,_exe_Struct!)          
      return returnValue

    } else {
      if (altOrigin){
        if (path==='') {
          if (callBackfnOk) callBackfnOk(cursor,altOrigin.path,altOrigin.cursor,_exe_Path!,_exe_Struct!)          
          return cursor
        }        
      }
      koFunction()
    }    
  }

  /**
   * Recorre una estructura y ejecuta un callback por cada elemento.
   * @param target Estructura objetivo (objeto, array, map o set).
   * @param callbackfn Función a ejecutar por cada elemento.
   * @param thisArg Contexto opcional para el callback.
   * @returns void
   */
  static forEach(target:any,callbackfn: (value:any , realKey?:any,stringKey?: string, target?:any ) => void,thisArg?: any): void{
    let arrayKeyValues: Array<[value:any,realKey:any,stringKey: string]> = []
    switch (_exe_.gestType(target)){
      case processingType.object:
      case processingType.Data_exe_:
        arrayKeyValues  = Object.entries(target).map( (item) => [item[1],item[0],item[0].toString()])
        break;        
      case processingType.map:
      case processingType.Map_exe_:
        arrayKeyValues  = Array.from((target as Map<any,any>).entries()).map( (item) => [item[1],item[0],item[0].toString()])
        break;
      case processingType.set:
      case processingType.Set_exe_:
        arrayKeyValues  = Array.from((target as Set<any>).values()).map( (item,index) => [item,item,index.toString()])
        break;
      case processingType.array:
      case processingType.Array_exe_:
        arrayKeyValues  = (target as any[]).map( (item,index) => [item,index,index.toString()])
        break;
      default:
        arrayKeyValues  = []
        break;
    }
    
    arrayKeyValues.forEach( (item) => { callbackfn.call(thisArg,item[0],item[1],item[2],target) })
    
  };

  /**	
   * ***************************************************************************
   * @method export Exporta propiedades de esta instancia o esta instancia a un objeto plano o a un objeto aportado.
   * @param thisArg Instancia de la cual se exportaran propiedades
   * @param property Nombre de la propiedad a exportar
   * @param targetFill Objeto de destino de la exportación ¡¡ En desarrollo PPPS !!     
   * @returns Objeto plano o dato simple
   */
    static export(thisArg:any,property:string='',targetFill?:object|any[]|Map<any,any>|Set<any>):any{       
      // PPPS necesita desarrollar mejora de exportación adminiendo rutas desarrollar con route()
      let origen = (property=='')? thisArg : _exe_.getByStr(thisArg,property)                    
      let target:any = origen
      let descriptor:PropertyDescriptor
      switch (_exe_.gestType(origen)){
        case processingType.Data_exe_:{           
          target = new Object()
          _exe_.forEach(origen, (value,realKey) => {            
            descriptor = { configurable: true, enumerable: true, value: _exe_.export(value), writable: true, } 
            Object.defineProperty(target,realKey,descriptor)
          })
          break
        } 
        case processingType.Map_exe_:{ 
          target = new Map<any,any>()
          _exe_.forEach(origen, (value,realKey) => { target.set(realKey,_exe_.export(value))})
          break
        }   
        case processingType.Set_exe_:{ 
          target = new Set<any>()
          _exe_.forEach(origen, (value) => { target.add(_exe_.export(value))})
          break
        }   
        case processingType.Array_exe_:{ 
          target = new Array<any>()
          _exe_.forEach(origen, (value,realKey) => { target[realKey] = _exe_.export(value)})
          break
        }   
        case processingType.object:
        case processingType.map:
        case processingType.set:
        case processingType.array:{
          if ( _exe_.be(origen) )
            target = (origen._exe_ as ManagementHierarchicalData).structObj
          break
        }              
        default:             
            // processingType.NoMutation, processingType.primitiveData, processingType.NoObserver, processingType.function, processingType.unset ...          
          break;
      }
      return target
    }


  /**
   * *************************************************************************** 
   * @method reaction Metodo que creará una reacción.
   * @param path Ruta de la propiedad a reaccionar.
   * @param action Acción a ejecutar.
   * @param component Componente a ejecutar.
   * @returns {Reaction} debuelve la reacción ejecutada.
   */
  static react(thisArg:any,path:string|datChangeObj,action:ActionChange,component?:Object):Reaction{          
      let manager = _exe_.get_exe_(thisArg)        
      if (typeof path=='string'){
        // posible mejora identificación de propiedad en caso de ser array/map/set PPPS
        path = (path.indexOf('/')===0)? path : manager.path + ( (path.indexOf('[')===0)? '' : '|' ) + path 
        path = new datChangeObj({ruta:path})        
      } 
      return manager.rootManagement.react(path,action,component)   
  }

  /**
   * *************************************************************************** 
   * @method declineReaction Metodo que cancelará una reacción creada con reaction.
   * @param idReaction Identificador de la reacción.
   */
  static declineReact(thisArg:any,idReaction:number|Reaction):Reaction{
      let manager = _exe_.get_exe_(thisArg)
      return manager.rootManagement.declineReact(idReaction)
  }

  /**
   * *************************************************************************** 
   * @method typerData Metodo que Mixeará el typo del objeto recibido en Obj con _exe_Property.
   * @param obj Objeto to typer.
   * @returns {With_exe_<T>} debuelve la instancia con la propiedad definida. 
   * @see _exe_Property
   * @see With_exe_
   */
  static typerData<T>(obj:T):With_exe_<T>{ 
    let manager = _exe_.get_exe_(obj)
    return manager.proxyObj as With_exe_<T> 
  }
  
  /**
   * *************************************************************************** 
   * @method path Metodo que devolverá la ruta de la instancia.
   * @returns {string} debuelve la ruta de la instancia. 
   */
  static path(thisArg:any):string{ 
    let manager = _exe_.get_exe_(thisArg)
    return manager.path 
  }
  

  /**
   * *************************************************************************** 
   * @method gestType Metodo que devolverá el tipo procesado que deberá recibir el dato.
   * @param valueTest Instancia a testear.
   * @returns {processingType} debuelve el tipo procesado dato. 
   * @see processingType
   */
  static gestType(valueTest:any):processingType{
    if (typeof valueTest == 'object')                
      switch (valueTest.constructor.name) {         
        case "Boolean": case "Number": case "BigInt" : case "String": case "Symbol": case "RegExp": case 'Date' : return processingType.primitiveData ; 
        case "WeakMap" : case "WeakSet" : case "ArrayBuffer" : case "SharedArrayBuffer" : return processingType.primitiveData; 
        case "DataView" : case "ArrayBufferView" : case "Promise" : case "GeneratorFunction" : return processingType.primitiveData; 
        case "Subject" : case "BehaviorSubject" : case "Observable" : case "Subscription" : return processingType.primitiveData; 
        case "Set" : return processingType.set; case "Map" : return processingType.map; case "Array" : return processingType.array; 
        case "Data_exe_Obj" : return processingType.Data_exe_;  
        case "Set_exe_Obj" : return processingType.Set_exe_;  case "Map_exe_Obj" : return processingType.Map_exe_; case "Array_exe_Obj" :  return processingType.Array_exe_; 
        default :{
          if (Array.isArray(valueTest)) return processingType.array
          else if (valueTest instanceof Map) return processingType.map
          else if (valueTest instanceof Set) return processingType.set            
          else if (valueTest instanceof Object) {
              if ('selector' in valueTest && 'standalone' in valueTest) return processingType.NoMutation                              
              else return processingType.object
          } else return processingType.primitiveData
        }          
      }
    else{        
      if (typeof valueTest == 'function') return processingType.function
      else return processingType.primitiveData 
    } 
  }
  
  /**
   * *************************************************************************** 
   * @method proxyStruct Metodo que creará un proxy para la instancia de la clase.
   * @param type Tipo de instancia a crear.
   * @param fatherStruct Instancia padre.
   * @param fatherProperty Propiedad padre.
   * @returns {_exe_Struct} debuelve la instancia proxy. 
   */
  static proxyStruct(thisArg:any,type:processingType,fatherStruct?:_exe_Struct,fatherProperty?:string):_exe_Struct{
    let managementHierarchicalData = new ManagementHierarchicalDataObj() as ManagementHierarchicalData                  
    let typeProcessing = type
    managementHierarchicalData.structObj = thisArg    
    switch (type) {
      case processingType.Array_exe_:
      case processingType.Data_exe_: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {                                        
          defineProperty(target:object, property:string, descriptor:PropertyDescriptor){                      
            managementHierarchicalData.set(property.toString(),descriptor.value)
            // Posible mejora con validación de fallo creación de propiedad PPPS
            return true
          },
          set(target:object, property:string, val:any, receiver:any) {                  
            managementHierarchicalData.set(property.toString(),val)
            // Posible mejora con validación de fallo asignación PPPS
            return true
          },
          get(target:object, property:string|symbol, receiver:any) {                              
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            if (property=='_exe_' && !('_exe_' in target)){
              return managementHierarchicalData as ManagementHierarchicalData
            } else {
              let value = Reflect.get(target,property,receiver)
              if (managementHierarchicalData.rootManagement.observingGets){
                managementHierarchicalData.rootManagement.callReact( new datChangeObj({ ruta:managementHierarchicalData.path + (typeProcessing==processingType.Array_exe_)? '[' + property.toString() + ']' : '|' + property.toString() ,
                                                                                        hito:typeChange.geter,
                                                                                        ambito:stateAmbitReaction.local,
                                                                                        datoNuevo:value,
                                                                                        datoActual:undefined}))
              }
              return value
            } 
            
          },  
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target,property)
          },    
        } as ProxyHandler<Object> ) as _exe_Struct   
        break
      }
      case processingType.Set_exe_: 
      case processingType.Map_exe_: {
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          defineProperty(target:object, property:string, descriptor:PropertyDescriptor){          
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (Reflect.defineProperty(target,property,descriptor)){
              management_exe_.rootManagement.callReact(new datChangeObj({ ruta:management_exe_.path + '|' + property,
                                                                          hito:typeChange.create,
                                                                          ambito:stateAmbitReaction.local,
                                                                          datoNuevo:descriptor.value,
                                                                          datoActual:undefined}))
              return true
            } else return false
          },
          set(target:object, property:string, val:any, receiver:any) {                  
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            let oldValue = Object.getOwnPropertyDescriptor(target,property)?.value
            if (Reflect.set(target,property,val,receiver)){
              management_exe_.rootManagement.callReact(new datChangeObj({ ruta:management_exe_.path + '|' + property,
                                                                          hito:typeChange.seter,
                                                                          ambito:stateAmbitReaction.local,
                                                                          datoNuevo:val,
                                                                          datoActual:oldValue}))
              return true
            } else return false 
          },
          get(target:object, property:string|symbol, receiver:any) {
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property=='_exe_' && !('_exe_' in target))? management_exe_ : Reflect.get(target, property, receiver);            
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))){              
              if (property in ['set','add']){
                value = function(propertyKey:any, propertyValue:any) {                
                  propertyValue = management_exe_.set(propertyKey,propertyValue)             
                  return management_exe_.proxyObj                              
                } 
              } else value = value.bind(target)
            } else if (management_exe_.rootManagement.observingGets){
              management_exe_.rootManagement.callReact( new datChangeObj({  ruta:management_exe_.path + '[' + property.toString() + ']',
                                                                            hito:typeChange.geter,
                                                                            ambito:stateAmbitReaction.local,
                                                                            datoNuevo:value,
                                                                            datoActual:undefined}))
            }
            return value;           
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target,property)
          },    
        } as ProxyHandler<Object> ) as _exe_Struct
        break
      }     
      case processingType.NoObserver: { 
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          get(target:object, property:string|symbol, receiver:any) {                              
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property=='_exe_' && !('_exe_' in target))? management_exe_ : Reflect.get(target, property, receiver);            
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))){
              let valueBound = value.bind(target) 
              value = function(propertyKey:any, propertyValue:any) {                
                return valueBound(propertyKey, propertyValue)                
              } 
            }
            return value;           
          },      
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target,property)
          },    
        } as ProxyHandler<Object> ) as any
        break
      } 
      
      default:
        managementHierarchicalData.proxyObj = new Proxy(thisArg, {
          defineProperty(target:object, property:string, descriptor:PropertyDescriptor){          
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (Reflect.defineProperty(target,property,descriptor)){
              management_exe_.rootManagement.callReact(new datChangeObj({ ruta:management_exe_.path + '|' + property,
                                                                          hito:typeChange.create,
                                                                          ambito:stateAmbitReaction.local,
                                                                          datoNuevo:descriptor.value,
                                                                          datoActual:undefined}))                                
              return true
            } else return false 
          },
          set(target:object, property:string, val:any, receiver:any) {                  
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            let oldValue = Object.getOwnPropertyDescriptor(target,property)?.value
            if (Reflect.set(target,property,val,receiver)){
              let propertySep = (Array.isArray(target))  ? '[' + property + ']' : '|' + property
              management_exe_.rootManagement.callReact(new datChangeObj({ ruta:management_exe_.path + propertySep,
                                                                          hito:typeChange.seter,
                                                                          ambito:stateAmbitReaction.local,
                                                                          datoNuevo:val,
                                                                          datoActual:oldValue}))
              return true
            } else return false 
          },
          get(target:object, property:string|symbol, receiver:any) {                  
            let management_exe_ = managementHierarchicalData as ManagementHierarchicalData
            if (property == internal_exe_property) return managementHierarchicalData as ManagementHierarchicalData
            var value = (property=='_exe_' && !('_exe_' in target))? management_exe_ : Reflect.get(target, property, receiver);            
            if (typeof value === "function" && ((target instanceof Set) || (target instanceof Map))){
              if (property==='set' || property==='add'){
                let valueBound = value.bind(target)
                value = function(propertyKey:any, propertyValue:any) {
                  let oldValue = Object.getOwnPropertyDescriptor(target,propertyKey)?.value
                  if (valueBound(propertyKey, propertyValue)){
                    if (property === "set") (target as Set<any>).forEach( (item:any,index:number) => { if (item === propertyValue) propertyKey = index.toString() })
                    management_exe_.rootManagement.callReact(new datChangeObj({ ruta:management_exe_.path + '[' + propertyKey + ']', 
                                                                                hito:typeChange.seter,
                                                                                ambito:stateAmbitReaction.local,
                                                                                datoNuevo:propertyValue,
                                                                                datoActual:oldValue}))                  
                  }
                  return management_exe_.proxyObj         
                }
              }                     
            } else if (management_exe_.rootManagement.observingGets){
              let propertySep = (Array.isArray(target))  ? '[' + property.toString() + ']' : '|' + property.toString()
              management_exe_.rootManagement.callReact(
                new datChangeObj({  ruta:management_exe_.path + propertySep, 
                                    hito:typeChange.geter,
                                    ambito:stateAmbitReaction.local,
                                    datoNuevo:value,
                                    datoActual:undefined}))
            }
            return value;           
          },
          has(target, property) {
            if (property == internal_exe_property) return true
            return Reflect.has(target,property)
          },      
        } as ProxyHandler<Object> ) as _exe_Struct
        break
      }    
    if (fatherStruct && fatherProperty){
      if (fatherStruct.constructor.name in ['Array_exe_','Set_exe_','Map_exe_','Array','Set','Map']) 
        fatherProperty = '[' + fatherProperty + ']'
      else
        fatherProperty = '|' + fatherProperty
      managementHierarchicalData.path = _exe_.path(fatherStruct) + fatherProperty
      managementHierarchicalData.rootManagement = _exe_.get_exe_(fatherStruct).rootManagement
    } else managementHierarchicalData.rootManagement = new ManagementReactionsObj(managementHierarchicalData.proxyObj)    
    return managementHierarchicalData.proxyObj as _exe_Struct
  }  
}

/**
 * ***************************************************************************
 *  Clase para la estructura de datos jerárquica con eventos de cambio profundo.
 *  Objects are used as a store for data structures with deep change events.
 *  Instances of this Objects parse structures and host them as instances of this class so that the root object receives change events from its children.
 *  @see Datos Is the interface of this class.
 */
  class Data_exe_Obj {    
    /**
     * Crea una estructura Data_exe_ y enlaza su nodo padre.
     * @param importObj Objeto a importar.
     * @param father Estructura padre.
     * @param fatherProperty Propiedad en el padre.
     */
    constructor(importObj?:object,father?:_exe_Struct,fatherProperty?:string){                        
      let thisObj = _exe_.proxyStruct(this,processingType.Data_exe_,father,fatherProperty) as Data_exe_
      _exe_.set(thisObj,'',importObj)
      return thisObj
    }  
    [index: string|symbol]: any,             
  }
  
  class Array_exe_Obj extends Array<any> {    
    /**
     * Crea una estructura Array_exe_ y enlaza su nodo padre.
     * @param importObj Objeto a importar.
     * @param father Estructura padre.
     * @param fatherProperty Propiedad en el padre.
     */
    constructor(importObj?:object,father?:_exe_Struct,fatherProperty?:string){
      super()
      let thisObj = _exe_.proxyStruct(this,processingType.Array_exe_,father,fatherProperty) as Array_exe_
      _exe_.set(thisObj,'',importObj)
      return thisObj
    }
  }
  
  class Map_exe_Obj extends Map<any,any> {    
    /**
     * Crea una estructura Map_exe_ y enlaza su nodo padre.
     * @param importObj Objeto a importar.
     * @param father Estructura padre.
     * @param fatherProperty Propiedad en el padre.
     */
    constructor(importObj?:object,father?:_exe_Struct,fatherProperty?:string){
      super()
      let thisObj = _exe_.proxyStruct(this,processingType.Map_exe_,father,fatherProperty) as Map_exe_
      _exe_.set(thisObj,'',importObj)
      return thisObj
    }
  }
  
  class Set_exe_Obj extends Set<any> {    
    /**
     * Crea una estructura Set_exe_ y enlaza su nodo padre.
     * @param importObj Objeto a importar.
     * @param father Estructura padre.
     * @param fatherProperty Propiedad en el padre.
     */
    constructor(importObj?:object,father?:_exe_Struct,fatherProperty?:string){
      super()
      let thisObj = _exe_.proxyStruct(this,processingType.Set_exe_,father,fatherProperty) as Set_exe_
      _exe_.set(thisObj,'',importObj)
      return thisObj 
    }
  }

export interface ManagementReaction extends ManagementReactionObj {}
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
  constructor(inicialValues?:Partial<ManagementReactionObj>){ Object.assign(this,inicialValues) }
    [index: string]: any
    /** @property Número de llamadas al evento */
    "calls":number = 0    
    /** @property Estado de la subscripción */
    "status":stateAmbitReaction = stateAmbitReaction.local
    /** @property Indice de la subscripción */
    "id":number = 0
}


export interface Reaction extends ReactionObj {}
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
constructor(inicialValues?:Partial<ReactionObj>){ Object.assign(this,inicialValues) 
    this.change = new datChangeObj(this.change)
    this.manage = new ManagementReactionObj(this.manage)
  }
    [index: string]: any
    /** @property Objeto de cambio de datos */
    "change": datChangeObj = new datChangeObj()
    /** @property Función a ejecutar cuando cambia el valor */
    "action": ActionChange = () => {}
    /** @property Contexto en el que se ejecutará la función */
    "thisArg": any = undefined
    /** @property Objeto de gestión de subscripción */
    "calls":number = 0    
    /** @property Objeto de gestión de subscripción */
    "manage"!: ManagementReaction 
    /** @property Función para cancelar la subscripción */
    "declineReact":()=>void
}

export interface datChange extends datChangeObj {} 
/**
 * @interface datChange Este objeto es utilizado como respuesta en los eventos de la estructura
 * @class datChangeObj
 * @see datChange
 * @see _exe_Struct
 */
export class datChangeObj{
  /**
   * @constructor 
   * @param ruta Ruta del cambio o listaParametros
   * @param hito Hito del cambio
   * @param ambito Ambito del cambio
   * @param datoNuevo Dato Nuevo
   * @param datoActual Dato Actual
   */
  constructor(inicialValues?:Partial<datChangeObj>){ Object.assign(this,inicialValues) }
  "ruta":string=''
  "datoNuevo":any=undefined
  "datoActual":any=undefined
  "hito":typeChange=typeChange.change
  "ambito":stateAmbitReaction=stateAmbitReaction.local
  "thisArg":any=undefined
}

  interface ManagementHierarchicalData extends ManagementHierarchicalDataObj,ProtoManagementHierarchicalDataObj {} 
  /**
   * @class managementHierarchicalDataObj
   * Datos de gestión para un elemento de estructura tipo Data_exe_
   * Su interfaz seria managementHierarchicalData
   * @see managementHierarchicalData
   */
  export class ManagementHierarchicalDataObj{    
    /**
     * Crea una instancia y aplica inicialización de parámetros si se proveen.
     * @param path Ruta de la estructura
     * @param structObj Objeto de la estructura
     * @param proxyObj Objeto proxy de la estructura
     * @param mutating Indica si se mutará el destino o no.
     * @param observing Indica si se observará el destino o no.
     * @param rootManagement Objeto de gestión raiz.
     */
    constructor(inicialValues?:Partial<ManagementHierarchicalDataObj>){ Object.assign(this,inicialValues) }
    path: string = '/'
    structObj!:any    
    proxyObj!:any  
    mutating:boolean = true
    observing:boolean = true    
    rootManagement!:ManagementReactionsObj
  }

  /**
   * @class ProtoManagementHierarchicalDataObj
   * Clase para los nodos de la estructura de datos jerárquica con eventos de cambio profundo.
   */
class ProtoManagementHierarchicalDataObj{
  /**
   * Crea una instancia base de gestión jerárquica para el prototipo de esta.
   */
  constructor(){}
    
  /**
   * *************************************************************************** 
   * @method setIf_  Metodo que definirá y/o creará condicionalmente una propiedad de 
   * esta instancia si no está definida , entá definida a Undefined o tiene el valor indicado en el parametro oval.
   * @param property Nombre de la propiedad
   * @param value Objeto o valor a asignar
   * @param oval Valor de la propiedad que asumirá como Undefined , asignando value a la propiedad como si no estubiese definida.
   * @param muting Indica si se mutará el destino o no.
   * @returns {Data_exe_} setIf_ debuelve el objeto contenedor de la instancia setIf debuelve valor de la propiedad asignada. 
   * @see _exe_.set Este método utiliza el metodo set en caso de definir la propiedad     
   */       
  public setIf_<T>(property:string,value:T,oval:any=undefined,muting?:boolean):With_exe_<T> {           
    return _exe_.setIfn_((this as unknown as ManagementHierarchicalData).proxyObj,property||'',value,oval,muting)
  }    
/**
   * *************************************************************************** 
   * @method setIf Metodo que definirá y/o creará condicionalmente una propiedad de 
   * esta instancia si no está definida , entá definida a Undefined o tiene el valor indicado en el parametro oval.
   * @param property Nombre de la propiedad
   * @param value Objeto o valor a asignar
   * @param oval Valor de la propiedad que asumirá como Undefined , asignando value a la propiedad como si no estubiese definida.
   * @param muting Indica si se mutará el destino o no.
   * @returns {With_exe_<T>} Debuelve la propiedad asignada. 
   * @see _exe_.set Este método utiliza el metodo set en caso de definir la propiedad     
   */       
  public setIf<T>(property:string,value:T,oval:any=undefined,muting?:boolean):With_exe_<T> {                   
    return (_exe_.setIfn_((this as unknown as ManagementHierarchicalData).proxyObj,property||'',value,oval,muting) as _exe_Struct)._exe_.getByStr(property)
  }  

  /** 
   * ***************************************************************************
   * @method set_ Metodo que definirá y/o creará una propiedad parseando los datos según parametro y proxeando la estructura. 
   * @param property Nombre de la propiedad
   * @param value Objeto o valor a asignar
   * @param muting Indica si debe de transformar los Objetos de las propiedades en una estructura de DatosObj recursivamente.
   * @returns {Data_exe_} debuelve el objeto contenedor de la instancia. 
   */
  public set_<T>(property:string,value:any,muting?:boolean):With_exe_<T> { 
    return _exe_.set((this as unknown as ManagementHierarchicalData).proxyObj,property,value,muting) 
  }
  /**
   * @method set Define o crea una propiedad y devuelve el valor asignado.
   * @param property Nombre de la propiedad.
   * @param value Objeto o valor a asignar.
   * @param muting Indica si debe transformar objetos en estructura jerárquica.
   * @returns {With_exe_<T>} Valor de la propiedad asignada.
   */
  public set<T>(property:string,value:any,muting?:boolean):With_exe_<T> {          
    return (_exe_.set((this as unknown as ManagementHierarchicalData).proxyObj,property,value,muting) as _exe_Struct)._exe_.getByStr(property)
  }

  /**
   * ***************************************************************************
   * @method getByStr Devuelve el valor de la propiedad indicada.
   * @param property Nombre de la propiedad.
   * @param callBackfnOk Función a ejecutar si se encuentra el valor.
   * @param callbackfnKo Función a ejecutar si no se encuentra el valor.
   * @returns {any} Valor de la propiedad indicada o undefined.
   */    
  public getByStr(property:string,callBackfnOk?:(value:any)=>void,callbackfnKo?:(err:string)=>void):any{    
    return _exe_.getByStr((this as unknown as ManagementHierarchicalData).proxyObj,property,callBackfnOk,callbackfnKo) 
  }

  /**	
   * ***************************************************************************
   * @method export Permite exportar propiedades de esta instancia de DatosObj o propiedad a un objeto plano o a un objeto aportado.
   * @param property Nombre de la propiedad a exportar
   * @param targetFill Objeto de destino de la exportación ¡¡¡ En desarrollo PPPS!!!
   * @returns {any} Objeto plano rellenado o dato simple
   */
  public export(property:string='',targetFill?:object|any[]|Map<any,any>|Set<any>):any{       
    return _exe_.export((this as unknown as ManagementHierarchicalData).proxyObj,property,targetFill)
  }

  public route(path:string='',callBackfnOk?:(value:any,property:string,struct:any)=>void,callbackfnKo?:(err:string)=>void):any{    
    return _exe_.route((this as unknown as ManagementHierarchicalData).proxyObj,path,callBackfnOk,callbackfnKo)
  }

  /**
   * ***************************************************************************
   * @method react Permite suscribirse a los eventos de cambio de las propiedades de esta instancia de DatosObj o sus hijos.
   * @param dat Ruta de la propiedad a la que nos suscribimos u objeto con las opciones de la suscripción , 
   * @param accion Metodo a ejecutar cuando se produce un cambio en la propiedad    
   * @param thisArg Objeto al que se asignará el contexto this cuando se ejecute la acción 
   * @returns {Reaction} Subscripcion para desuscribirse del evento y ver estado
   */
  public react(dat:string|datChange,accion: ActionChange,thisArg?:any):Reaction {         
    thisArg = thisArg || (this as unknown as ManagementHierarchicalData).proxyObj  
    if (typeof dat=='string'){
      dat = (dat.indexOf('/')===0)? dat : thisArg.path + '|' + dat
      // mejorar la forma de concatenar rutas PPPS , [] para array,map y set
      dat = new datChangeObj({ruta:dat})        
    } 
    return thisArg.rootManagement.react(dat,accion,thisArg)        
  }
}

// Enlazar prototipos sin usar una instancia concreta
Object.setPrototypeOf(ManagementHierarchicalDataObj.prototype, ProtoManagementHierarchicalDataObj.prototype);
// Restaurar constructor para no romper instanceof/constructor
(ManagementHierarchicalDataObj.prototype as any).constructor = ManagementHierarchicalDataObj;

type ReactionsSubtypeChange<T> = Record<string,T>
type ReactionsSubStateAmbitReaction<T> = Record<typeChange,ReactionsSubtypeChange<T>>
type IndexReactions<T> =  Record<stateAmbitReaction,ReactionsSubStateAmbitReaction<T>>

// esta función crea un índice de reacciones instanciado con toda la estructura necesaria
function createIndexReactions<T>():IndexReactions<T>{

  const indexReactions = {} as IndexReactions<T>
  const stateValues = Object.values(stateAmbitReaction).filter((value): value is stateAmbitReaction => typeof value === 'number')
  const typeValues = Object.values(typeChange).filter((value): value is typeChange => typeof value === 'number')

  stateValues.forEach((state) => {
    const typeRecord = {} as ReactionsSubStateAmbitReaction<T>
    typeValues.forEach((type) => { typeRecord[type] = {} as ReactionsSubtypeChange<T> })
    indexReactions[state] = typeRecord
  })

  return indexReactions
}

class bufferReactions{ 
  constructor(inicialValues?:Partial<bufferReactions>){ Object.assign(this,inicialValues) }
  index:IndexReactions<number> = createIndexReactions<number>()
  cont:number = 0
  reactions:Record<number,datChange> = {} as Record<number,datChange>
}

export interface ManagementReactions extends ManagementReactionsObj{}
/** @interface ManagementReactionsObj
 * @description Interface of the management of reactions
 */
export class ManagementReactionsObj {
  /**
   * Crea un gestor de reacciones asociado a un nodo raíz.
   * @param rootDatos Nodo raíz de la estructura jerárquica.
   */
  constructor(rootDatos:_exe_Struct){
    this.root = rootDatos 
  }

  /** @property Counter of reactions */    
  private contReactions = 0
  /** @property Index hierarchical of reactions */      
  private index:IndexReactions<number[]> = createIndexReactions<number[]>()
  /** @property Buffer of reactions */    
  private bufferReactions:bufferReactions = new bufferReactions()
  /** @property Counter of SubBuffers */    
  private contSubBufferReactions = 0
  /** @property pila de BufferReactios */    
  private subBufferReactions:Array<{id:number,bufferReactions:bufferReactions}> = []
  
  /** @property list of reactions */    
  private reactions:Record<number,Reaction> = {}
  /** @property Root of the hierarchical data */    
  public root!:_exe_Struct 

  /** @property List of objects that do not mutate */    
  public UserNoMutationObjs = []
  /** @property Flag of mutation general */    
  public modeMutation = true
  /** @property Flag of observing gets */    
  public observingGets = false
  /** @property flag for use Buffer of reactions */    
  private buffer:boolean = false

  /** 
   * @method getBuffer Obtiene el estado del buffer de reacciones.
   * @returns Verdadero si el buffer está activo, falso en caso contrario.
   */
  public getBuffer(){ return this.buffer }      

  /** 
   * @method setBuffer Establece el estado del buffer de reacciones.
   * @param valor Verdadero para activar el buffer, falso para desactivarlo.
   */
  public setBuffer(valor:boolean){ 
    if (!this.buffer && valor){
      this.buffer = valor 
      this._exe_Buffer()
    }
  }      

  /** 
   * @method pushSubBuffer Añade el buffer al SubBuffer como ultima posición de una pila.   
   */
  public pushSubBuffer():number{
    this.contSubBufferReactions++
    this.subBufferReactions.push({id:this.contSubBufferReactions,bufferReactions:this.bufferReactions})
    this.bufferReactions = new bufferReactions()
    return this.contSubBufferReactions  
  }

  /** 
   * @method popSubBuffer Extrae el último buffer de reacciones de la pila.
   * @param id Identificador opcional del buffer a extraer. Si no se proporciona, se extrae el último buffer añadido.
   * @returns Verdadero si se extrajo el buffer con éxito, falso si no se encontró el buffer.
   */
  public popSubBuffer(id?:number):boolean{
    let subBuffer = (id)? this.subBufferReactions.find( (subBuffer) => subBuffer.id == id ) : this.subBufferReactions.pop()
    this.subBufferReactions = this.subBufferReactions.filter( (subBuffer) => subBuffer.id != id )
    if (subBuffer){
      Object.keys(this.bufferReactions.reactions).forEach( (key) => {
        let cambio = this.bufferReactions.reactions[Number(key)]
        subBuffer.bufferReactions.index[cambio.hito][cambio.ambito][cambio.ruta]=Number(key)
        subBuffer.bufferReactions.reactions[Number(key)] = cambio        
      })
      this.bufferReactions.index = subBuffer.bufferReactions.index
      this.bufferReactions.reactions = subBuffer.bufferReactions.reactions
      return true
    }else{
      return false
    }
  }

  /** @method clearBuffer Limpia el buffer de reacciones.
   * @description Elimina todas las reacciones almacenadas en el buffer.
   */
  public clearBuffer(){ 
    this.bufferReactions = new bufferReactions() 
  }      

  /** @method clearSubBuffer Limpia el buffer de reacciones.
   * @description Elimina todas las reacciones almacenadas en el SubBuffer especificado.
   * @param id Identificador opcional del SubBuffer a limpiar. Si no se proporciona, se limpian todos los SubBuffers.
   * @returns Verdadero si se limpió el SubBuffer con éxito, falso si no se encontró el SubBuffer.
   */
  public clearSubBuffer(id?:number):boolean{ 
    let returnValue:boolean = false
    if (!id) this.subBufferReactions = []
    this.subBufferReactions = this.subBufferReactions.filter( (subBuffer) => {
      if (subBuffer.id != id) return true
      else{
        returnValue = true
        return false
      }
    }) 
    return returnValue
  }

  /**
   * @method getContReactions Obtiene el contador interno de reacciones.
   * @returns Número total de reacciones registradas.
   */
  public getContReactions(){ 
    return this.contReactions 
  }      

  /**
   * @method popReactions Extrae reacciones asociadas a una propiedad o todas si no se indica.
   * @param propiedad Propiedad de la que se extraen las reacciones.
   * @returns Lista de reacciones extraídas.
   */
  popReactions(propiedad?:string):Reaction[]{
    if (propiedad==undefined) {
    let reactionsDonadas = Object.values(this.reactions)          
    this.reactions = {}
    this.index = createIndexReactions()
    return reactionsDonadas
    }else{
    // donaremos solo las subcripciones que cuelguen de la propiedad indicada
    // esto se puede optimizar pero no es crítico
    let reactionsDonadas = Object.values(this.reactions).filter( (reaction) => reaction.change.ruta.indexOf(this.root._exe_.path+'|'+propiedad)===0 )
    reactionsDonadas.forEach( (reaction) => {
        reaction.change.ruta = reaction.change.ruta.replace(this.root._exe_.path + '|' + propiedad,'/')
        this.index[reaction.change.hito][reaction.change.ambito][reaction.change.ruta] = this.index[reaction.change.hito][reaction.change.ambito][reaction.change.ruta].filter( (index) => index!=reaction.manage.id )            
    })
    return reactionsDonadas
    }        
  }

  /**
   * @method pushReactions Inserta reacciones en el gestor ajustando sus rutas.
   * @param reactions Lista de reacciones.
   * @param ruta Ruta base donde se insertan.
   * @returns Lista de reacciones insertadas.
  */
  pushReactions(reactions:Reaction[],ruta:string):Reaction[]{
    reactions.forEach( (reaction) => {
    this.contReactions++
    reaction.change.ruta = reaction.change.ruta.replace('/',ruta)
    reaction.manage.id = this.contReactions
    this.reactions[this.contReactions] = reaction
    })
    return reactions
  }
    
  /** 
   * @method declineReact Pausa una reacción activa y la mueve al estado pause.
   * @param id Id de la reacción o la reacción misma.
   * @returns Reacción pausada.
   */
  declineReact(id:number|Reaction):Reaction{
    if (typeof id!='number') id = id.manage.id
    let reaction = this.reactions[id]
    if (reaction.manage.status != stateAmbitReaction.pause) {
    reaction.manage.status = stateAmbitReaction.pause
    this.index[reaction.change.hito][stateAmbitReaction.pause][reaction.change.ruta].push(id)  
    this.index[reaction.change.hito][reaction.change.ambito][reaction.change.ruta] = this.index[reaction.change.hito][reaction.change.ambito][reaction.change.ruta].filter( (idActiva) => idActiva!=id )                
    }
    return reaction 
  }

  /**
   * @method react Registra o reactiva una reacción para un cambio específico.
   * @param cambio Objeto de cambio.
   * @param accion Acción a ejecutar.
   * @param thisArg Contexto de ejecución.
   * @param noDie Reservado para futuros comportamientos de persistencia.
   * @returns Reacción registrada o reactivada.
   */
  react(cambio:datChangeObj,accion:ActionChange,thisArg:any,noDie=false):Reaction{                                
    let reaction:Reaction|undefined = undefined   
    
    if (!this.index[cambio.hito][cambio.ambito].hasOwnProperty(cambio.ruta)) this.index[cambio.hito][cambio.ambito][cambio.ruta] = []

    this.index[cambio.hito][cambio.ambito][cambio.ruta].forEach( (index) => {           
      if (this.reactions[index].action===accion && this.reactions[index].thisArg===thisArg) reaction = this.reactions[index]
    })

    this.index[cambio.hito][stateAmbitReaction.pause][cambio.ruta].forEach( (index) => {           
      if (this.reactions[index].action===accion && this.reactions[index].thisArg===thisArg) {
          reaction = this.reactions[index]
          reaction.manage.status = reaction?.change.ambito || stateAmbitReaction.local
          this.index[cambio.hito][stateAmbitReaction.pause][reaction?.change.ruta || ''] = this.index[cambio.hito][stateAmbitReaction.pause][reaction?.change.ruta || ''].filter( (id) => id!=index )        
          this.index[cambio.hito][reaction?.change.ambito || stateAmbitReaction.local][cambio.ruta].push(index)
      }
    })

    if (!reaction) {
    this.contReactions++                
    let declineReactFunction = (()=> { this.declineReact(this.contReactions) }).bind(this)
    reaction = new ReactionObj({ 
      "change":cambio,
      "action":accion, 
      "thisArg":thisArg,
      "manage":new ManagementReactionObj({id:this.contReactions,status:cambio.ambito}),
      "declineReact": declineReactFunction
    })        
    this.index[cambio.hito][cambio.ambito][cambio.ruta].push(this.contReactions)
    this.reactions[this.contReactions] = reaction
    }

    return reaction
  }      

  callReact(cambio:datChangeObj){                
    if (!this.getBuffer()){
      this._exe_React(cambio)
    } else {      
      this.bufferReactions.index[cambio.hito][cambio.ambito][cambio.ruta]=this.bufferReactions.cont
      this.bufferReactions.reactions[this.bufferReactions.cont] = cambio
      this.bufferReactions.cont++
    }
  }

  private _exe_Buffer(){  
    this.bufferReactions.index
    Object.values(this.bufferReactions.index).forEach( (ambitoOfHito) => {      
      Object.values(ambitoOfHito).forEach( (rutaOfAmbito) => {
        Object.values(rutaOfAmbito).forEach( (indexChange) => {
          this._exe_React(this.bufferReactions.reactions[indexChange])          
        })
      })
    })
    this.clearBuffer()
  }


  /**
   * Ejecuta las reacciones registradas para un cambio.
   * @param cambio Objeto de cambio.
   * @returns void
   */
  private _exe_React(cambio:datChangeObj){                

    if (this.index[cambio.hito][stateAmbitReaction.local].hasOwnProperty(cambio.ruta))        
    this.index[cambio.hito][stateAmbitReaction.local][cambio.ruta].forEach( (idActiva) => {          
        this.reactions[idActiva].manage.calls++
        this.reactions[idActiva].action.apply(this.reactions[idActiva].thisArg,[cambio])
    })

    // filtraremos las rutas que sean un segmento de la actual siendo estos los padres y llamando a sus subcripciones de tipo hijo
    cambio.ruta.split('|').forEach( (nivel,index) => {
    let ruta = cambio.ruta.split('|',index).join('|')
    if (this.index[cambio.hito][stateAmbitReaction.childens].hasOwnProperty(ruta))
        this.index[cambio.hito][stateAmbitReaction.childens][ruta].forEach( (idActiva) => {          
        let hijo = new datChangeObj(cambio)
        hijo.ambito = stateAmbitReaction.childens          
        this.reactions[idActiva].manage.calls++
        this.reactions[idActiva].action.apply(this.reactions[idActiva].thisArg,[hijo])
        }) 
    })

    // filtraremos las rutas que empiecen por la ruta actual siendo estos los hijos y llamando a sus subcripciones de tipo padre
    let rutasPadre = Object.keys(this.index[stateAmbitReaction.fathers]).filter( (ruta) => ruta.indexOf(cambio.ruta)===0 )
    rutasPadre.forEach( (ruta) => {
    this.index[cambio.hito][stateAmbitReaction.fathers][ruta].forEach( (idActiva) => {          
        let cambioPadre = new datChangeObj(cambio)              
        cambioPadre.ambito = stateAmbitReaction.fathers          
        this.reactions[idActiva].manage.calls++
        this.reactions[idActiva].action.apply(this.reactions[idActiva].thisArg,[cambioPadre])
    })
    })
  }

}    

// /*************************************************************************** 
// * Use

  const persona = 
   {
    name:'John Doe',    
    sex:'male',
    age:15,
    adult:false,
    address:[
              {
                street:'123 Main St',
                city:'Anytown',
                state:'CA',
                zip:'12345'
              },
              {
                street:'456 Secondary St',
                city:'otherAnytown',
                state:'CA',
                zip:'12346'
              },
            ] 
   }
 
 let data = _exe_.newStruct_exe_opt({persona:persona}) 
//  let data = _exe_.newStruct_exe_opt(model)
 

   _exe_.path(data)
  data._exe_?.path

  data.persona.name // 'John Doe'
  data.persona.age // 15
  data.persona.adult // false
  data.persona.address[0].street // '123 Main St'
  data.persona.address[1].city // 'otherAnytown'
  data.persona

  let reaccion:Reaction = _exe_.react(data,'?',(change)=>{ console.log(change) },) 

  
  _exe_.react(data,'?',(change)=>{ console.log(change) })

  data.persona._exe_?.react('age',(change)=>{    
    if(change.datoNuevo >= 18){
      data.persona.adult = true 
    }
  })
 
  data.persona.age = 18 // console { oldValue: 15, newValue: 18, type: 'set', path: '/|age' } , { oldValue: false, newValue: true, type: 'set', path: '/|adult' }
  data.persona.adult // true  
  data.persona.age = 15 // console { oldValue: 18, newValue: 15, type: 'set', path: '/|age' } , console { oldValue: true, newValue: false, type: 'set', path: '/|adult' }
  data.persona.adult // false 
  
   _exe_.react(data,'persona|address[0]|city',(change)=>{ console.log(change) })

    data._exe_?.react('persona|address[0]|city',(change)=>{ console.log(change) })

   _exe_.react(data.persona.address,'[?]|city',(change)=>{ console.log(change) })

   data.persona.address._exe_?.react('[?]|city',(change)=>{ console.log(change) })

   _exe_.react(data,'persona|address[(city:Anytown)]|city',(change)=>{ console.log(change) })

   data._exe_?.react('persona|address[(city:Anytown)]|city',(change)=>{ console.log(change) })

    data._exe_?.react(new datChangeObj({  ruta:'persona|address',
                                          hito:typeChange.seter,
                                          ambito:stateAmbitReaction.childens}
                                      ),(change)=>{ console.log(change) },this)

  data.persona.address._exe_?.react('[?]|city',(change)=>{
    if(change.datoNuevo != change.datoActual){
      console.log('city changed to',change.datoNuevo)
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
                      street:'000 Secondary St',
                      city:'otherAnytown',
                      state:'CA',
                      zip:'12346'
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

  data.persona.address._exe_?.path // '/|address'
 
// ***************************************************************************/
