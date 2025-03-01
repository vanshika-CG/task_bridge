import React from 'react';
import styled, { keyframes } from 'styled-components';

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="pattern" />
    </StyledWrapper>
  );
}

// Animation for the background
const moveBackground = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20%, 20%);
  }
`;

const StyledWrapper = styled.div`
  position: fixed; /* Fix the background to the viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Ensure it stays behind the content */

  .pattern {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #ffe5e5 100%); /* White to light pink gradient */
    position: absolute;
    overflow: hidden;
  }

  .pattern::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, #b8c6ff 10%, transparent 20%),
                radial-gradient(circle, transparent 10%, #b8c6ff 20%); /* Light blue pattern */
    background-size: 40px 40px; /* Adjusted size for a smoother pattern */
    animation: ${moveBackground} 10s linear infinite;
  }
`;

export default Pattern;