import React from "react";
import { useState, useEffect } from "react";
import "./Login.css";

export default (props) => {    
    
    return (

    <main className="loginBox">
        <h1
            className="loginHeader"
        >
            Login
        </h1>

        <form 
            onSubmit={props.login}            
            method="post"
            className="loginForm"
        >
            <input 
                className="inputField"
                type="text" 
                name="brukernavn" 
                placeholder="Username" 
            />
            
            <input
                className="inputField"
                type="password" 
                name="passord" 
                placeholder="Password" 
            />
            
            <button 
                className="loginButton"
                type="submit"
            >
                Login
            </button>
        </form>
        
    </main>

    )
}