import React, {useEffect, useState} from "react";
import urlFromTemplate from "../config/url";
import {ENDPOINTS} from "../config/endpoints";
import axios from "axios";
import {Table, TableHead, TableBody, TableRow, TableCell, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {setUser} from "../redux/userSlice";
import {useDispatch, useSelector} from "react-redux";
import formatDate from "../util/TimeFormatters";

const MainPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [projects, setProjects] = useState([]);
    const [investLogs, setInvestLogs] = useState([]);
    const [interestLogs, setInterestLogs] = useState([]);
    const userId = useSelector(state => state.user?.id);

    useEffect(() => {
        getCurrentUser();
        getProjects();
        if (userId) {
            getLastInterestLogs();
            getLastInvestLogs();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const ws = new WebSocket(`ws://localhost:8080/${userId}`); // Connect to WebSocket server with the user ID

            ws.onopen = () => {
                console.log(`Connected to WebSocket server with userId: ${userId}`);
            };

            ws.onmessage = (event) => {
                console.log('Received message from server:', event.data);
                setInterestLogs(JSON.parse(event.data))
                getCurrentUser();
            };

            ws.onclose = () => {
                console.log('Disconnected from WebSocket server');
            };
        }
    }, [userId]);

    const getLastInterestLogs = async () => {
        const apiUrl = urlFromTemplate(ENDPOINTS.GRAPHQL);
        const query = `
        query {
          lastInterestLogs(userId: ${userId}) {
            id
            amount
            type
            dateTime
            projectTitle
          }
        }`;

        try {
            const response = await axios.post(apiUrl, {
                query: query
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                }
            });
            console.log(response.data);
            setInterestLogs(response.data.data.lastInterestLogs)
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const getLastInvestLogs = async () => {
        const apiUrl = urlFromTemplate(ENDPOINTS.GRAPHQL);
        const query = `
        query {
          lastInvestLogs(userId: ${userId}) {
            id
            amount
            type
            dateTime
            projectTitle
          }
        }`;

        try {
            const response = await axios.post(apiUrl, {
                query: query
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('Token')
                }
            });
            console.log(response.data);
            setInvestLogs(response.data.data.lastInvestLogs)
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const getProjects = async () => {
        const apiUrl = urlFromTemplate(ENDPOINTS.PROJECT);
        try {
            const response = await axios.get(apiUrl, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true',
                    'Authorization': localStorage.getItem('Token'),
                },
            })
            setProjects(response.data);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const getCurrentUser = async () => {
        const apiUrl = urlFromTemplate(ENDPOINTS.USER);
        try {
            const response = await axios.get(apiUrl, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Credentials': 'true',
                    'Authorization': localStorage.getItem('Token'),
                },
            })
            dispatch(setUser(response.data));
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    const handleProjectClick = (project) => {
        if (project) {
            navigate('/panel/project', {state: {project}});
        }
    }

    return (<>
        {interestLogs && interestLogs.length > 0 && <>
            <Typography variant="h5" style={{margin: '20px 0 0 10px'}}>
                Last interests
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Project title</TableCell>
                        <TableCell>Date time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {interestLogs.map((interestLog) => (
                        <TableRow key={interestLog.id}>
                            <TableCell>{interestLog.id}</TableCell>
                            <TableCell>{interestLog.amount}</TableCell>
                            <TableCell>{interestLog.type}</TableCell>
                            <TableCell>{interestLog.projectTitle}</TableCell>
                            <TableCell>{formatDate(interestLog.dateTime)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>}
        {investLogs && investLogs.length > 0 && <>
            <Typography variant="h5" style={{margin: '50px 0 0 10px'}}>
                Last investments
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Project title</TableCell>
                        <TableCell>Date time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {investLogs.map((investLog) => (
                        <TableRow key={investLog.id}>
                            <TableCell>{investLog.id}</TableCell>
                            <TableCell>{investLog.amount}</TableCell>
                            <TableCell>{investLog.type}</TableCell>
                            <TableCell>{investLog.projectTitle}</TableCell>
                            <TableCell>{formatDate(investLog.dateTime)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>}
        {projects && projects.length > 0 && <>
            <Typography variant="h5" style={{margin: '50px 0 0 10px'}}>
                Projects
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Invested sum</TableCell>
                        <TableCell>Collected pool</TableCell>
                        <TableCell>Total pool</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.id} style={{cursor: 'pointer'}}
                                  onClick={() => handleProjectClick(project)}>
                            <TableCell>{project.id}</TableCell>
                            <TableCell>{project.title}</TableCell>
                            <TableCell>{project.description}</TableCell>
                            <TableCell>{project.investedSum}</TableCell>
                            <TableCell>{project.collectedSum}</TableCell>
                            <TableCell>{project.poolSum}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>}
    </>);
};

export default MainPage;