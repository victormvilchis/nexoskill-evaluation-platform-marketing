# Sistema de marca Valtieris

## Arquitectura de marca

- **Marca pública:** Valtieris
- **Descriptor comercial:** Evaluación y desarrollo de talento tecnológico
- **Producto operativo futuro:** Valtieris Talent Platform

El sitio público utiliza únicamente **Valtieris** en el logotipo principal. El descriptor de producto no forma parte del lockup del marketing.

## Activos

Los activos oficiales del sitio se encuentran en `public/brand/`:

- `valtieris-logo-720.png`: logotipo principal para fondos claros.
- `valtieris-logo-inverse-720.png`: logotipo para fondos oscuros.
- `valtieris-icon-512.png`: símbolo principal.
- Variantes de 16, 32, 48, 64, 96, 180 y 192 px para navegador y dispositivos.

No deben reconstruirse el símbolo ni el wordmark mediante texto, emoji o iconos genéricos.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| Navy 950 | `#071A2B` | Fondos de alto énfasis, footer y texto oscuro |
| Navy 900 | `#0B2239` | Superficies oscuras y tarjetas destacadas |
| Executive blue | `#155EEF` | CTA principal, links activos y foco |
| Executive blue hover | `#124AC4` | Hover de CTA principal |
| Teal | `#0F766E` | Acentos, estados positivos e iconografía |
| Soft blue | `#EAF2FF` | Superficies informativas |
| Soft teal | `#E6F7F4` | Badges y énfasis secundarios |
| Page background | `#F7F9FC` | Fondo general |
| Heading | `#152238` | Encabezados |
| Body | `#283B50` | Texto principal |
| Muted | `#52657A` | Texto secundario |
| Border | `#D8E1EA` | Bordes y divisores |

## Principios de uso

1. El azul ejecutivo es la acción primaria de conversión.
2. El teal funciona como acento y no compite con los CTA principales.
3. Los fondos oscuros se reservan para hero, CTA final, footer y el plan recomendado.
4. Business Talent es el plan recomendado y la única tarjeta de planes con superficie navy.
5. Los textos deben conservar contraste WCAG AA.
6. No debe mostrarse “Iniciar sesión” en el sitio comercial.
7. No deben aparecer tecnologías, marcas o arquitecturas internas de clientes.

## Compatibilidad técnica

Para evitar una migración disruptiva, esta entrega conserva temporalmente:

- El repositorio y rutas locales actuales.
- El backend utiliza el namespace Java `com.valtieris.marketing`.
- Los objetos Oracle con prefijo `MKT_`.
- Las claves de almacenamiento anteriores únicamente como lectura de compatibilidad y migración automática.

Esos identificadores no se muestran como marca pública.
