import React from "react";



export default (props) => {  


    return (
        <main>            
            <h1>Login</h1>
            <form method="post" onSubmit={props.login}>
                <input type="text" placeholder="username" name="brukernavn" />
                <input type="password" placeholder="password" name="passord" />

                <button type="submit">Login</button>
            </form>            
        </main>
    )
}