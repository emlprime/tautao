import React from "react";
import styled from "styled-components";
import Breadcrumb from "./Breadcrumb";

function Header(props) {
  return (
    <Style position="static">
      <h1>Tau Tao</h1>
      <nav>
        <Breadcrumb {...props} />
      </nav>
    </Style>
  );
}

export default Header;

const Style = styled.header`
  h1 {
    font-size: 2rem;
    color: purple;
    margin-right: 1rem;
  }

  display: flex;
  align-items: flex-end;
`;
