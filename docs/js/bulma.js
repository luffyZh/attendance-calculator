window.onload = function() {
  const defaultObj = {
    startDate: '', // 学期开始日期
    endDate: '', // 学期结束日期
    holidayStartDate: '', // 假期开始日期
    holidayEndDate: '', // 假期结束日期
    dayLessons: [], // 周一至周五每天课节数
    hasAbsentDays: [0, 0, 0, 0, 0], // 周一至周五已缺席天数
    hasAbsentLessons: 0, // 已缺席课节数4
    absentOneLesson: 0,
    totalLessons: 0 // 总共课节数
  }
  // 判断显示与隐藏的元素
  let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
  let calendarObj = JSON.parse(luffy_calendar_obj); 
	if (!luffy_calendar_obj) {
		$('.date-span').css('display', "none");
    $('.button-container').css('display', 'none');
    $('.table-container').css('display', 'block'); 
    document.getElementById('start_date').value = moment('2018-10-15').format('YYYY-MM-DD');
    document.getElementById('end_date').value = moment('2019-03-09').format('YYYY-MM-DD');
    document.getElementById('holiday_start_date').value = moment('2018-12-22').format('YYYY-MM-DD');
    document.getElementById('holiday_end_date').value = moment('2019-01-14').format('YYYY-MM-DD');
  } else {
    $('.date-span').css('display', "flex");
    $('.date-style').css('display', 'none');
    $('.button-container').css('display', 'flex');
    $('.table-container').css('display', 'none');
    $('#start_date_span').text(calendarObj.startDate);
    $('#end_date_span').text(calendarObj.endDate);
    $('#holiday_start_date_span').text(calendarObj.holidayStartDate);
    $('#holiday_end_date_span').text(calendarObj.holidayEndDate);
    let resRate = (calendarObj.totalLessons - calendarObj.hasAbsentLessons) / calendarObj.totalLessons;
    resRate = resRate * 100;
    $('#res_rate').text(resRate.toFixed(2) + '%');
    $('#absent_lessons').text(calendarObj.hasAbsentLessons);
    const inputValArr = [];
    inputValArr.push(calendarObj.absentOneLesson);
    inputValArr.push(...calendarObj.hasAbsentDays);
    $('.has-absent').forEach(function(item, index) {
      $(item).text(inputValArr[index]);
    });
  }

  $('#confirm_config').on('click', function() {
    const startDate = $('#start_date').val();
    const endDate = $('#end_date').val();
    const holidayStartDate = $('#holiday_start_date').val();
    const holidayEndDate = $('#holiday_end_date').val();
    const dayLessons = [0];
    $('.table-container input').forEach(function(item, index) {
      dayLessons.push(Number($(item).val()));
    });
    dayLessons.push(0);
    let totalLessons = 0;
    const totalDateArr = generateDateArray(startDate, endDate);
    const holidayDateArr = generateDateArray(holidayStartDate, holidayEndDate);
    totalDateArr.forEach(function(item) {
      if (!(holidayDateArr.indexOf(item) > -1)) {
        console.log(moment(item));
        totalLessons += dayLessons[Number(moment(item).day())];
      }
    });
    defaultObj.startDate = startDate;
    defaultObj.endDate = endDate;
    defaultObj.dayLessons = [...dayLessons];
    defaultObj.holidayEndDate = holidayEndDate;
    defaultObj.holidayStartDate = holidayStartDate;
    defaultObj.totalLessons = totalLessons;
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(defaultObj));
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj); 
    if (!luffy_calendar_obj) {
      $('.date-span').css('display', "none");
      $('.button-container').css('display', 'none');
      $('.table-container').css('display', 'block');
    } else {
      $('.date-span').css('display', "flex");
      $('.date-style').css('display', 'none');
      $('.button-container').css('display', 'flex');
      $('.table-container').css('display', 'none');
      $('#start_date_span').text(calendarObj.startDate);
      $('#end_date_span').text(calendarObj.endDate);
      $('#holiday_start_date_span').text(calendarObj.holidayStartDate);
      $('#holiday_end_date_span').text(calendarObj.holidayEndDate);
    }
    $('.button-container').css('display', 'flex');
  });

  // 重置配置
  $('#reset_config').on('click', function() {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj); 
    $('.button-container').css('display', 'none');
    $('.date-span').css('display', "none");
    $('.date-style').css('display', 'block');
    $('.table-container').css('display', 'block');
    $('#start_date_span').text(calendarObj.startDate);
    $('#end_date_span').text(calendarObj.endDate);
    $('#holiday_start_date_span').text(calendarObj.holidayStartDate);
    $('#holiday_end_date_span').text(calendarObj.holidayEndDate);
    $('#res_rate').text('100%');
    $('#absent_lessons').text('0');
    $('.has-absent').forEach(function(item, index) {
      $(item).text('0');
    });
    window.localStorage.removeItem('luffy_calendar_obj');
    document.getElementById('start_date').value = moment('2018-10-15').format('YYYY-MM-DD');
    document.getElementById('end_date').value = moment('2019-03-09').format('YYYY-MM-DD');
    document.getElementById('holiday_start_date').value = moment('2018-12-22').format('YYYY-MM-DD');
    document.getElementById('holiday_end_date').value = moment('2019-01-14').format('YYYY-MM-DD');
  });

  // 点击＋ -
  $('.add-one').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    calendarObj.absentOneLesson += 1;
    calendarObj.hasAbsentLessons += 1;
    $('#one').text(calendarObj.absentOneLesson);
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  $('.minus-one').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    if (calendarObj.absentOneLesson >= 1) {
      calendarObj.absentOneLesson -= 1;
      calendarObj.hasAbsentLessons -= 1;
      $('#one').text(calendarObj.absentOneLesson);
    } else {
      calendarObj.absentOneLesson = 0;
      $('#one').text(calendarObj.absentOneLesson);
    }
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  // 周一
  $('.add-mon').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    calendarObj.hasAbsentDays[0] += 1;
    calendarObj.hasAbsentLessons += calendarObj.dayLessons[1] * calendarObj.hasAbsentDays[0];
    $('#mon').text(calendarObj.hasAbsentDays[0]);
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  $('.minus-mon').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    if (calendarObj.hasAbsentDays[0] >= 1) {
      calendarObj.hasAbsentDays[0] -= 1;
      $('#mon').text(calendarObj.hasAbsentDays[0]);
    } else {
      calendarObj.hasAbsentDays[0] = 0;
      $('#mon').text(calendarObj.hasAbsentDays[0]);
    }
    calendarObj.hasAbsentLessons -= calendarObj.dayLessons[1] * calendarObj.hasAbsentDays[0];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  //周二
  $('.add-thu').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    calendarObj.hasAbsentDays[1] += 1;
    calendarObj.hasAbsentLessons += calendarObj.dayLessons[2] * calendarObj.hasAbsentDays[1];
    $('#thu').text(calendarObj.hasAbsentDays[1]);
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  $('.minus-thu').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    if (calendarObj.hasAbsentDays[1] >= 1) {
      calendarObj.hasAbsentDays[1] -= 1;
      $('#thu').text(calendarObj.hasAbsentDays[1]);
    } else {
      calendarObj.hasAbsentDays[1] = 0;
      $('#thu').text(calendarObj.hasAbsentDays[0]);
    }
    calendarObj.hasAbsentLessons -= calendarObj.dayLessons[2] * calendarObj.hasAbsentDays[1];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  // 周三
  $('.add-wed').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    calendarObj.hasAbsentDays[2] += 1;
    $('#wed').text(calendarObj.hasAbsentDays[2]);
    calendarObj.hasAbsentLessons += calendarObj.dayLessons[3] * calendarObj.hasAbsentDays[2];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  $('.minus-wed').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    if (calendarObj.hasAbsentDays[2] >= 1) {
      calendarObj.hasAbsentDays[2] -= 1;
      $('#wed').text(calendarObj.hasAbsentDays[2]);
    } else {
      calendarObj.hasAbsentDays[2] = 0;
      $('#wed').text(calendarObj.hasAbsentDays[2]);
    }
    calendarObj.hasAbsentLessons -= calendarObj.dayLessons[3] * calendarObj.hasAbsentDays[2];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  // 周四
  $('.add-thr').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    calendarObj.hasAbsentDays[3] += 1;
    $('#thr').text(calendarObj.hasAbsentDays[3]);
    calendarObj.hasAbsentLessons += calendarObj.dayLessons[4] * calendarObj.hasAbsentDays[3];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  $('.minus-thr').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    if (calendarObj.hasAbsentDays[3] >= 1) {
      calendarObj.hasAbsentDays[3] -= 1;
      $('#thr').text(calendarObj.hasAbsentDays[3]);
    } else {
      calendarObj.hasAbsentDays[3] = 0;
      $('#thr').text(calendarObj.hasAbsentDays[3]);
    }
    calendarObj.hasAbsentLessons -= calendarObj.dayLessons[4] * calendarObj.hasAbsentDays[3];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  // 周五
  $('.add-fri').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    calendarObj.hasAbsentDays[4] += 1;
    $('#fri').text(calendarObj.hasAbsentDays[4]);
    calendarObj.hasAbsentLessons += calendarObj.dayLessons[5] * calendarObj.hasAbsentDays[4];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });
  $('.minus-fri').on('click', function(e) {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    if (calendarObj.hasAbsentDays[4] >= 1) {
      calendarObj.hasAbsentDays[4] -= 1;
      $('#fri').text(calendarObj.hasAbsentDays[4]);
    } else {
      calendarObj.hasAbsentDays[4] = 0;
      $('#fri').text(calendarObj.hasAbsentDays[4]);
    }
    calendarObj.hasAbsentLessons -= calendarObj.dayLessons[5] * calendarObj.hasAbsentDays[4];
    window.localStorage.setItem('luffy_calendar_obj', JSON.stringify(calendarObj));
  });

  // 计算结果
  $('#calculate').on('click', function() {
    let luffy_calendar_obj = window.localStorage.getItem('luffy_calendar_obj');
    let calendarObj = JSON.parse(luffy_calendar_obj);
    let resRate = (calendarObj.totalLessons - calendarObj.hasAbsentLessons) / calendarObj.totalLessons;
    resRate = resRate * 100;
    $('#res_rate').text(resRate.toFixed(2) + '%');
    $('#absent_lessons').text(calendarObj.hasAbsentLessons);
  });
}