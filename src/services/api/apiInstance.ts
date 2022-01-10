import axios from 'axios';

export default axios.create({
	baseURL: process.env.HAHOW_API_BASE_URL,
	timeout: parseInt(process.env.HAHOW_API_TIMEOUT || '10') * 1000,
});
