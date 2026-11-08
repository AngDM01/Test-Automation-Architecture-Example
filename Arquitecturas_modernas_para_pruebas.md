# Arquitecturas Modernas para la Automatización de Pruebas de Software

## Integrantes

* Juán José Víquez Ríos
* Ángel Jesús Mena Coudin

## Introducción

La automatización de pruebas ha evolucionado de simples scripts lineales a ecosistemas complejos integrados en el ciclo de vida del desarrollo (DevOps). Este documento explora los fundamentos arquitectónicos que nunca cambian y cómo se aplican en las arquitecturas modernas actuales, integrando herramientas Cloud, CI/CD e Inteligencia Artificial.

## Fundamentos Arquitectónicos

> *Basado en el Syllabus ISTQB CTAL-TAE (Capítulo 3).*

### gTAA: El Modelo Conceptual (Generic Test Automation Architecture)

La gTAA es un concepto de diseño de alto nivel, es una visión abstracta entre la automatización de pruebas y los sistemas a los que esta se encuantra conectada:

- **SUT:** Interfaz que describe la conexión entre el SUT y la automatización de pruebas. Puede ser una UI, API, base de datos, etc.
- **Project management:** Interfaz que describe el progreso del desarrollo de la automatización de pruebas. Puede ser un tablero Kanban, un repositorio Git, un pipeline CI/CD, etc.
- **Test management:** Interfaz que describe la correspondencia entre las definiciones de los casos de prueba y los casos de prueba automatizados.
- **Configuration management:** Interfaz que describe los flujos de trabajo de integración continua/despliegue continuo (CI/CD), los entornos y el conjunto de elementos de prueba (testware).

gTAA propone separar la automatización en 4 funcionalidades fundamentales, comunicadas con el entorno :

Funcionalidades 
- **Generación de Pruebas (Test generation):** Creación automática de casos a partir de modelos. Esta capacida es opcional, quedaría hacerlo manual.
- **Definición de Pruebas (Test definition):** Dónde se diseñan los casos, datos y librerías. Separadas del SUT y/o herramientas de prueba.
- **Ejecución de Pruebas (Test execution):** Proporciona una herramienta de ejecución para realizar las pruebas seleccionadas de forma automática, así como un componente para el registro y la generación de informes de pruebas.
- **Adaptación de Pruebas (Test adaptation):** Proporciona la funcionalidad necesaria para adaptar las pruebas automatizadas a los diversos componentes o interfaces del SUT. Ofrece distintos adaptadores para conectar con el SUT mediante API, protocolos y servicios.

![Diagrama de la arquitectura genérica de automatización de pruebas (gTAA)](./media/images/gtaa.png)

### Cómo diseñar una solucion de automatización de pruebas basada en gTAA

Un TAS (Test Automation Solution) se define a partir de la comprensión de los requisitos funcionales, no funcionales y técnicos del sistema bajo prueba (SUT), así como de las herramientas existentes o necesarias requeridas para implementar dicha solución. Un TAS debe abordar:

- Selección de herramientas de automatización de pruebas y bibliotecas específicas para dichas herramientas (Playwright, Selenium, Cypress, REST Assured, etc.).
- Desarrollo de complementos (plugins) y/o componentes (Crear código propio para cubrir lo que las herramientas comerciales u open-source no hacen por defecto).
- Identificación de los requisitos de conectividad e interfaz (por ejemplo, cortafuegos, bases de datos, localizadores uniformes de recursos (URL)/conexiones, simulaciones/stubs, colas de mensajes y protocolos)
- Conexión con las herramientas de gestión de pruebas y de gestión de defectos (Integrar el framework con herramientas como Jira, Azure DevOps, TestRail, Zephyr, etc.).
- Utilización de un sistema de control de versiones y repositorios.


### Framework por Capas (TAF - Test Automation Framework)

El TAF constituye la base de un TAS. Las capas de un TAF definen una delimitación clara de clases con propósitos similares, tales como casos de prueba, generación de informes de prueba, registro de pruebas, etc. Al introducir una capa para cada propósito específico, el diseño puede volverse complejo. Por lo tanto, se recomienda mantener reducido el número de capas del TAF:

1. **Test Scripts (Capa Superior):** Contiene los casos de prueba. Proporcionar un repositorio de casos de prueba para el SUT. Invoca los servicios de la capa de lógica de negocio, lo cual puede implicar pasos de prueba, flujos de usuario o llamadas a la API.
2. **Business Logic (Lógica de Negocio):** Conjunto de componentes de automatización acoplados al SUT.Contiene la lógica dependiente del sistema (pasos de prueba, flujos de usuario). Hereda de las librerías core.
3. **Core Libraries (Librerías Core):** Capa inferior. Código 100% independiente del SUT (ej. utilidades de fechas, manejo de archivos, conexión a base de datos) necesarios para realizar los casos de prueba. Puede reutilizarse en múltiples proyectos de automatización de pruebas.


### Enfoques para la automatización de casos de prueba

Estos enfoques definen cuándo y cómo se escriben los casos de prueba.

- **BDD (Behavior-Driven Development):** Uso de lenguaje natural (Given/When/Then) para alinear negocio, desarrollo y QA. Una herramienta como Cucumber lee ese texto y lo conecta con código real mediante “step definitions”.
- **DDT (Data-Driven Testing):** Separar la lógica del script de los datos (CSV, Excel, DB). Un script, múltiples ejecuciones. El script no tiene los datos “quemados”.
- **TDD (Test-Driven Development):** Escribir la prueba primero (Red), el código después (Green) y refactorizar.

### Patrones de Diseño Esenciales

La automatización es desarrollo de software. Aplicar principios SOLID y POO es obligatorio:

- **Page Object Model (POM):** Crea una clase por cada página de la UI. Si la interfaz cambia, solo actualizas un archivo, no todos los tests. El test no busca botones, llama métodos de la página.
- **Flow Model:**  Capa encima del POM. Agrupa varios POM en un caso de uso completo, si un POM hace un login y otro un checkout, el flow model los agrupa para realizar un flujo completo, como realizar una compra.
- **Facade:** Se usa para ocultar la complejidad de interactuar con múltiples APIs o servicios.
- **Singleton:** Garantizar que una clase tenga una única instancia. Asegura que todas las clases y tests utilicen el mismo navegador, evitando conflictos, mejorando el rendimiento y el uso de memoria.

## Modernización de la Automatización de Pruebas

Pues bien, lo anterior es una base, no obstante, que permite organizar nuestro framework de automatización de pruebas. Y cómo se mencionó, al momento de diseñar el TAS, se debe considerar que herramientas  modernas podemos utilizar y dónde integrarlas.

### Ejemplo de Arquitectura Moderna para Automatización de Pruebas

Para entender mejor como está arquitectura se adapta a la actualidad, diseñaremos un TAS implementando herramientas de automatización modernas, con el propósito de entender dónde se integran y aclarar dónde se resaltan los conceptos teóricos. Entonces se utilizará:

#### Sistemas conectados al TAS

* El SUT será una tienda en línea con UI y API REST, llamada "MiTiendita".
* GitHub Projects para la gestión del proyectos (Project Management). Acá se encuentran los tests pendientes, en progreso y completados.
* Para gestionar los casos de pruebas se utilizará TestRail (Test Management). Acá se encuentran los casos de prueba, los resultados de las ejecuciones y los reportes. No es código, pero es un repositorio de información de pruebas.
* Para gestionar la configuración se utilizará GitHub Actions para la integración continua CI/CD (Configuration Management). Acá se encuentran los pipelines de ejecución de pruebas, la configuración de entornos y la gestión de versiones del código.

> Podemos denotar que GitHub cubre gran parte de lo que gTAA propone, pero no todo, aunque se podría intentar, pero es mejor utilizar herramientas especializadas para cada función.

#### Herramientas para cubrir las funcionalidades de gTAA

Para las 4 funcionalidades que gTAA propone, se utilizarán las siguientes herramientas:

* Para la generación de pruebas (Test Generation) se utilizará Testim, que permite generar casos de prueba a partir de la UI y la API, utilizando inteligencia artificial para identificar elementos y flujos de usuario.
* Para la definición de pruebas (Test Definition) se utilizará Playwright Test, que permite definir casos de prueba con soporte para UI y API, y con integración con TestRail para la gestión de casos de prueba.
* Para la ejecución de pruebas (Test Execution) se utilizará Playwright, que permite ejecutar pruebas en múltiples navegadores y dispositivos, con soporte para UI y API.
* Para la adaptación de pruebas (Test Adaptation) se utilizará un adaptador personalizado que conecta Playwright con el SUT, utilizando API REST y WebSockets para interactuar con la tienda en línea.

> Cómo se puede ver, la arquitectura moderna propuesta integra herramientas Cloud, CI/CD e Inteligencia Artificial, siguiendo los fundamentos arquitectónicos de gTAA y TAF, y aplicando patrones de diseño esenciales para la automatización de pruebas. Similar a GitHub, la herramienta playwright cubre gran parte de lo que gTAA propone.

#### Estructura del TAS

Recordemos la estructura base que propone el TAF, y cómo se adapta a la arquitectura moderna propuesta:

```
Test_MiTiendita/
├── tests_scripts/
├── business_logic/
├── core_libraries/
```

Dependiendo de los enfoques de automatización de pruebas y patrones de diseño que se utilicen, se pueden agregar carpetas adicionales, por ejemplo, si usamos DDT, POM, Flow model, etc. La estructura completa tomando en cuenta los archivos necesarios para implementar las herramientas modernas propuestas, quedaría masomenos de la siguiente:

```
Test_MiTiendita/                         # Raíz del repositorio
├── pyproject.toml                       # Dependencias y configuración del proyecto Python
├── requirements.txt                     # Alternativa a pyproject si se usa requirements
├── pytest.ini                           # Marcadores, rutas, opciones de pytest
├── .env.example                         # Variables: BASE_URL_UI, BASE_URL_API, TESTRAIL_*
├── README.md
├── Makefile                             # Comandos: make test-ui, test-api, test-e2e
│
├── tests_scripts/                       # Test Definition / Test Execution
│   ├── conftest.py                      # Fixtures globales, hooks TestRail, Playwright, API
│   ├── ui/
│   │   ├── test_login_ui.py
│   │   ├── test_catalogo_ui.py
│   │   ├── test_carrito_ui.py
│   │   └── test_checkout_ui.py
│   ├── api/
│   │   ├── test_auth_api.py
│   │   ├── test_productos_api.py
│   │   ├── test_carrito_api.py
│   │   └── test_ordenes_api.py
│   ├── e2e/
│   │   └── test_compra_end_to_end.py
│   └── generated_testim/                # Casos generados/exportados desde Testim
│       └── README.md                    # Notas de importación/adaptación a Python
│
├── business_logic/                      # Lógica específica de “MiTiendita”
│   ├── ui/
│   │   ├── pages/
│   │   │   ├── base_page.py
│   │   │   ├── login_page.py
│   │   │   ├── catalogo_page.py
│   │   │   ├── carrito_page.py
│   │   │   └── checkout_page.py
│   │   └── flows/
│   │       └── flujo_compra.py
│   ├── api/
│   │   ├── clients/
│   │   │   ├── base_api_client.py
│   │   │   ├── auth_api.py
│   │   │   ├── productos_api.py
│   │   │   ├── carrito_api.py
│   │   │   └── ordenes_api.py
│   │   ├── models/
│   │   │   ├── producto.py
│   │   │   ├── carrito.py
│   │   │   └── orden.py
│   │   └── schemas/
│   │       ├── producto_schema.json
│   │       └── orden_schema.json
│   └── adapters/                        # Test Adaptation
│       ├── mittiendita_adapter.py       # Une Playwright/API REST con el SUT
│       └── websocket_adapter.py         # Interacción por WebSockets
│
├── core_libraries/                      # Framework reutilizable
│   ├── config/
│   │   ├── settings.py
│   │   └── environments/
│   │       ├── dev.yaml
│   │       ├── qa.yaml
│   │       └── staging.yaml
│   ├── playwright/
│   │   ├── browser_factory.py
│   │   └── fixtures.py
│   ├── http/
│   │   └── http_client.py
│   ├── reporting/
│   │   ├── testrail_client.py           # Cliente API TestRail
│   │   └── pytest_testrail_hook.py      # Publica resultados por caso
│   ├── data_factories/
│   │   ├── user_factory.py
│   │   └── product_factory.py
│   ├── assertions/
│   │   ├── api_assertions.py
│   │   └── ui_assertions.py
│   └── utils/
│       ├── logger.py
│       ├── waits.py
│       └── secrets.py
│
├── data/                                # DDT
│   ├── ui/
│   │   └── login_cases.csv
│   ├── api/
│   │   ├── productos.json
│   │   └── ordenes.json
│   └── e2e/
│       └── flujo_compra.yaml
│
├── reports/                             # Salidas generadas, no versionar
│   ├── html/
│   ├── junit/
│   └── testrail/
│
└── .github/
    └── workflows/
        ├── ui-tests.yml                 # GitHub Actions: UI
        ├── api-tests.yml                # GitHub Actions: API
        └── e2e-tests.yml                # GitHub Actions: E2E
```

> La estructura propuesta es bastante extensa, pero es porque se toma en cuenta la integración de múltiples herramientas y enfoques anteriormente mencionados. En proyectos más pequeños, se pueden eliminar herrramientas y por ende carpetas y archivos, pero siempre manteniendo la separación de responsabilidades y la modularidad.
