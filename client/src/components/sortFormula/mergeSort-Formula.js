const mergeByHot = (arr1, arr2) => {
  let result = [];
  let i = 0;
  let j = 0;

  while (arr1.length > i && arr2.length > j) {
    if (arr1[i].likes.length < arr2[j].likes.length) {
      result.push(arr2[j]);
      j++;
    } else if (arr1[i].likes.length > arr2[j].likes.length) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr1[i]);
      i++;
    }
  }

  while (arr1.length > i) {
    result.push(arr1[i]);
    i++;
  }
  while (arr2.length > j) {
    result.push(arr2[j]);
    j++;
  }

  return result;
};

const mergeByTime = (arr1, arr2) => {
  let result = [];
  let i = 0;
  let j = 0;

  while (arr1.length > i && arr2.length > j) {
    if (new Date(arr1[i].date) < new Date(arr2[j].date)) {
      result.push(arr2[j]);
      j++;
    } else if (new Date(arr1[i].date) > new Date(arr2[j].date)) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr1[i]);
      i++;
    }
  }

  while (arr1.length > i) {
    result.push(arr1[i]);
    i++;
  }
  while (arr2.length > j) {
    result.push(arr2[j]);
    j++;
  }

  return result;
};

const hotMergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  let length = arr.length;
  let middle = Math.floor(length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle, length);

  return mergeByHot(hotMergeSort(left), hotMergeSort(right));
};

const timeMergeSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  let length = arr.length;
  let middle = Math.floor(length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle, length);

  return mergeByTime(timeMergeSort(left), timeMergeSort(right));
};

export default { timeMergeSort, hotMergeSort };

// const mergeTime = (arr1, arr2) => {
//   let result = [];
//   let i = 0;
//   let j = 0;

//   while (arr1.length > i && arr2.length > j) {
//     if (arr1[i] > arr2[j]) {
//       result.push(arr2[j]);
//       j++;
//     } else if (arr1[i] < arr2[j]) {
//       result.push(arr1[i]);
//       i++;
//     } else {
//       result.push(arr1[i]);
//       i++;
//     }
//   }

//   while (arr1.length > i) {
//     result.push(arr1[i]);
//     i++;
//   }
//   while (arr2.length > j) {
//     result.push(arr2[j]);
//     j++;
//   }

//   return result;
// };

// let testArr = [
//   {
//     _id: "61611644320ffa9c5e620c88",
//     board: "11111",
//     title: "健身 1 + 1",
//     content:
//       "測試用ㄉ文章\n測試用ㄉ文章測試用ㄉ文章\n測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章\n\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章\n\n\n測試用ㄉ文章測試用ㄉ文章\n\n測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章",
//     author: {
//       _id: "6155d76a14d2139ebe0c921b",
//       email: "ian@fake.com",
//     },
//     likes: ["a", "v", "c"],
//     image: [],
//     date: "2",
//     comment: [],
//     __v: 0,
//   },
//   {
//     _id: "61611644320ffa9c5e620c88",
//     board: "2222",
//     title: "健身 1 + 1",
//     content:
//       "測試用ㄉ文章\n測試用ㄉ文章測試用ㄉ文章\n測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章\n\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章\n\n\n測試用ㄉ文章測試用ㄉ文章\n\n測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章",
//     author: {
//       _id: "6155d76a14d2139ebe0c921b",
//       email: "ian@fake.com",
//     },
//     likes: ["a", "v", "c", "g", "f"],
//     image: [],
//     date: "10",
//     comment: [],
//     __v: 0,
//   },
//   {
//     _id: "61611644320ffa9c5e620c88",
//     board: "3333",
//     title: "健身434",
//     content:
//       "測試用ㄉ文章\n測試用ㄉ文章測試用ㄉ文章\n測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章\n\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章\n\n\n測試用ㄉ文章測試用ㄉ文章\n\n測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章\n\n測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章測試用ㄉ文章",
//     author: {
//       _id: "6155d76a14d2139ebe0c921b",
//       email: "ian@fake.com",
//     },
//     likes: ["a", "v", "c", "g", "f", "v", "c", "g", "f"],
//     image: [],
//     date: "1",
//     comment: [],
//     __v: 0,
//   },
// ];

// console.log(hotMergeSort(testArr));

// ===== 目前timeSort有問題 (日期會變成string compare)
