import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import Registration from "../auth/Registration";
import Login from "../auth/Login";
import MainPage from "../panel/MainPage";
import ProfileLayout from "../panel/ProfileLayout";
import Project from "../panel/Project";
import Profile from "../panel/Profile";

function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/panel" element={<ProfileLayout/>}>
                        <Route path="projects" element={<MainPage/>}/>
                        <Route path="project" element={<Project/>}/>
                        <Route path="profile" element={<Profile/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Router;
