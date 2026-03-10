import { Injectable, ComponentRef, Injector, TemplateRef, Type, InjectionToken } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal, Portal } from '@angular/cdk/portal';
import { FloatingWindowComponent } from './floating-window/floating-window.component';
import { ModalWindowComponent } from './modal-window/modal-window.component';
import { StartWindowConfig } from './redim-frame.interface';
import { BaseWindowDirective } from './base-window.directive';

export const WINDOW_DATA = new InjectionToken<any>('WINDOW_DATA');

@Injectable({
  providedIn: 'root'
})
export class RedimFrameService {
  private zIndexCounter = 1000;

  constructor(private overlay: Overlay, private injector: Injector) { }

  openWindows<T>(componentOrTemplate: Type<T> | TemplateRef<T>, config: StartWindowConfig = {}): ComponentRef<FloatingWindowComponent> {

    const positionStrategy = config.origin
      ? this.overlay.position()
        .flexibleConnectedTo(config.origin)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        }])
      : this.overlay.position()
        .global()
        .left('0px')
        .top('0px');

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });

    const overlayRef = this.overlay.create(overlayConfig);
    const windowPortal = new ComponentPortal(FloatingWindowComponent);
    const windowRef = overlayRef.attach(windowPortal);
    const windowInstance = windowRef.instance;

    windowInstance.width = config.width || 30;
    windowInstance.height = config.height || 30;
    windowInstance.x = config.x || 10;
    windowInstance.y = config.y || 10;
    windowInstance.zIndex = this.zIndexCounter++;
    windowInstance.windowData = config.data;
    windowInstance.scrollIcon = config.scrollIcon || '';
    windowInstance.minHeight = config.minHeight || 10;
    windowInstance.minWidth = config.minWidth || 10;
    windowInstance.resizeBorder = config.resizeBorder || 0.5;
    windowInstance.scrollThumbSize = config.scrollThumbSize || 2;
    windowInstance.zIndex = config.zIndex || this.zIndexCounter++;

    // Create Injector for user component data
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: WINDOW_DATA, useValue: config.data },
        { provide: FloatingWindowComponent, useValue: windowInstance }
      ]
    });

    let userPortal: Portal<any>;

    if (componentOrTemplate instanceof TemplateRef) {
      userPortal = new TemplatePortal(componentOrTemplate, null!, {
        $implicit: config.data
      } as any);
    } else {
      userPortal = new ComponentPortal(componentOrTemplate, null, injector);
    }

    windowInstance.contentPortal = userPortal;

    // Handle Close
    windowInstance.change.subscribe((event) => {
      if (event.close) {
        overlayRef.dispose();
      }
    });

    // Handle Focus (Z-Index)
    windowInstance.change.subscribe((event) => {
      if (event.focus) {
        this.zIndexCounter++;
        windowInstance.zIndex = this.zIndexCounter;
        if (overlayRef.hostElement) {
          overlayRef.hostElement.style.zIndex = `${this.zIndexCounter}`;
        }
      }
    });

    // Initial Z-Index
    if (overlayRef.hostElement) {
      overlayRef.hostElement.style.zIndex = `${windowInstance.zIndex}`;
      // Allow pointer events to pass through overlay container
      overlayRef.hostElement.style.pointerEvents = 'none';
    }

    // Enable pointer events on the overlay pane (the window itself)
    if (overlayRef.overlayElement) {
      overlayRef.overlayElement.style.pointerEvents = 'none'; // Set to none so clicks pass through pane
    }

    return windowRef;
  }

  openModal<T>(componentOrTemplate: Type<T> | TemplateRef<T>, config: StartWindowConfig = {}): ComponentRef<ModalWindowComponent> {
    const positionStrategy = config.origin
      ? this.overlay.position()
        .flexibleConnectedTo(config.origin)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        }])
        // A modal targeting an origin should fully cover it.
        // It's generally better to ensure the overlay fills the space:
        .withPush(false)
      : this.overlay.position()
        .global()
        .width('100%')
        .height('100%')
        .centerHorizontally()
        .centerVertically();

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: false, // El componente ModalWindowComponent dibuja el sombreado
      scrollStrategy: this.overlay.scrollStrategies.block() // Prevenir scroll debajo del modal
    });

    const overlayRef = this.overlay.create(overlayConfig);
    const windowPortal = new ComponentPortal(ModalWindowComponent);
    const windowRef = overlayRef.attach(windowPortal);
    const windowInstance = windowRef.instance;

    windowInstance.width = config.width || 30;
    windowInstance.height = config.height || 30;
    windowInstance.x = config.x || 10;
    windowInstance.y = config.y || 10;
    windowInstance.zIndex = config.zIndex || this.zIndexCounter++;
    windowInstance.windowData = config.data;
    windowInstance.scrollIcon = config.scrollIcon || '';
    windowInstance.minHeight = config.minHeight || 10;
    windowInstance.minWidth = config.minWidth || 10;
    windowInstance.resizeBorder = config.resizeBorder || 0;
    windowInstance.scrollThumbSize = config.scrollThumbSize || 2;

    // Create Injector for user component data
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: WINDOW_DATA, useValue: config.data },
        { provide: ModalWindowComponent, useValue: windowInstance },
        { provide: BaseWindowDirective, useValue: windowInstance } // For any injects relying on base
      ]
    });

    let userPortal: Portal<any>;

    if (componentOrTemplate instanceof TemplateRef) {
      userPortal = new TemplatePortal(componentOrTemplate, null!, {
        $implicit: config.data
      } as any);
    } else {
      userPortal = new ComponentPortal(componentOrTemplate, null, injector);
    }

    windowInstance.contentPortal = userPortal;

    // Handle Close
    windowInstance.change.subscribe((event) => {
      if (event.close) {
        overlayRef.dispose();
      }
    });

    // Handle Focus (Z-Index)
    windowInstance.change.subscribe((event) => {
      if (event.focus) {
        this.zIndexCounter++;
        windowInstance.zIndex = this.zIndexCounter;
        if (overlayRef.hostElement) {
          overlayRef.hostElement.style.zIndex = `${this.zIndexCounter}`;
        }
      }
    });

    // Initial Z-Index
    if (overlayRef.hostElement) {
      overlayRef.hostElement.style.zIndex = `${windowInstance.zIndex}`;
      if (config.origin) {
         // Ajustamos el overlay host al tamaño del origin
         const rect = config.origin.getBoundingClientRect();
         overlayRef.hostElement.style.width = `${rect.width}px`;
         overlayRef.hostElement.style.height = `${rect.height}px`;
      }
    }

    return windowRef;
  }


}
