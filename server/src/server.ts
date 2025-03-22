import 'reflect-metadata'; // Required for tsyringe DI
import './di/container';
import app from './app';


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });