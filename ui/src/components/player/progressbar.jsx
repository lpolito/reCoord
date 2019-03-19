import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

export const ProgressBar = ({length}) => {

    return (
        <div>{length}</div>
    );
};

ProgressBar.propTypes = {
    length: PropTypes.number.isRequired,
};
