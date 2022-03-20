import React from 'react';
import './Button.css'

function Button(props) {
    return (
        <div>
            <button className="btn" {...props}>{props.children}</button>
        </div> 
    );
}

export default Button;