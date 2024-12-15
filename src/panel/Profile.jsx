import React, {useState} from 'react';
import {Typography} from "@mui/material";
import urlFromTemplate from "../config/url";
import {ENDPOINTS} from "../config/endpoints";
import axios from "axios";
import {setUser} from "../redux/userSlice";
import {useDispatch, useSelector} from "react-redux";
import formatDate from "../util/TimeFormatters";

const Profile = () => {

    const user = useSelector(state => state.user);
    const [login, setLogin] = useState(user.login || '');
    const [password, setPassword] = useState('');
    const [about, setAbout] = useState(user.about || '');
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = urlFromTemplate(ENDPOINTS.USER);
        try {
            const response = await axios.put(apiUrl, {id: user.id, login, password, about}, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true',
                    'Authorization': localStorage.getItem('Token'),
                },
            })
            dispatch(setUser(response.data));
            setLogin(response.data.login);
            setPassword(response.data.password);
            setAbout(response.data.about);
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div style={{backgroundColor: '#f3f3f3', minHeight: '100vh'}}>
            <div style={{maxWidth: '600px', margin: '0 auto'}}>
                <Typography variant="h5" style={{marginTop: '20px', textAlign: 'center'}}>Profile</Typography>
                <form onSubmit={handleSubmit} style={{maxWidth: '600px'}}>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{display: 'block', marginBottom: '5px'}}>Login</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px'}}
                            required
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{display: 'block', marginBottom: '5px'}}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px'}}
                            required
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label style={{display: 'block', marginBottom: '5px'}}>About</label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                resize: 'none',
                            }}
                            rows="4"
                        />
                    </div>
                    <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                        <span>Role:</span>
                        <span>{user.role === 'CLIENT' ? 'Client' : 'Admin'}</span>
                    </div>
                    {user.inviterLogin &&
                        <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                            <span>Inviter:</span>
                            <span>{user.inviterLogin}</span>
                        </div>
                    }
                    <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                        <span>Balance:</span>
                        <span>{user.balance || '0.00'}</span>
                    </div>
                    <div style={{marginBottom: '15px', display: 'flex', justifyContent: 'space-between'}}>
                        <span>Registration Time:</span>
                        <span>{user.registrationTime ? formatDate(user.registrationTime) : 'N/A'}</span>
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
