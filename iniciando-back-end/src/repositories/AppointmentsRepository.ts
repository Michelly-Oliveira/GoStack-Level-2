import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

// Parameter for EntityRepository pass the model
@EntityRepository(Appointment)
// Extends methods that exists on the Repository class, also pass the model as parameter
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
