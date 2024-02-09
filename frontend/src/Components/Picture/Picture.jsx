import React from "react";
import { useState, useEffect } from "react";
import "./Picture.css";

export default (props) => {
    return(
        <section className="pictureBox">
            <p
                className="pictureUsername"
            >
                🙋: {props.username}

            </p>
            <img
                src={"http://localhost:3000/" + props.src}
                alt={props.alt}
                className="picture"
            />

            <p
                className="pictureText"
            >
                {props.text}
            </p>
        </section>
    )
}
