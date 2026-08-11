# Bezero Kontuen Kudeatzailea

**Gestor de cuentas y contraseñas de clientes** · C# / .NET · aplicación de consola

Programa desarrollado en C# para gestionar las cuentas y contraseñas de los
clientes de una empresa ("AllSecurity"): dar de alta cuentas, buscarlas, y
mantener sus credenciales organizadas por plataforma y tipo. El proyecto tiene
dos versiones, y lo interesante es el salto entre ellas.

## De la v1 a la v2: la evolución

La **v1** resolvía el problema de la forma más directa: un único `Program.cs`,
datos guardados en arrays y un enfoque procedural. Funcionaba, pero todo vivía
en un solo archivo.

La **v2** es una reescritura completa aplicando **programación orientada a
objetos**, separando responsabilidades en módulos. Ese rediseño es lo que
convierte un ejercicio en un proyecto:

- **`Kontua`** — la clase Cuenta, con campos privados, getters/setters y un
  constructor que usa null-coalescing (`?? ""`) para blindar los valores nulos.
- **`Estatistikak`** — estadísticas en tiempo real con `Dictionary<string,int>`,
  contando cuentas por tipo y por plataforma.
- **`Fitxategiak_kudeatu`** — importación y exportación desde ficheros, parseando
  líneas con `File.ReadAllLines` y `.Split(",")` para persistir los datos.
- **`Segurtasuna`** — un módulo de **auditoría de seguridad** que recorre todas
  las cuentas y marca las que usan contraseñas débiles (menos de 8 caracteres),
  reportando cuántas y cuáles son inseguras.

## Qué demuestra

- Diseño **orientado a objetos** real: encapsulación, modularidad y separación
  de responsabilidades.
- Manejo de estructuras de datos de C#: arrays, `List<>` y `Dictionary<>`.
- **Persistencia en ficheros** (importar/exportar) y parseo de datos.
- **Mentalidad de seguridad**: el módulo de auditoría de contraseñas nace de
  pensar no solo en "guardar datos", sino en detectar credenciales débiles.
- Capacidad de **iterar y refactorizar**: llevar un proyecto de una versión
  procedural a una arquitectura OOP mantenible.

## Tecnologías

C# · .NET · POO (clases, getters/setters, modularidad) · `List` · `Dictionary` ·
gestión de ficheros · interfaz de consola.

## Código

- Versión 2 (actual, OOP): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea-v2>
- Versión 1 (original, procedural): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea>

> Estado: en desarrollo. La v2 sigue creciendo con nuevas funcionalidades de
> búsqueda avanzada y estadísticas.
