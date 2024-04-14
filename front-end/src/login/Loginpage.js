import React from 'react';
import { Link } from 'react-router-dom';


function Login_page() {

    return (
        <div>
            <h1> Login Page </h1>

            <Link to="/homepage">Login</Link>
        </div>
    );
}

export default Login_page;