import { createConnection } from 'typeorm';

// Look for a config file on the app environment
// Use those configurations as credentials of the database to make the connection
createConnection();
