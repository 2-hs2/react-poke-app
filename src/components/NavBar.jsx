import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import app from "../../firebase";

const NavBar = () => {
  // signInWithPopup에 필요한 인자들
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // navbar 색상 변경 state
  const [show, setShow] = useState(false);

  // 현재 경로 받아옴
  const { pathname } = useLocation();

  // 로그인 팝업 생성
  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

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
      {pathname === "/login" && (
        <Login onClick={() => handleAuth()}>로그인</Login>
      )}
    </NavWrapper>
  );
};

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.55px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Image = styled.img`
  width: 100%;
  cursor: pointer;
`;

const Logo = styled.a`
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
  display: flex;
  background-color: ${(props) => (props.show ? "#090b13" : "transparent")};
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
`;

export default NavBar;
