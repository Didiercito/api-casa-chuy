import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connect } from './src/database/dbConfig'
import { encriptedPassword } from './src/seed/userSeed'
import { seedLightfocus } from './src/seed/lightfocusSeed'
import { userRouter } from './src/auth/infrastucture/routers/userRoutes'
import { lightFocusRouter } from './src/lightfocus/infrastucture/routes/lightfocusRoutes'
dotenv.config();

const app = express()
const PORT = process.env.PORT;


connect();
encriptedPassword();
seedLightfocus();
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/lightfocus', lightFocusRouter);

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`);
});