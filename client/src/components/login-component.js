import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
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

  // 即時抓取input value
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  // 登入
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

  // 註冊
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

  // google登入、註冊
  const GOOGLE_CLIENT_ID =
    "1023583206236-q7i25f2b5j2fdu2eadgrfme1fce0g9se.apps.googleusercontent.com";
  const responseGoogle = (response) => {
    let { googleId } = response;
    let email = response.it.Tt;

    AuthService.googleLogin(email, googleId)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        setCurrentUser(AuthService.getCurrentUser());
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        window.alert("登入失敗(google)！ 問題正在努力修復中。");
      });
  };

  // Facebook登入、註冊
  const FACEBOOK_CLIENT_ID = "554951315605149";
  const responseFacebook = (response) => {
    let { email, userID } = response;
    AuthService.facebookLogin(email, userID)
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        setCurrentUser(AuthService.getCurrentUser());
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        window.alert("登入失敗(facebook)！ 問題正在努力修復中。");
      });
  };

  return (
    <div className="LoginComponent">
      {!currentUser && (
        <div className="login-con">
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
              {/* <button className="google-btn">
                <img src={require("./images/googleLogin.svg").default} />
                <div>Google 註冊 / 登入</div>
                <div></div>
              </button> */}
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Google 註冊 / 登入"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <img src={require("./images/googleLogin.svg").default} />
                    <div>Google 註冊 / 登入</div>
                    <div></div>
                  </button>
                )}
              />
              {/* <button className="facebook-btn">
                <img src={require("./images/facebookLogin.svg").default} />
                <div>Facebook 註冊 / 登入</div>
                <div></div>
              </button> */}
              <FacebookLogin
                appId={FACEBOOK_CLIENT_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="facebook-btn"
              />
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
