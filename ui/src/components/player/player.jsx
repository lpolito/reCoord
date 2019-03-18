import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';


export const Player = ({videoUrl, children}) => {
    const [progress, setProgress] = React.useState({});
    const [url, setUrl] = React.useState(videoUrl);

    return (
        <div>
            <ReactPlayer
                url={url}
                onProgress={setProgress}
                controls
                // playing
            />
            {children({progress, onChange: setUrl, url})}
        </div>
    );
};

Player.propTypes = {
    videoUrl: PropTypes.string.isRequired,
    children: PropTypes.elementType.isRequired,
};
