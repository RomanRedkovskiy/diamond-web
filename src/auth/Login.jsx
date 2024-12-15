import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import './Auth.css'
import urlFromTemplate from "../config/url";
import {ENDPOINTS} from "../config/endpoints";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setUser} from "../redux/userSlice";

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginUser = async (e) => {
        e.preventDefault();
        const apiUrl = urlFromTemplate(ENDPOINTS.USER) + '/login';
        try {
            const response = await axios.post(apiUrl, {login, password}, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true'
                },
            })
            localStorage.setItem('Token', response.headers['authorization']);
            dispatch(setUser(response.data));
            navigate('/panel/projects')
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={loginUser}>
                <div>
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" required
                           value={login}
                           onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="login-link">
                <Link to="registration" style={{cursor: "pointer"}}>
                    Don't have an account?
                </Link>
            </div>
        </>
    );
};

export default Login;