import React from 'react';
import { useState, useEffect } from 'react';
import './Like.css';

export default (props) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        getLikes();
    }, [liked]);

    const getLikes = async () => {        
        const result = await fetch("http://localhost:3000/likes/" + props.pictureId, {
            method: "GET",
            credentials: "include"
        });
        const data = await result.json();

        setLikes(data)
        
        const liked = await fetch("http://localhost:3000/liked/" + props.pictureId, {
            method: "GET",
            credentials: "include"
        });

        const likedData = await liked.text();

        if(likedData === "true") {
            setLiked(true);
        }
    };

    const handleLike = async (evt) => {
        if (liked) {
            setLiked(false);
            const result = await fetch("http://localhost:3000/unlike/" + props.pictureId, {
                method: "POST",
                credentials: "include"
            });
        } else {
            setLiked(true);
            const result = await fetch("http://localhost:3000/like/" + props.pictureId, {
                method: "POST",
                credentials: "include"
            });
        }      
    }; 

    return (
        <section className="likeBox">
            {liked ? <img src="http://localhost:3000/Like.png" alt="Like" onClick={handleLike} className='liked'/> :
            <img src="http://localhost:3000/Like.png" alt="Liked" onClick={handleLike} className="notLiked"/>
            }

            {
                likes.length > 0 &&
                <span className="likeNumber"> : {likes.length}</span>
            }
            <ul className="likeList">
            {
                Array.isArray(likes) && likes.map((like, id) => (
                    <li key={id} className="likeItem">{like.brukernavn} </li>
                ))
            }
            </ul>
        </section>
    )
}