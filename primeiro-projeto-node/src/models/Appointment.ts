import { uuid } from 'uuidv4';

// Define type of data of an Appointment
class Appointment {
  id: string;

  provider: string;

  date: Date;

  // Omit is like a function and what is inside <> is the params
  // pass the type and the variable you want to omit
  constructor({ provider, date }: Omit<Appointment, 'id'>) {
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
}

export default Appointment;
