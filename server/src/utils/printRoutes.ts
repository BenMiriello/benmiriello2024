import { Express } from 'express';

export function printRoutes(app: Express) {
  console.log('Routes\n------------------')
  app._router.stack.forEach(printRoute);

  function printRoute(layer: any) {
      if (layer.route) {
          const methods = Object.keys(layer.route.methods)
              .map(method => method.toUpperCase())
              .join(', ');

          console.log(`${methods} ${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle.stack) {
          layer.handle.stack.forEach(printRoute);
      }
  }
  console.log('------------------\n')
}

