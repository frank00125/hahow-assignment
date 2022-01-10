import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

import expressApp from './app';

const PORT = parseInt(process.env.PORT || '8000');

expressApp.listen(PORT, () =>
	console.log(`Hahow Assignment Started at PORT ${PORT}`)
);
