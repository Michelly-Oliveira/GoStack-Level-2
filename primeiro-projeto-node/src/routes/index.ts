import { Router } from 'express';
import appointmentsRouter from './appointments.routes';

const routes = Router();

// pass the path /appointments to every route inside appointmentsRouter
routes.use('/appointments', appointmentsRouter);

export default routes;
