import React from "react";
import "./Upload.css";



export default ({setMenu}) => {  
    const handleUpload = async (evt) => {
        evt.preventDefault();
        const data = new FormData(evt.target);
        const result = await fetch("http://localhost:3000/lastOpp", {
            method: "POST",
            body: data,
            credentials: "include",
            encType: "multipart/form-data"
        });
        
        if(result.status === 200) {
            console.log("Bilde lastet opp")
            setMenu("bilder");
        } else {
            console.log("Noe gikk galt");
        }    
    };
    
    
    return (
        <main className="uploadBox">
            <h1>Legg til bilde</h1>
            <form method="post" encType="multipart/form-data" onSubmit={handleUpload} className="uploadForm">
                <input type="file" name="bilde" id="bilde" required />
                <input type="text" name="caption" id="caption" placeholder="Beskrivelse" />
                <input type="submit" value="Last opp" />
            </form>
        </main>
    );
}