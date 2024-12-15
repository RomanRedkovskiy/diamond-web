// components/navbar.jsx
import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import urlFromTemplate from "../config/url";
import {ENDPOINTS} from "../config/endpoints";
import {setUser} from "../redux/userSlice";
import {useDispatch, useSelector} from "react-redux";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalType, setModalType] = useState(null);
    const [amount, setAmount] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('Token');
        dispatch(setUser());
        navigate('/');
    };

    const userBalance = useSelector((state) => state.user?.balance);

    const handleModalSubmit = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        const apiUrl = urlFromTemplate(ENDPOINTS.USER) + `/${modalType}`;
        try {
            const response = await axios.post(apiUrl, {amount}, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true',
                    'Authorization': localStorage.getItem('Token'),
                },
            });
            dispatch(setUser(response.data));
            setModalType(null); // Close modal
            setAmount('');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <>
            <nav
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Link
                    to="/panel/projects"
                    style={{
                        marginRight: '15px',
                        textDecoration: 'none',
                        fontSize: '24px',
                        color: 'black',
                        alignSelf: 'center',
                    }}
                >
                    DIAMOND
                </Link>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginLeft: 'auto', // Start from the center
                        width: '40%', // Take up half the width of the parent
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'center',
                    }}>
                        <button
                            style={{
                                marginRight: '5px',
                                border: '1px solid black',
                                borderRadius: '50%',
                                minWidth: '30px',
                                width: '30px',
                                height: '30px',
                                textAlign: 'center',
                                lineHeight: '0px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setModalType('withdraw')}
                        >
                            -
                        </button>
                        <span style={{marginRight: '10px', fontSize: '17px', whiteSpace: 'nowrap'}}>
                        Balance: {userBalance} USD
                    </span>
                        <button
                            style={{
                                border: '1px solid black',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                textAlign: 'center',
                                lineHeight: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setModalType('deposit')}
                        >
                            +
                        </button>
                    </div>
                    <Link
                        to="/panel/profile"
                        style={{
                            marginRight: '15px',
                            textDecoration: 'none',
                            fontSize: '17px',
                            color: 'black',
                            alignSelf: 'center',
                        }}
                    >
                        Profile
                    </Link>
                    <button style={{maxWidth: '100px'}} onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </nav>
            {modalType && (
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
                    onClick={() => setModalType(null)} // Close modal on backdrop click
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
                        <h2 style={{marginTop: '0'}}>{modalType === 'withdraw' ? 'Withdraw' : 'Deposit'}</h2>
                        <h5 style={{margin: '0 0 5px 0', fontWeight: 'normal'}}>Imagine it's a payment API :)</h5>
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
            )}
        </>
    );
};

export default Navbar;