import express from 'express';
import adminRouter from './routes/Admin/adminRouter';
import userRouter from './routes/User/userRouter';
import superAdminRouter from './routes/Superadmin/superAdminRouter';
import publicRouter from './routes/public/publicRouter';
import authRouter from './routes/authRouter/authRouter';
import { PORT } from './env';
import { applyBigIntJsonSerializer } from './utility/projectionTypes';
import corsMiddleware from './middlewares/common/corsMiddleware';


applyBigIntJsonSerializer();

const app = express();
app.use(express.json());
app.use(corsMiddleware);
// unauthenticated routes
app.use('/public', publicRouter);
app.use('/api/v1/auth', authRouter); // Login route for admin

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/superAdmin', superAdminRouter);




app.get('/', (req, res) => { res.send('Hello from kuinbee backend!'); });

app.listen(PORT, () => { console.log(`Server is running on port http://localhost:${PORT}`); });