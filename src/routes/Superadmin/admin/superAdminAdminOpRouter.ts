import express from 'express';
import { addAdmin, deleteAdmin } from '../../../controllers/Superadmin/superAdminOperationsController';
import { handleAddAdminValidation } from '../../../middlewares/superAdmin/superAdminOpRouteValidations';
import { getAdmin, getAllAdmins } from '../../../controllers/Superadmin/superAdminFetchController';
import { extractIdFromParams } from '../../../utility/auth/requestUtils';
const superAdminAdminOpRouter = express.Router();

// ************************** GET *************************** //
superAdminAdminOpRouter.get('/getAllAdmins', getAllAdmins);
superAdminAdminOpRouter.get('/getAdmin/:id', extractIdFromParams, getAdmin);

// ************************** POST ************************** //
// TODO : add vadlidation before adding new admin
superAdminAdminOpRouter.post('/addAdmin', handleAddAdminValidation, addAdmin);



// ************************** PUT *************************** //
// superAdminAdminRouter.put();



// ************************** DELETE ************************** //
superAdminAdminOpRouter.delete('/deleteAdmin/:id', extractIdFromParams, deleteAdmin);


export default superAdminAdminOpRouter;