import React from 'react';
import { useState, useEffect } from 'react';
import './Comments.css';





export default (props) => { 
    const [comments, setComments] = useState();

    useEffect(() => {
        getComments();
    }, []);

    const getComments = async () => {
        const result = await fetch("http://localhost:3000/kommentarer/" + props.pictureId, {
            method: "GET",
            credentials: "include"
        });        
        const data = await result.json();       

        setComments(data);
        
    }

    const handleComment = async (evt) => {
        if (evt.key === "Enter") {
            const data = new FormData();
            data.append("kommentar", evt.target.value);
            data.append("bildeid", props.pictureId);

            const result = await fetch("http://localhost:3000/kommenter/", {
                method: "POST",
                body: data,
                credentials: "include"
            });

            evt.target.value = "";

            getComments();

            evt.target.blur()
        }
    }

    const handleDelete = async (evt) => {
        const result = await fetch("http://localhost:3000/slettKommentar/" + evt.target.dataset.commentId, {
            method: "DELETE",
            credentials: "include"
        });

        getComments();
    }

    return (

        <section className="commentBox">
            <textarea 
                onKeyUp={handleComment}
                className="commentInput"
            >
                
            </textarea>

            <ul className="commentList">          
            {Array.isArray(comments) && comments.length > 0 && 
                comments.map((item, id) => {
                    console.log(item)
                    return (
                        id % 2 === 0 ?
                        <li key={id} className='evenComment'>
                            <span className="commentUser">{item.brukernavn}:</span> 
                            <span className="comment">{item.comment}</span>
                            {item.brukernavn === props.currentUser && <span onClick={handleDelete} data-comment-id={item.id} className="commentDelete">🗑️</span>}
                        </li> :
                        <li key={id} className='oddComment'>
                            <span className="commentUser">{item.brukernavn}:</span> 
                            <span className="comment">{item.comment}</span>
                            {item.brukernavn === props.currentUser && <span onClick={handleDelete} data-comment-id={item.id} className="commentDelete">🗑️</span>}
                        </li>
                        
                    )
                })
                
            }
            </ul>

        </section>
    )
}