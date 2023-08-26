import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import app from "../../firebase";

const NavBar = () => {
  // signInWithPopup에 필요한 인자들
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // navbar 색상 변경 state
  const [show, setShow] = useState(false);

  // 로그인시 받아지는 유저 데이터
  const [userData, setUserData] = useState({});

  // 현재 경로 받아옴
  const { pathname } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    // onAuthStateChaged 는 unsubscribe 함수를 반환함
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // user가 있으면 메인 페이지로 없으면 login 페이지로
      // 로그인 상태에서는 로그인 페이지로 이동하려고 해도 다시 메인 페이지로 이동된다.
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pathname]);

  // 로그인 팝업 생성
  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => setUserData(result.user))
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

  // 로그아웃 함수 -> 로그아웃 되면 userData 비워줌
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserData({});
      })
      .catch((error) => alert(error.message));
  };

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
      {pathname === "/login" ? (
        <Login onClick={() => handleAuth()}>로그인</Login>
      ) : (
        <SignOut>
          <UserImg src={userData.photoURL} alt="user photo" />
          <Dropdown>
            <span onClick={() => handleLogout()}> Sign out </span>
          </Dropdown>
        </SignOut>
      )}
    </NavWrapper>
  );
};

const UserImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background-color: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(000/ 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
  color: #fff;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${Dropdown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

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
