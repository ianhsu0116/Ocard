import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import EditService from "../services/edit.service";
import AuthService from "../services/auth.service";
import GenderIcons from "./icons/GenderIcons";

const ProfileComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [currentGender, setCurrentGender] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!currentUser) {
      window.alert("請先登入歐歐歐！！！！");
      history.push("/login");
    }
  }, []);

  // 即時抓到修改的gender
  const handleChangeGender = (e) => {
    setCurrentGender(e.target.value);
  };

  // 取消修改
  const handleCancel = () => {
    setCurrentGender("");
    history.push("/");
  };

  const handleSubmit = () => {
    if (currentGender) {
      EditService.userEdit(currentUser.user._id, currentGender)
        .then((msg) => {
          //console.log(msg);
          window.alert("個人資料修改成功！");

          // 重新fatch一次userData
          AuthService.getUserProfile(currentUser.user._id)
            .then((response) => {
              //console.log(response);
              if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
              }
              setCurrentUser(AuthService.getCurrentUser());
            })
            .catch((error) => {
              console.log(error.response.data);
            });

          setCurrentGender("");
        })
        .catch((err) => {
          window.alert("個人資料修改失敗，問題修復中！");
          console.log(err.response);
        });
    } else {
      window.alert("您沒有修改任何欄位歐！");
    }
  };

  return (
    <div className="ProfileModal">
      <div className="ProfileModal-con">
        <div className="ProfileModal-con-title">個人資料</div>
        <div className="ProfileData-con">
          <div className="ProfileAvator-box">
            <div className="ProfileData-avatar">
              {currentUser.user.gender === "female" && GenderIcons.GirlIcon()}
              {currentUser.user.gender === "male" && GenderIcons.BoyIcon()}
            </div>
          </div>
          <div className="ProfileData-box">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={currentUser.user.email}
              disabled
            />
          </div>
          <div className="ProfileData-box">
            <label>註冊日期:</label>
            <input
              type="text"
              name="date"
              value={
                new Date(currentUser.user.date).toLocaleDateString() +
                " - " +
                new Date(currentUser.user.date).toLocaleTimeString()
              }
              disabled
            />
          </div>
          <div className="ProfileData-box">
            <label htmlFor="gender">性別:</label>
            <select id="gender" name="gender" onChange={handleChangeGender}>
              <option
                value="male"
                selected={currentUser.user.gender === "male" && "true"}
              >
                男生
              </option>
              <option
                value="female"
                selected={currentUser.user.gender === "female" && "selected"}
              >
                女生
              </option>
            </select>
          </div>
          <div className="profile-btn-con">
            <button onClick={handleCancel} className="profile-cancel-btn">
              取消修改
            </button>
            <button onClick={handleSubmit} className="profile-submit-btn">
              確定送出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
