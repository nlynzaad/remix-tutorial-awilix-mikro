# Remixing MikroOrm with Dependency Injection

This project is to test [mikro-orm](https://mikro-orm.io/) with [remix](https://remix.run/) using [awilix](https://github.com/jeffijoe/awilix) for dependency injection. The project is not meant to be production ready but merely a POC using the remix tutorial as a demo.

Remix is in the process of developing [middleware](https://github.com/remix-run/remix/discussions/7642). Until this implemented this project uses the [remix-express-vite-plugin](https://github.com/kiliman/remix-express-vite-plugin) to create a custom express server with middleware.
The dependency injection container is injected into the route context using this middleware.

## Getting started

1) run the following to install all your dependencies
```shellscript 
npm install
```
2) run to following to create the first migration
```shellscript
npx mikro-orm-esm migration:create
``` 
3) run the following to create the database and apply the migration
```shellscript s
npx mikro-orm-esm migration:up
``` 
4) seed the database
```shellscript s
npx mikro-orm-esm seeder:run
``` 

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/server`
- `build/client`
