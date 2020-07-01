import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  // Return type is a promise , and the parameter of the promise is the type of the response the promise returns
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    // Get the repository using a method from typeorm
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    // Set hour to the start: hour+3, min, sec, ms
    const appointmentDate = startOfHour(date);

    // Every operation on the databse using the repository returns a promise, so we need to use await before the expression to wait until we have the data to continue the program
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      // Since services don't have access to request and response, return an error (not a status code and response.json)
      throw new AppError('This appointment is already booked');
    }

    // Create an object from Appointment - it doesn't save it on the database
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // Save registry on databse
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
