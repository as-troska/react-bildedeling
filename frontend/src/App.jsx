import React from "react";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import "./App.css";
import Picture from "./Components/Picture/Picture";

export default () => {
  	const [loggedIn, setLoggedIn] = useState(false);
	const [pictures, setPictures] = useState();

	const handleLogin = async (evt) => {
		evt.preventDefault();
        
        const data = new FormData(evt.target);       

        const result = await fetch("http://localhost:3000/login", {
            method: "POST",
            body: data,
			credentials: "include"
        });

        if (result.status === 200) {
            setLoggedIn(true);
			getPictures();
        }   
	};

	const getPictures = async () => {
		const result = await fetch("http://localhost:3000/bilder", {credentials: "include"});
		try {
			const data = await result.json();
			setPictures(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}		
	};

	

    return (
  		<main>
			{loggedIn ? (
			pictures && pictures.length > 0 ? pictures.map((picture) => (
				<Picture
				key={picture.id}
				username={picture.brukernavn}
				src={picture.url}
				alt={picture.caption}
				text={picture.caption}
				/>
			)) : (
				<p>Loading</p>
			)
			) : (
			<Login login={handleLogin} />
			)}  
		  
		</main>
	);

} 
