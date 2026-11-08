# Suite mala (intencionalmente)

Esta suite existe únicamente para demostrar, en la exposición, cómo una
automatización puede ser funcional y aun así difícil de mantener.

No copies estos patrones en un proyecto real. La comparación completa está en
[`docs/bad-vs-good.md`](../../docs/bad-vs-good.md).

## Anti-patrones incluidos

| Anti-patrón | Dónde se ve |
| --- | --- |
| Esperas fijas | `page.waitForTimeout(2000)` después de navegar y enviar |
| Selectores posicionales | `locator('input').nth(0)`, `locator('form button').last()` |
| Selectores acoplados al CSS | `.product-card`, `.product-card a` |
| Datos hardcodeados | `Producto Demo`, `99.99`, `5` |
| Dependencia del estado previo | El detalle asume que la primera prueba ya creó el producto |
| Acoplamiento entre pasos | `test.describe.configure({ mode: 'serial' })` |
| Falta de preparación | No crea sus propios datos mediante API ni base de datos |
| Falta de limpieza | Deja `Producto Demo` en la base cada vez que se ejecuta |
| Assertions insuficientes | Solo revisa parte del texto; no valida precio, stock ni errores por campo |
| Repetición | El llenado del formulario está copiado en varias pruebas |

## Comportamiento

La suite debe pasar cuando se ejecuta completa. Si se ejecuta solo el segundo
test, falla porque no existe el producto que asume el primer test. Esa
dependencia es parte de la demostración.

```bash
pnpm test:bad
```
