import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="boxes">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="box">
                    {[...Array(4)].map((_, innerIndex) => (
                        <div key={innerIndex}></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Loader;
