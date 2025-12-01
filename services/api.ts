import axios from "axios";

const Api = axios.create({
  baseURL: "http://10.50.1.105/v1/"
});

export default Api;
