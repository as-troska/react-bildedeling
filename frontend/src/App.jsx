import React from "react";
import Login from "./components/Login/Login";
import {useState, useEffect} from "react"

export default () => {

	const [authenticated, setAuthenticated] = useState(false);

	const handleLogin = async (evt) => {
		evt.preventDefault();

		const data = new FormData(evt.target);

		const response = await fetch("http://localhost:3000/login", {
			method: "POST",
			body: data
			//credentials: "include"
		})

		if (response.status === 200) {
			setAuthenticated(true)
			console.log(response.status)
		} else {
			console.log(response.status)
		}
	}


	return (
		<>
			{authenticated ? 
				<h1>Logged in</h1> 
				: 
				<Login login={handleLogin} />
			}      		
    	</>
  	)
}
  

