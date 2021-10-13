const boardSort = (board, currentData) => {
  let sortedData = currentData.filter((data) => {
    return data.board === board;
  });

  return sortedData;
};

const searchSort = (search, currentData) => {
  var reg = new RegExp(search);
  let sortedData = [];

  currentData.forEach((data) => {
    if (reg.test(data.title)) {
      sortedData.push(data);
    }
  });

  return sortedData;
};

const searchSortWithBoard = (search, board, currentData) => {
  var reg = new RegExp(search);
  let sortedData = [];

  currentData.forEach((data) => {
    if (reg.test(data.title) && data.board === board) {
      sortedData.push(data);
    }
  });

  return sortedData;
};

export default { boardSort, searchSort, searchSortWithBoard };
