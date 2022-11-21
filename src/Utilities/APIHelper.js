import axios from 'axios';

const BASE_URL="http://localhost:41754/api"

axios.defaults.headers.common['Authorization'] =`Bearer ${JSON.parse(localStorage.getItem('userToken'))}`;
const token = localStorage.getItem('userToken')

export default function APIHelper()
{

}

export function get(url) {
    return axios.get(`${BASE_URL}/${url}`);
}
 export function post(url, data)  {
    return axios(`${BASE_URL}/${url}`, {
        method: 'post',
        headers:{'Access-Control-Allow-Origin': true,
        "Accept":"application/json",
        "Content-Type": 'application/json'},
        data:data,
    });
}

export function put(url, data)  {
    return axios(`${BASE_URL}/${url}`, {
        method: 'put',
        headers:{'Access-Control-Allow-Origin': true,
        "Accept":"application/json",
        "Content-Type": 'application/json; '},
        data:data,
    });
}
