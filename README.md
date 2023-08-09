## G-eCOMMERCE-ADMIN

### Descripción

Esta aplicación te permite gestionar las categorías, colores, tamaños, cabeceras y productos de varias tiendas en un solo panel de control.

### Como se usa

1. Inicia sesión con tu correo electrónico o con tus RR.SS.
2. Crea una tienda en la esquina superior izquierda.
3. Crea uno o varias cabeceras en 'Billboards'.
4. Crea una o varias categorías para los productos de tu tienda en 'Categories'.
5. Crea uno o varios tamaños para los productos de tu tienda en 'Sizes'.
6. Crea uno o varios colores para los productos de tu tienda en 'Colors'.
7. Crea uno o varios productos añadiendo las categorías, tamaños, y colores que has definido anteriormente en 'Products'.
8. Lleva el seguimiento de los pedidos en 'Orders'.

### Tecnologías

1. App --> NextJS 13 con App Router
   1. Formularios --> react-hook-form and zod
   2. Llamadas API --> axios
   3. Subida de imágenes --> Cloudinary y next-cloudinary
2. Autenticación --> Clerk
3. Estilos y Diseño --> shadcn/ui y tailwindcss
4. BB.DD. --> PlanetScale (MySQL)
   1. ORM --> Prisma
5. Gestor de estado global --> zustand

### Pasos Stripe para DEV

1. Instalar paquete de Stripe ejecutando:

```
npm install stripe
```

2. Crea una nueva cuenta de desarrollador en tu cuenta de Stripe.

3. Copia la 'Secret Key' de la cuenta creada y asígnala a la variable 'STRIPE_API_KEY' en '.env'.

4. Crea el archivo '@/lib/stripe.ts'

5. Crea la ruta '@/app/api/[storeId]/checkout/route.ts' para poder llamar a la API de Stripe.

6. Para poder probarlo, necesitamos un webhook en local por lo que accede en Stripe a 'Developers/Webhooks/Test in a local environment' y sigue los pasos:

   1. Descargate la última versión para Windows y añade la ruta de stripe.exe a la variable de entorno 'Path' en Windows.

   2. Ejecuta lo siquiente y acepta los términos de uso en la página redireccionada:

   ```
   stripe login
   ```

   3. Ejecuta lo siguiente para obtener el secreto para firmar las peticiones al webhook:

   ```
   stripe listen --forward-to
   ```

   4. Asigna el secreto a 'STRIPE_WEBHOOK_SECRET' en '.env'.

7. Crea el webhook en el archivo '@/app/api/webhooks/route.ts'

8. Ejecuta lo siguiente para ver si todo funciona:

```
stripe trigger payment_intetn.succeeded
```

### Pasos Stripe para PROD

1. En Developers/Webhooks dentro de Stripe, añade un endpoint y:

   1. Mete la URL de producción de g-commerce-admin en 'Endpoint URL' y añade '/api/webhook'
   2. Selecciona el evento 'checkout.session.completed'

2. Selecciona el webhook creado, copia el 'Signing secret' y pégalo en la variable de entorno 'STRIPE_WEBHOOK_SECRET'
3. Para que se puedan aceptar pagos con tarjetas de verdad hay que quitar el modo test de Stripe y registrarse.
