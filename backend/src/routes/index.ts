import { Router } from 'express';
import { assistantRouter } from './assistantRoutes.js';
import { productRouter } from './productRoutes.js';
import { priceWatchRouter } from './priceWatchRoutes.js';
import { financialRouter } from './financialRoutes.js';
import { purchaseRouter } from './purchaseRoutes.js';
import { paymentRouter } from './paymentRoutes.js';
import { memoryRouter } from './memoryRoutes.js';
import { demoRouter } from './demoRoutes.js';

export const apiRouter = Router();

apiRouter.use('/assistant', assistantRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/price-watches', priceWatchRouter);
apiRouter.use('/finance', financialRouter);
apiRouter.use('/purchases', purchaseRouter);
apiRouter.use('/paypal', paymentRouter);
apiRouter.use('/memory', memoryRouter);
apiRouter.use('/', demoRouter);
