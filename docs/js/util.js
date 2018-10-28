// 把 2018-05-20 转换成 年月日对象的形式
function dateStr2Object(dateStr) {
  const dateArr = dateStr.split('-');
  const dateObj = {
    year: dateArr[0],
    month: dateArr[1],
    day: dateArr[2]
  }
  return dateObj;
}
// 将初始日期与结束日期之间生成数组
function generateDateArray(startDate, endDate) {
  // 首先判断结束日期大于起始日期，否则返回null
  const startObj = dateStr2Object(startDate);
  const endObj = dateStr2Object(endDate);
  if (Number(endObj.year) < Number(startObj.year)
      || (Number(endObj.year) === Number(startObj.year)) && (Number(endObj.month) < Number(startObj.month))
      || (Number(endObj.year) === Number(startObj.year)) && (Number(endObj.month) === Number(startObj.month)) && (Number(endObj.day) < Number(startObj.day))) {
    return [];
  } else {
    
    if ((Number(endObj.year) === Number(startObj.year)) && (Number(endObj.month) === Number(startObj.month))) {
      // 年份月份相同
      return generateDateArrayByDay(startDate, endDate);
    } else if ((Number(endObj.year) === Number(startObj.year)) && (Number(endObj.month) > Number(startObj.month))) {
      // 年份相同，月份不同
      return generateDateArrayByMonth(startDate, endDate);
    } else {
      // 年份不同
      return generateDateArrayByYear(startDate, endDate);
    }
  }
}

function generateDateArrayByDay(startDate, endDate) {
  const startObj = dateStr2Object(startDate);
  const endObj = dateStr2Object(endDate);
  let resultArr = [];
  for (let i=Number(startObj.day); i <= Number(endObj.day); i++) {
    let tempStr = `${startObj.year}-${startObj.month}-`;
    tempStr += (i >= 10 ? i : `0${i}`);
    resultArr.push(tempStr);
  }
  return resultArr;
}

function generateDateArrayByMonth(startDate, endDate) {
  const startObj = dateStr2Object(startDate);
  const endObj = dateStr2Object(endDate);
  let resultArr = [];
  for (let m=Number(startObj.month); m <= Number(endObj.month); m++) {
    let firstStr = `${startObj.year}-${m >= 10 ? m : '0' + m}`;
    let leftDay = 1;
    let rightDay = moment(firstStr).daysInMonth();
    if (m === Number(startObj.month)) {
      leftDay = Number(startObj.day);
    }
    if (m === Number(endObj.month)) {
      rightDay = Number(endObj.day);
    }
    for (let d=leftDay; d <= rightDay; d ++) {
      let secondStr = '';
      secondStr = firstStr + ('-' + (d >= 10 ? d : `0${d}`));
      resultArr.push(secondStr);
    }
  }
  return resultArr;
}
// 按照年来计算，可以拆分成不同年然后按照月份计算
function generateDateArrayByYear(startDate, endDate) {
  const startObj = dateStr2Object(startDate);
  const endObj = dateStr2Object(endDate);
  let resultArr = [];
  for (let y = Number(startObj.year); y <= Number(endObj.year); y++) {
    if (y === Number(startObj.year)) {
      resultArr.push(...generateDateArrayByMonth(startDate, `${y}-12-31`));
    }
    if (y !== Number(startObj.year)&& y !== Number(endObj.year)) {
      resultArr.push(...generateDateArrayByMonth(`${y}-01-01`, `${y}-12-31`));
    }
    if (y === Number(endObj.year)) {
      resultArr.push(...generateDateArrayByMonth(`${y}-01-01`, endDate));
    }
  }
  return resultArr;
}
