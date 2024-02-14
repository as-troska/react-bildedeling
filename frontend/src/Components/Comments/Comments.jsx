import React from 'react';
import { useState, useEffect } from 'react';





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

        <section>
            <textarea 
                onKeyUp={handleComment}
            >
                
            </textarea>

            {Array.isArray(comments) && comments.length > 0 && 
                comments.map((item, id) => {
                    console.log(item)
                    return (
                        id % 2 === 0 ?
                        <p key={id} className='evenComment'>
                            {item.brukernavn}: {item.comment}
                            {item.brukernavn === props.currentUser && <button onClick={handleDelete} data-comment-id={item.id}>🗑️</button>}
                        </p> :
                        <p key={id} className='oddComment'>
                            {item.brukernavn}: {item.comment}
                            {item.brukernavn === props.currentUser && <button onClick={handleDelete}>🗑️</button>}
                        </p>
                        
                    )
                })
            }

        </section>
    )
}