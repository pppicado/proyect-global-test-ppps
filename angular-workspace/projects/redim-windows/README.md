# Redim Windows

`redim-windows` is an Angular 16 library that provides resizable, draggable, and non-blocking floating windows using Bootstrap 5 styles. It leverages `@angular/cdk` for drag-and-drop functionality and dynamic content loading.

## Features

- **Draggable Windows**: Move windows anywhere on the screen.
- **Resizable**: Resize windows from edges and corners.
- **Non-blocking**: Windows do not block interaction with the rest of the page.
- **Multiple Windows**: Open multiple instances simultaneously with z-index management.
- **Dynamic Content**: Load any Angular component or template into a window.
- **CSS Variables**: Automatically injects `--window-width` and `--window-height` CSS variables for responsive content.
- **Bootstrap Styled**: Built with Bootstrap 5 classes.

## Installation

1.  Install the library and dependencies:

    ```bash
    npm install redim-windows bootstrap @angular/cdk
    ```

2.  Add Bootstrap CSS to your `angular.json` or `styles.scss`:

    ```json
    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      "src/styles.css"
    ]
    ```

## Setup

Import `RedimWindowsModule` in your application module:

```typescript
import { RedimWindowsModule } from 'redim-windows';

@NgModule({
  imports: [
    RedimWindowsModule,
    // ...
  ],
  // ...
})
export class AppModule { }
```

## Usage

Inject `FloatingWindowService` to open windows dynamically.

```typescript
import { Component } from '@angular/core';
import { FloatingWindowService } from 'redim-windows';
import { MyComponent } from './my-component/my-component.component';

@Component({ ... })
export class AppComponent {
  constructor(private windowService: FloatingWindowService) {}

  openWindow() {
    this.windowService.open(MyComponent, {
      title: 'My Floating Window',
      width: 500,
      height: 400,
      x: 100,
      y: 100,
      data: { message: 'Hello World' }
    });
  }
}
```

### Accessing Data in the Window Component

You can access the passed `data` using the `WINDOW_DATA` injection token.

```typescript
import { Component, Inject, Optional } from '@angular/core';
import { WINDOW_DATA } from 'redim-windows';

@Component({ ... })
export class MyComponent {
  constructor(@Optional() @Inject(WINDOW_DATA) public data: any) {
    console.log(data); // { message: 'Hello World' }
  }
}
```

### Using CSS Variables

The window container automatically sets CSS variables `--window-width` and `--window-height` based on its current size. You can use these in your component's CSS.

```css
.my-content {
  width: 100%;
  height: 100%;
  /* Example: changing color based on width using container queries or calc */
  font-size: calc(var(--window-width) / 20);
}
```

## API

### `FloatingWindowService`

- `open<T>(componentOrTemplate: Type<T> | TemplateRef<T>, config?: FloatingWindowConfig): ComponentRef<FloatingWindowComponent>`

### `FloatingWindowConfig`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `'Window'` | The title displayed in the header. |
| `width` | `number` | `400` | Initial width in pixels. |
| `height` | `number` | `300` | Initial height in pixels. |
| `x` | `number` | `100` | Initial X position (left). |
| `y` | `number` | `100` | Initial Y position (top). |
| `data` | `any` | `undefined` | Data to pass to the component via `WINDOW_DATA`. |
