import React from "react";
import { useState, useEffect } from "react";
import Login from "./Components/Login/Login";
import "./App.css";
import Picture from "./Components/Picture/Picture";
import Nav from "./Components/Nav/Nav";
import Upload from "./Components/Upload/Upload";

export default () => {
  	const [loggedIn, setLoggedIn] = useState(false);
	const [userData, setUserData] = useState();
	const [pictures, setPictures] = useState();
	const [menu, setMenu] = useState("bilder");


	useEffect(() => {
		const checkLoginState = async () => {
			const result = await fetch("http://localhost:3000/loggetinn", {
				credentials: "include"
			});			
	
			if (result.status === 200) {
				setUserData(await result.json());
				setLoggedIn(true)
				getPictures()
			} else {
				setLoggedIn(false)
			}
		}	
		checkLoginState()
	}, [menu])

	const handleLogin = async (evt) => {
		evt.preventDefault();
        
        const data = new FormData(evt.target);       

        const result = await fetch("http://localhost:3000/login", {
            method: "POST",
            body: data,
			credentials: "include"
        });

        if (result.status === 200) {
			setUserData(await result.json());
            setLoggedIn(true);
			setMenu("bilder");
			getPictures();
        }   
	};

	const handleDelete = async (id) => {
		const result = await fetch("http://localhost:3000/slettBilde/" + id, {
			method: "DELETE",
			credentials: "include"
		});
		getPictures();
	}

	const getPictures = async () => {
		const result = await fetch("http://localhost:3000/bilder", {
				credentials: "include",
				headers: {
					'Cache-Control': 'no-cache'
				},
			});
		try {
			const data = await result.json();
			setPictures(data);			
		} catch (error) {
			console.log(error);
		}		
	};	

    return (
  		<main className="mainBox">
			{loggedIn || menu != "loggInn" ? (
				<>
					{menu === "bilder" && Array.isArray(pictures) && 
						pictures.slice().reverse().map((picture) => (
							<Picture
								key={picture.id}
								pictureId={picture.id}
								username={picture.brukernavn}
								src={picture.url}
								alt={picture.caption}
								text={picture.caption}
								currentUser={userData.brukernavn}
								handleDelete={() => handleDelete(picture.id)}
							/>
						))}
					{menu === "lastOpp" && 
						<Upload setMenu={setMenu} />
					}
					{menu === "profil" && 
						<Profile />
					}

					<Nav setMenu={setMenu} />
				</>
			) : (
				<Login login={handleLogin} setMenu={setMenu} />
			)}
		</main>
		
	);

} 
