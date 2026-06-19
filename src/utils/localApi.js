import axios from 'axios'
const localApi = axios.create ( {
  baseURL : 'http://localhost:3001',
})

export default localApi