import axios from 'axios';
import type {Credentials} from "../model/Credentials.ts";

export const loginApi = async (_user: Credentials): Promise<boolean> => {
    try {
        const res = await axios.post("http://localhost:8080/login", _user, {
            headers: {'Content-Type': 'application/json'},
        });
        // TODO migrate to HttpOnly Cookies
        const jwtToken = res.headers.authorization;
        if (jwtToken) {
            sessionStorage.setItem("jwt", jwtToken);
            return true;
        }
        return false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
};