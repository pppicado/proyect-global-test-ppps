import { Injectable, ComponentRef, Injector, TemplateRef, Type, InjectionToken } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal, Portal } from '@angular/cdk/portal';
import { FloatingWindowComponent } from './floating-window/floating-window.component';

export const WINDOW_DATA = new InjectionToken<any>('WINDOW_DATA');

export interface FloatingWindowConfig {
  title?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FloatingWindowService {
  private zIndexCounter = 1000;

  constructor(private overlay: Overlay, private injector: Injector) { }

  open<T>(componentOrTemplate: Type<T> | TemplateRef<T>, config: FloatingWindowConfig = {}): ComponentRef<FloatingWindowComponent> {
    const positionStrategy = this.overlay.position()
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

    // Create Injector for user component data
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: WINDOW_DATA, useValue: config.data }
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
    windowInstance.close.subscribe(() => {
      overlayRef.dispose();
    });

    // Handle Focus (Z-Index)
    windowInstance.focus.subscribe(() => {
      this.zIndexCounter++;
      windowInstance.zIndex = this.zIndexCounter;
      if (overlayRef.hostElement) {
        overlayRef.hostElement.style.zIndex = `${this.zIndexCounter}`;
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
}
