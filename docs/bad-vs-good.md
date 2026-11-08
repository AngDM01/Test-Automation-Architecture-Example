# Mala vs. buena arquitectura de automatización

Las dos suites prueban el mismo comportamiento sobre la misma aplicación. La
aplicación no contiene errores artificiales: las diferencias están en cómo se
automatiza.

## 1. Resumen

| Dimensión | Mala (`tests/bad`) | Buena (`tests/good`) |
| --- | --- | --- |
| Navegación | Espera fija después de `goto` | `goto` + aserción de encabezado visible |
| Localización | Posición del input y clase CSS | Roles, etiquetas y nombres accesibles |
| Sincronización | `waitForTimeout(2000)` | Auto-waiting de Playwright |
| Datos | `Producto Demo`, `99.99`, `5` | Fábrica con prefijo único |
| Preparación | Depende del test anterior | API o interacción explícita |
| Limpieza | Ninguna | Fixture + limpieza de restos |
| Orden | Serial, un worker | Tests independientes, paralelos |
| Assertions | `body` contiene un fragmento | Valores de precio, stock, detalle y errores |
| Mantenimiento | Cambiar un selector rompe varios tests | Cambia el Page Object en un solo lugar |
| Cobertura | Solo UI | Unitaria + API + E2E |
| Diagnóstico | Un fallo deja poco contexto | Trace, screenshot y video por fallo |

## 2. Problemas de la mala arquitectura

### 2.1 Selectores posicionales y de CSS

```ts
await page.locator('input').nth(0).fill('Producto Demo');
await page.locator('input').nth(1).fill('99.99');
await page.locator('form button').last().click();
await page.locator('.product-card').first();
```

Problemas:

- Agregar un campo antes del nombre rompe el llenado.
- Reordenar botones envía el formulario equivocado.
- Cambiar `class="product-card"` rompe la suite aunque el usuario siga viendo lo
  mismo.
- El test conoce la implementación, no la intención.

Solución en la suite buena:

```ts
page.getByLabel('Nombre', { exact: true });
page.getByRole('button', { name: 'Crear producto' });
productList.getByRole('listitem').filter({ hasText: name });
```

Los selectores semánticos sobreviven a refactors de CSS y de orden, y además
comprueban que la interfaz sea accesible.

### 2.2 Esperas fijas

```ts
await page.waitForTimeout(2000);
```

Problemas:

- Si la operación tarda 2.1 s, el test falla.
- Si tarda 50 ms, se pierden 1.95 s.
- El tiempo no expresa ninguna condición de negocio.
- Con 3 tests se acumulan 11.5 s de espera artificial.

Solución: Playwright espera automáticamente a que el elemento esté visible,
habilitado y estable antes de interactuar, y las aserciones reintentan hasta el
timeout. La suite buena no tiene ni un `waitForTimeout`.

### 2.3 Datos hardcodeados y falta de preparación

```ts
await page.locator('input').nth(0).fill('Producto Demo');
```

Problemas:

- Dos ejecuciones comparten el mismo nombre.
- El test no crea su propio estado: asume que la base está en cierto punto.
- No se puede ejecutar en paralelo.
- La suite deja basura en la base.

Solución:

```ts
const product = productFactory.valid({ price: 42.5, stock: 11 });
```

`ProductFactory` genera `qa-good-<uuid>-producto-1`. La fixture elimina todo lo
que tenga ese prefijo al terminar, incluso si el test falla.

### 2.4 Dependencia del estado previo y acoplamiento

```ts
test.describe.configure({ mode: 'serial' });

test('crear producto', ...);
test('ver detalle del producto creado antes', ...);
```

El segundo test no crea nada: depende del primero. Si se ejecuta solo, falla.
Si el primero falla, Playwright salta el segundo y se pierde cobertura. El orden
del archivo se vuelve parte del contrato.

Verificación real: ejecutar solo el segundo test con la base sin `Producto Demo`
falla al esperar ese nombre. Es una falla de diseño, no de la aplicación.

Solución: cada test prepara lo que necesita con `productsApi` o con la interfaz,
y verifica su propio resultado.

### 2.5 Assertions insuficientes

```ts
expect(await page.locator('body').innerText()).toContain('precio');
```

Problemas:

- No distingue un error de precio de un texto cualquiera.
- No verifica el campo afectado ni el mensaje.
- No comprueba que el producto inválido no se haya persistido.
- No valida precio, stock ni detalle en el caso feliz.

Solución:

```ts
await expect(productsPage.formAlert).toContainText(
  'Revisa los datos del producto.',
);
await expect(productsPage.fieldError(scenario.message)).toBeVisible();
await expect(productsPage.productCard(product.name)).toHaveCount(0);
```

### 2.6 Repetición y acoplamiento entre pasos

El llenado del formulario aparece copiado en cada test. Un cambio en el
formulario obliga a editar todas las copias. La suite buena concentra el llenado
en `ProductsPage.fillProduct` y el caso de uso en `CreateProductFlow`.

## 3. Cómo lo resuelve la buena arquitectura

### 3.1 Responsabilidades

| Componente | Responsabilidad | No hace |
| --- | --- | --- |
| `ProductsPage` | Localizar y operar la página | Generar datos o decidir el escenario |
| `ProductDetailPage` | Localizar el detalle | Navegar por toda la aplicación |
| `CreateProductFlow` | Encadenar pasos del caso de uso | Definir aserciones de negocio |
| `ProductFactory` | Generar datos únicos | Conocer selectores |
| `ProductsApi` | Hablar con el contrato HTTP | Tocar el DOM |
| Fixtures | Componer dependencias y limpiar | Contener pasos de negocio |
| Tests | Describir comportamiento y verificar | Implementar detalles de UI |

### 3.2 POM y Flow Model

El **Page Object Model** responde "¿dónde está cada cosa y cómo se opera?".
El **Flow Model** responde "¿qué pasos componen este caso de uso?".

```text
Test "crea un producto..."
  └── CreateProductFlow.create(product)
        ├── ProductsPage.fillProduct(product)
        ├── ProductsPage.submit()
        └── ProductsPage.successMessage visible
  └── assertions sobre la tarjeta y el detalle
```

Separarlos evita dos extremos:

- un Page Object gigante que contiene reglas de negocio;
- tests que repiten secuencias de clics.

### 3.3 Fixtures

Las fixtures de Playwright permiten declarar dependencias y limpieza sin
`beforeEach`/`afterEach` globales:

```ts
productFactory: async ({}, use) => {
  const prefix = `qa-good-${randomUUID().slice(0, 8)}`;
  await use(new ProductFactory(prefix));
  await deleteProductsByNamePrefix(prefix);
},
```

Ventajas:

- el test pide solo lo que necesita;
- la limpieza se ejecuta aunque haya un fallo;
- el estado no se comparte entre tests;
- el prefijo permite limpiar sin borrar datos ajenos.

La limpieza se niega a ejecutarse en producción o contra hosts que no sean
locales. `globalSetup` borra restos antiguos de ejecuciones interrumpidas, pero
solo los que tengan más de una hora.

### 3.4 Data-Driven Testing

Los casos inválidos están en una tabla:

```ts
export const invalidProductCases = [
  { id: 'precio-negativo', overrides: { price: -0.01 }, ... },
  { id: 'stock-negativo', overrides: { stock: -1 }, ... },
  { id: 'nombre-vacio', overrides: { name: '   ' }, ... },
];
```

Las pruebas de API iteran sobre todos. Las E2E iteran sobre los que deben llegar
al backend. Agregar un caso es agregar datos, no duplicar lógica.

### 3.5 Separación entre UI y API

- **Unitarias**: reglas puras, rápidas, sin infraestructura.
- **API**: contrato, status, forma del error y persistencia.
- **E2E**: integración real desde el navegador, pero solo para comportamientos
  visibles.

Probar todo por UI sería lento y frágil. Probar todo por API dejaría sin cubrir
el formulario, los mensajes y la navegación. La combinación cubre cada riesgo en
el nivel más barato que lo detecta.

### 3.6 Preparación y aislamiento de datos

| Momento | Acción |
| --- | --- |
| Inicio de ejecución | `globalSetup` elimina restos `qa-good-%` con más de una hora |
| Inicio de cada test | `ProductFactory` genera un prefijo único |
| Durante el test | Se crea por UI o por API según el escenario |
| Fin de cada test | La fixture elimina por prefijo |
| Suite mala | No limpia: es parte del anti-patrón |

## 4. CI/CD

La pipeline ejecuta lint, tipos, unitarias, API y E2E en trabajos separados. Eso
aporta:

- **Reproducibilidad**: base de datos y Chromium limpios en cada ejecución.
- **Detección temprana**: un cambio que rompe el contrato se ve antes del merge.
- **Diagnóstico**: reporte HTML, screenshot, video y trace como artefactos.
- **Aislamiento**: un fallo de E2E no oculta el resultado de las unitarias.
- **Costo controlado**: API y unitarias fallan rápido; E2E se ejecuta después.

La suite mala también se ejecuta en CI para demostrar que es funcional, aunque
su diseño deje datos. En un proyecto real no se incluiría como suite de
regresión: se conserva solo como material didáctico.

## 5. Tiempos medidos

Dos ejecuciones locales el 2026-11-08, misma máquina, con la API ya en ejecución:

| Suite | Tests | Duración reportada |
| --- | --- | --- |
| Buena E2E | 5 | 18.2 s |
| Buena E2E | 5 | 25.4 s |
| Mala | 3 | 22.1 s |

La variabilidad entre las dos corridas de la suite buena muestra que una sola
medición no alcanza para concluir cuál es más rápida. La suite mala contiene
11.5 s de esperas fijas y se ejecuta en serie con un worker; la buena cubre más
escenarios y puede paralelizarse. El argumento del proyecto no es la velocidad,
sino el aislamiento y el mantenimiento. Los números son observaciones puntuales,
no un benchmark.

## 6. Conclusión

La suite mala **funciona** en el camino feliz, y ese es el punto: una suite puede
pasar y aun así ser cara de mantener. La suite buena no es más valiosa por usar
más archivos ni por ser siempre más rápida, sino porque cada archivo tiene una
responsabilidad clara, los datos están aislados y las fallas dicen qué
comportamiento se rompió.
