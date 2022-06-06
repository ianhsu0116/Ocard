import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AuthService from '../services/auth.service';

const LoginComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const history = useHistory();
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [message, setMessage] = useState('');

  // 確認當前是否登入
  useEffect(() => {
    if (currentUser) {
      window.alert('已經登入了歐歐歐歐！！！！');
      history.push('/');
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
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        setCurrentUser(AuthService.getCurrentUser());
        setMessage('');
        window.alert('登入成功！ 現在導向討論區。');
        history.push('/');
      })
      .catch((error) => {
        const data =
          typeof error.response.data == "object"
            ? error.response.data.message
            : error.response.data;
        setMessage(data);

        console.log(error.response);

      });
  };

  // 註冊
  const handleRegister = () => {
    AuthService.register(email, password)
      .then(() => {
        window.alert('註冊成功！ 現在可以登入囉。');
        setMessage('');
        history.push('/login');
      })
      .catch((error) => {
        const data =
          typeof error.response.data == "object"
            ? error.response.data.message
            : error.response.data;
        setMessage(data);

        console.log(error.response);
      });
  };

  // google登入、註冊
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const responseGoogle = (response) => {
    //console.log(response.accessToken);
    AuthService.googleLogin(response.accessToken)
      .then((response) => {
        //console.log(response);
        if (response.data.token) {
          // webStorage存入當前user資料
          localStorage.setItem('user', JSON.stringify(response.data));

          // 在currentUser存入當前user資料
          setCurrentUser(AuthService.getCurrentUser());

          // 導回首頁
          history.push('/');
        } else {
          window.alert(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        window.alert('登入失敗(google)！ 問題正在努力修復中。');
      });
  };

  // Facebook登入、註冊
  const FACEBOOK_CLIENT_ID = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
  const responseFacebook = (response) => {
    //console.log(response.accessToken);
    AuthService.facebookLogin(response.accessToken)
      .then((response) => {
        if (response.data.token) {
          // webStorage存入當前user資料
          localStorage.setItem('user', JSON.stringify(response.data));

          // 在currentUser存入當前user資料
          setCurrentUser(AuthService.getCurrentUser());

          // 導回首頁
          history.push('/');
        } else {
          window.alert(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        window.alert('登入失敗(facebook)！ 問題正在努力修復中。');
      });
  };

  return (
    <div className="LoginComponent">
      {!currentUser && (
        <div className="login-con">
          <div className="login-left">
            <div className="img-con">
              <img src={require('./images/lazy.svg').default} />
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
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Google 註冊 / 登入"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="google-btn"
                  >
                    <img src={require('./images/googleLogin.svg').default} />
                    <div>Google 註冊 / 登入</div>
                    <div></div>
                  </button>
                )}
              />
              <FacebookLogin
                appId={FACEBOOK_CLIENT_ID}
                fields="name,email,picture"
                callback={responseFacebook}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    className="facebook-btn"
                  >
                    <img src={require('./images/facebookLogin.svg').default} />
                    <div>Facebook 註冊 / 登入</div>
                    <div></div>
                  </button>
                )}
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
              {message && <div style={{ color: 'red' }}>{message}</div>}
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
