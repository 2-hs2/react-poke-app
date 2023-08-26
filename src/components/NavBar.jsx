import React, { useEffect, useState } from "react";

import styled from "styled-components";

const NavBar = () => {
  // navbar 색상 변경 state
  const [show, setShow] = useState(false);

  // 스크롤 Y 영역이 50이 넘는 경우 show state true 아닌 경우 false로 set 하는 함수
  const listener = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  // scroll 이벤트 추가 및 삭제
  useEffect(() => {
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return (
    <NavWrapper show={show}>
      <Logo>
        <Image
          alt="Poke Logo"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          onClick={() => {
            window.location.href = "/";
          }}
        />
      </Logo>
    </NavWrapper>
  );
};

const Image = styled.img`
  width: 100%;
  cursor: pointer;
`;

const Logo = styled.a`
  position: fixed;
  padding: 0;
  width: 50px;
  margin-top: 4px;
`;

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  diplay: flex;
  background-color: ${(props) => (props.show ? "#090b13" : "transparent")};
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
`;

export default NavBar;