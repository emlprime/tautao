import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

function Button({ children, handleClick, type = "button", ...rest }) {
  return (
    <Style type={type} onClick={handleClick} {...rest}>
      {children}
    </Style>
  );
}

export default Button;

const Style = styled(motion.button)`
  background-color: #000;
  border-color: #333;
  color: #444;
`;
