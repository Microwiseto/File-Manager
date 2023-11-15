import express from 'express';

import { getUsers, registerUser, loginUser, createFolder, createSubfolder, fileUpload, fileDelete, fileRename} from '../controllers/users.js';

const router = express.Router();
global.user = null;

router.get('/', getUsers);
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

router.post('/create/folder', createFolder);
router.post('/create/subfolder', createSubfolder);

router.post('/file/upload', fileUpload);
router.delete('/file/delete', fileDelete);
router.patch('/file/rename', fileRename);

export default router;