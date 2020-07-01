import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

// Since all the routes for the appointments will need to be authenticated, make the appointments router use the middleware to check if user is authenticated
// Apply the middleware in all appointments routes
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  // Get all the data inside the databse using the repository
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

// POST http://localhost:3333/appointments
appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  // Convert date string to Date object
  const parsedDate = parseISO(date);

  // Doesn't nedd to pass the repo anymore, because the service already has access to it on its file
  const createAppointment = new CreateAppointmentService();
  // Using await because operations on the databse throught the repo can take a while
  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
