# Explicación de configuración Prettier (`.prettierrc`)

Este archivo define las reglas de formato de código que seguirá Prettier para mantener el estilo consistente en tu proyecto.

## Opciones

### `"printWidth": 120`
Define el número máximo de caracteres por línea. Si se excede, Prettier intentará hacer un salto de línea automático. En este caso, el límite es 120 caracteres.

### `"tabWidth": 2`
Establece el número de espacios por cada nivel de indentación. Aquí se usan 2 espacios.

### `"singleQuote": false`
Indica si se deben usar comillas simples (`'`) o dobles (`"`). `false` significa que se usarán comillas dobles.

### `"semi": true`
Determina si se deben agregar punto y coma (`;`) al final de las líneas. `true` significa que sí se agregarán.

### `"arrowParens": "avoid"`
Especifica si las funciones flecha con un solo parámetro deben omitir los paréntesis. `"avoid"` significa que se omitirán (ejemplo: `x => x`).

### `"bracketSpacing": true`
Controla el espacio dentro de llaves en objetos. `true` significa que se escribirán con espacios (ejemplo: `{ foo: bar }`).

### `"trailingComma": "none"`
Indica si se debe incluir una coma al final de listas, objetos o arrays. `"none"` significa que no se agregará coma final.