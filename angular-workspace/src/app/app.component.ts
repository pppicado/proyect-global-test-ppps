import { Component } from '@angular/core';
import { FloatingWindowService } from '@pppicado/redim-frame';
import { ChartComponent } from './chart/chart.component';
import { FormComponent } from './form/form.component';
import { _exe_, datChangeObj, Reaction, stateAmbitReaction, typeChange } from '@pppicado/structexe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-workspace';

  constructor(private floatingWindowService: FloatingWindowService) {


    // /*************************************************************************** 
    // * Use StructExe

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

  openChart() {
    this.floatingWindowService.open(ChartComponent, {
      width: 50,
      height: 40,
      x: 5,
      y: 30,
      data: { id: 1, name: 'Sample Data' }
    });
  }

  openForm() {
    this.floatingWindowService.open(FormComponent, {
      width: 40,
      height: 30,
      x: 30,
      y: 20
    });
  }
}
