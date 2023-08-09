## Tecnologías

### Admin

1. App --> NextJS 13 App Router
   1. Form handling --> shadcn/ui(react-hook-form and zod)
   2. API calls --> axios
   3. Imgage upload --> Cloudinary and next-cloudinary
2. Authentication --> Clerk
3. Style --> shadcn/ui and RadixUI
4. Database --> PlanetScale (MySQL)
   1. ORM --> Prisma
5. Global state management --> zustand

### Store

1. App --> NextJS 13 App Router
2. Authentication --> Clerk
3. Style --> Headless ui and tailwind
4. Database --> PlanetScale (MySQL)
   1. ORM --> Prisma

## Stripe steps

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
