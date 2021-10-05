import React, { useEffect } from "react";

const BoardSelectorComponent = (props) => {
  let { boards, setBoardOpen, currentBoard, setCurrentBoard } = props;

  const handleChangeBoard = (e) => {
    e.stopPropagation();
    setCurrentBoard(e.target.innerText);
    setBoardOpen(false);
  };

  return (
    <div className="boardSelector">
      <div className="boardSelector-con">
        <div className="boardSelector-con-title">選擇發文看版</div>
        <div className="boards">
          {boards.map((board) => (
            <div onClick={handleChangeBoard} className="board">
              {board}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardSelectorComponent;
