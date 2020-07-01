import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
// Importing the repo so we can define the type of the repositories on the construcotr as an AppointmentsRepository
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  // the parameter is an instance of a class
  constructor(appointmentsRepository: AppointmentsRepository) {
    // created a variable to store the repository
    // this.appointmentsRepository = local variable
    // appointmentsRepository = instance of class received as parameter
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    // Set hour to the start: hour+3, min, sec, ms
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      // Since services don't have access to request and response, return an error (not a status code and response.json)
      throw Error('This appointment is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
