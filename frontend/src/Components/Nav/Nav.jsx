import React from "react";
import "./Nav.css";


export default ({setMenu}) => {
    return (
        <nav className="navBox">
            <ul className="navList">
                <li className="navItem" onClick={() => setMenu("bilder")}>Bilder</li>
                <li className="navItem" onClick={() => setMenu("lastOpp")}>Last opp</li>
                <li className="navItem" onClick={() => {
                        const result = fetch("http://localhost:3000/loggut", {
                            method: "GET",
                            credentials: "include"
                        });                        
                        setMenu("loggInn")
                    }
                }>Logg ut</li>
            </ul>
        </nav>
    );
}