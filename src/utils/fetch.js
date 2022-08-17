import axios from 'axios'
import { api } from './routes'

export const get = async (route, id = '') => {
  const finalRoute = id === '' ? api + route: `${api}${route}/${id}`
  const response = await axios.get(finalRoute)
  return response.data
}

export const post = async (route, body) => {
  const data = await axios.post(api + route, body)
  return data.data
}

export const del = async (route, id) => {
  const data = await axios.delete(api + route + `/${id}`)
  return data
}

export const put = async (route, id, body) => {
  const data = await axios.patch(api + route + `/${id}`, body)
  return data
}