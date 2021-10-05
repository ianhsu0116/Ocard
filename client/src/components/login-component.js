import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthService from "../services/auth.service";

const LoginComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const history = useHistory();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  // 確認當前是否登入
  useEffect(() => {
    if (currentUser) {
      window.alert("已經登入了歐歐歐歐！！！！");
      history.push("/");
    }
  }, []);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = () => {
    AuthService.login(email, password)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        setCurrentUser(AuthService.getCurrentUser());
        setMessage("");
        window.alert("登入成功！ 現在導向討論區。");
        history.push("/");
      })
      .catch((error) => {
        console.log(error.response.data);
        setMessage(error.response.data);
      });
  };
  const handleRegister = () => {
    AuthService.register(email, password)
      .then(() => {
        window.alert("註冊成功！ 現在可以登入囉。");
        setMessage("");
        history.push("/login");
      })
      .catch((error) => {
        setMessage(error.response.data);
        console.log(error.response.data);
      });
  };

  return (
    <div className="LoginComponent">
      {!currentUser && (
        <div className="d-flex">
          <div className="login-left">
            <div className="img-con">
              <img src={require("./images/lazy.svg").default} />
            </div>
            <h1>年輕人都在 Dcard 上討論</h1>
            <p>
              不想錯過任何有趣的話題嗎？ <br />
              趕快加入我們吧！
            </p>
            <Link to="/">先看討論區</Link>
          </div>
          <div className="login-right">
            <div className="passport-button">
              <button className="google-btn">
                <img src={require("./images/googleLogin.svg").default} />
                <div>Google 註冊 / 登入</div>
                <div></div>
              </button>
              <button className="facebook-btn">
                <img src={require("./images/facebookLogin.svg").default} />
                <div>Facebook 註冊 / 登入</div>
                <div></div>
              </button>
            </div>
            <div className="mid-line">
              <div className="line"></div>
              <div className="or">或</div>
              <div className="line"></div>
            </div>
            <div className="form-con">
              <div>
                <label htmlFor="email">常用信箱</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="輸入信箱 / aaa@test.com"
                  onChange={handleChangeEmail}
                ></input>
              </div>
              <div>
                <label htmlFor="password">密碼</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="輸入密碼"
                  onChange={handleChangePassword}
                ></input>
              </div>
              {message && <div style={{ color: "red" }}>{message}</div>}
              <div className="button-con">
                <button onClick={handleLogin} className="login-submit-btn">
                  登入
                </button>
                <button
                  onClick={handleRegister}
                  className="register-submit-btn"
                >
                  註冊
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;