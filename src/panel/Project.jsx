import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import urlFromTemplate from "../config/url";
import {ENDPOINTS} from "../config/endpoints";
import axios from "axios";
import {setUser} from "../redux/userSlice";
import {useDispatch} from "react-redux";

const Project = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const project = location.state.project;
    const [modalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState('');

    const handleModalSubmit = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        const apiUrl = urlFromTemplate(ENDPOINTS.PROJECT) + `/invest/${project.id}`;
        try {
            const response = await axios.post(apiUrl, {amount}, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true',
                    'Authorization': localStorage.getItem('Token'),
                },
            })
            dispatch(setUser(response.data));
            setModalOpen(false);
            setAmount('');
            navigate('/panel/projects')
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (<>
        <div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p>Pool Sum: {project.poolSum}</p>
            <button style={{width: '300px', marginTop: '10px'}} onClick={() => setModalOpen(true)}>
                <h3 style={{margin: '5px'}}>Invest to a project</h3>
            </button>
        </div>
        {modalOpen &&
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={() => setModalOpen(false)}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '300px',
                        textAlign: 'center',
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                    <h2 style={{marginTop: '0'}}>{'Project investment'}</h2>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{width: '100%', padding: '10px', marginBottom: '15px'}}
                        placeholder="Enter amount"
                    />
                    <button
                        onClick={handleModalSubmit}
                        style={{padding: '10px 20px', marginRight: '10px'}}
                    >
                        Submit
                    </button>
                </div>
            </div>
        }
    </>);
}

export default Project;