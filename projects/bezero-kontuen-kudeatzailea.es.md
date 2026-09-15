# Bezero Kontuen Kudeatzailea

**Gestor de cuentas y contraseñas de clientes** · C#/.NET · aplicación de consola

Un programa desarrollado en C# para gestionar las cuentas y contraseñas de los
clientes de una empresa ("AllSecurity"): crear cuentas, buscarlas y mantener sus
credenciales organizadas por plataforma y tipo. El proyecto tiene dos versiones, y
lo más interesante es el salto entre ambas.

## De v1 a v2: el proceso

**v1** resolvía el problema de la forma más directa: un único `Program.cs`, datos
guardados en arrays y código procedural. Funcionaba, pero todo estaba en un solo
archivo.

**v2** es una reescritura completa, aplicando **programación orientada a objetos**
y dividiendo el código en módulos.

- **`Kontua`** (Cuenta): la clase Cuenta, con campos privados, getters/setters y un
  constructor que usa `?? ""` para protegerse frente a valores nulos.
- **`Estatistikak`** (Estadísticas): estadísticas en tiempo real usando
  `Dictionary<string,int>`, que cuenta las cuentas por tipo y por plataforma.
- **`Fitxategiak_kudeatu`** (Gestión de archivos): importa desde y exporta a archivos.
- **`Segurtasuna`** (Seguridad): un módulo de **auditoría de seguridad** que analiza
  todas las cuentas y marca las que tienen contraseñas débiles (menos de 8
  caracteres). Puntúa cada contraseña y da recomendaciones de seguridad.

## Qué demuestra

- Diseño **OOP**: encapsulación y modularidad.
- Estructuras de datos de C#: arrays, `List<>` y `Dictionary<>`.
- **Persistencia en archivos**: (importar/exportar) y análisis de datos.
- **Mentalidad de seguridad**: el módulo de auditoría de contraseñas surgió de
  pensar cómo detectar credenciales débiles.
- **Iteración y refactorización**: llevar un proyecto de una versión procedural a
  una arquitectura OOP mantenible.

## Tecnologías

C# · .NET · OOP (clases, getters/setters, modularidad) · `List` · `Dictionary` ·
gestión de archivos · interfaz de consola.

## Código

- v2 (OOP): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea-v2>
- v1 (procedural): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea>

> Estado: en desarrollo. v2 sigue creciendo con nuevas funciones de búsqueda
> avanzada y estadísticas.
