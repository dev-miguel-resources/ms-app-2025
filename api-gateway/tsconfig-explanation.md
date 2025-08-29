# Explicación de `tsconfig.json`

Este archivo configura el compilador de TypeScript (`tsc`) para el proyecto. A continuación se explica cada opción utilizada:

## compilerOptions

### `"module": "CommonJS"`
Indica que el sistema de módulos será CommonJS, que es el formato utilizado por Node.js (requiere `require` y `module.exports`).

### `"esModuleInterop": true`
Permite importar módulos CommonJS usando la sintaxis de ES6 (`import x from 'x'`). Mejora la compatibilidad con librerías que no usan módulos ES.

### `"target": "ES2020"`
Establece que el código compilado estará orientado a la versión ECMAScript 2020. Esto afecta las características del lenguaje que se pueden usar en el output.

### `"noImplicitAny": true`
Evita que variables o funciones se tipen automáticamente como `any`. Obliga a declarar los tipos para mayor seguridad.

### `"moduleResolution": "node"`
Usa el sistema de resolución de módulos de Node.js, permitiendo encontrar archivos como `index.ts`, `index.js` o buscar en `node_modules`.

### `"sourceMap": true`
Genera archivos `.map` para facilitar el debugging en herramientas como Chrome DevTools, vinculando el código JavaScript generado con el TypeScript original.

### `"outDir": "cache"`
Especifica que los archivos compilados se colocarán en la carpeta `cache`.

### `"resolveJsonModule": true`
Permite importar archivos `.json` como módulos de TypeScript.

### `"experimentalDecorators": true`
Habilita el uso de decoradores, una característica experimental de TypeScript utilizada frecuentemente en frameworks como Angular o TypeORM.

### `"emitDecoratorMetadata": true`
Genera metadatos junto con los decoradores, útil para frameworks que los requieren para la reflexión de tipos (como TypeORM o NestJS).

---

## include

### `"include": ["src/**/*.ts"]`
Indica que se deben incluir todos los archivos `.ts` dentro de la carpeta `src` y sus subcarpetas.

## exclude

### `"exclude": ["node_modules"]`
Excluye la carpeta `node_modules` del proceso de compilación, ya que contiene dependencias externas.