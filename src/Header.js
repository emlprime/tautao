import React from "react";
import styled from "styled-components";

function Header() {
  return (
    <Style position="static">
      <h1>Tau Tao</h1>
      <nav>
        <ul>
          <li>Tau Tao</li>
        </ul>
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
