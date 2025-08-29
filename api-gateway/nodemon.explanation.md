# Explicación del archivo de configuración

Este archivo es un ejemplo de configuración para **nodemon**, una herramienta que reinicia automáticamente una aplicación de Node.js cuando detecta cambios en los archivos del proyecto.  
A continuación, se detalla qué significa cada una de las propiedades configuradas:

## Explicación de las propiedades

### `watch`
```json
"watch": ["src"]
```
- Indica a **nodemon** qué carpetas o archivos debe estar monitoreando.
- En este caso, vigila la carpeta `src` para detectar cambios.

---

### `ext`
```json
"ext": "ts json"
```
- Define las extensiones de archivo que activarán un reinicio al modificarse.
- Aquí se incluyen:
  - `ts` → archivos TypeScript
  - `json` → archivos de configuración JSON

---

### `env`
```json
"env": {
  "NODE_ENV": "development"
}
```
- Permite establecer variables de entorno.
- En este caso, `NODE_ENV` se define como `development`.

---

### `ignore`
```json
"ignore": ["node_modules"]
```
- Define carpetas o archivos que **nodemon** debe ignorar.
- Aquí se evita monitorear `node_modules`, ya que contiene dependencias externas que no deberían reiniciar la aplicación al cambiar.

---

### `execMap`
```json
"execMap": {
  "ts": "ts-node"
}
```
- Especifica cómo ejecutar archivos según su extensión.
- En este caso:
  - Los archivos `.ts` se ejecutan con **ts-node** (permite correr TypeScript directamente sin compilarlo previamente).

---

### `verbose`
```json
"verbose": true
```
- Activa un modo detallado en la consola, mostrando información adicional sobre qué archivos y procesos se están monitoreando.

---

### `restartable`
```json
"restartable": "rs"
```
- Permite reiniciar manualmente la aplicación desde la consola.
- Aquí, si se escribe `rs` en la terminal, la aplicación se reinicia sin necesidad de modificar archivos.

---

## Conclusión

Este archivo de configuración de **nodemon** está optimizado para proyectos en **TypeScript**.  
- Monitorea la carpeta `src` y reinicia la aplicación cuando cambian archivos `.ts` o `.json`.  
- Ignora `node_modules` para evitar reinicios innecesarios.  
- Ejecuta archivos TypeScript con `ts-node`, sin necesidad de compilarlos manualmente.  
- Proporciona un modo detallado de logs (`verbose`) y la opción de reiniciar manualmente con `rs`.  
