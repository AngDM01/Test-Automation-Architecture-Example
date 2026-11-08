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

- **BDD (Behavior-Driven Development):** Uso de lenguaje natural (Given/When/Then) para alinear negocio, desarrollo y QA.
- **DDT (Data-Driven Testing):** Separar la lógica del script de los datos (CSV, Excel, DB). Un script, múltiples ejecuciones.
- **TDD (Test-Driven Development):** Escribir la prueba primero (Red), el código después (Green) y refactorizar.

### Patrones de Diseño Esenciales

La automatización es desarrollo de software. Aplicar principios SOLID y POO es obligatorio:

- **Page Object Model (POM):** Crea una clase por cada página de la UI. Si la interfaz cambia, solo actualizas un archivo, no todos los tests.
- **Flow Model:** Evolución del POM. Añade una capa extra (doble fachada) que agrupa acciones del usuario (ej. "Hacer_Checkout"). Permite reutilizar flujos complejos en múltiples scripts.
- **Facade y Singleton:** Ocultar complejidad y asegurar una única instancia de conexión (ej. un solo driver de navegador).
