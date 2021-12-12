"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var baseUrl = 'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master'; // 全域資料變數

var cacheData = null;
var filterData = null;
var genderStatus = '';
var ageStatus = '';
var educationStatus = '';
var majorStatus = '';
var areaStatus = '';
var job_tenureStatus = '';
var salaryStatus = '';
var salary_scoreStatus = ''; // 監聽按鈕

var clearAll = document.getElementById('clearAll');
var group = document.getElementById('group');
var gender = document.getElementById('gender');
var age = document.getElementById('age');
var education = document.getElementById('education');
var major = document.getElementById('major');
var area = document.getElementById('area');
var job_tenure = document.getElementById('job_tenure');
var salary = document.getElementById('salary');
var salary_score = document.getElementById('salary_score');
var skillTable = document.getElementById('skillTable'); // 參數歸零

function clearParam() {
  gender.value = '';
  age.value = '';
  education.value = '';
  major.value = '';
  area.value = '';
  job_tenure.value = '';
  salary.value = '';
  salary_score.value = '';
  genderStatus = '';
  ageStatus = '';
  educationStatus = '';
  majorStatus = '';
  areaStatus = '';
  job_tenureStatus = '';
  salaryStatus = '';
  salary_scoreStatus = '';
  filterData = cacheData;
} // 初始化渲染 & 監聽按鈕綁定事件


function init() {
  // 先取得前端從業人員資料
  getData('frontend'); // 監聽按鈕：重設參數

  clearAll.addEventListener('click', function () {
    clearParam();
    renderCharts();
    renderSampleNum();
  }); // 監聽按鈕：職業類別

  group.addEventListener('change', function (e) {
    getData(e.target.value);
  }); // 監聽按鈕：性別

  genderStatus = gender.value;
  gender.addEventListener('change', function (e) {
    genderStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：年齡區間

  ageStatus = age.value;
  age.addEventListener('change', function (e) {
    ageStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：學歷

  educationStatus = education.value;
  education.addEventListener('change', function (e) {
    educationStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：科系

  majorStatus = major.value;
  major.addEventListener('change', function (e) {
    majorStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：目前公司所在地

  areaStatus = area.value;
  area.addEventListener('change', function (e) {
    areaStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：工作年資

  job_tenureStatus = job_tenure.value;
  job_tenure.addEventListener('change', function (e) {
    job_tenureStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：年薪範圍

  salaryStatus = salary.value;
  salary.addEventListener('change', function (e) {
    salaryStatus = e.target.value;
    filterCacheData();
    renderCharts();
  }); // 監聽按鈕：薪水滿意度

  salary_scoreStatus = salary_score.value;
  salary_score.addEventListener('change', function (e) {
    salary_scoreStatus = e.target.value;
    filterCacheData();
    renderCharts();
  });
} // 圖表渲染


function renderCharts() {
  if (!filterData) filterData = cacheData;
  renderGenderChart();
  renderAge();
  renderEducation();
  renderArea();
  renderMajor();
  renderJob_tenure();
  renderSalary();
  renderSalary_score();
  renderSkillTable();
  femaleArr = ['女性人數', 0, 0, 0, 0, 0, 0, 0];
  maleArr = ['男性人數', 0, 0, 0, 0, 0, 0, 0];
  avgSalaryArr = ['平均年薪', 0, 0, 0, 0, 0, 0, 0];
  renderTenureSalary();
} // 取得初始資料


function getData(groupType) {
  var endpoint = "".concat(baseUrl, "/").concat(groupType, "_data.json");
  axios.get(endpoint).then(function (res) {
    cacheData = res.data;
    console.log(cacheData); // 重設全部參數 & 重設過濾資料

    clearParam(); // 渲染樣本數

    renderSampleNum(); // 渲染搜尋欄選項

    renderSelect(); // 渲染圖表

    renderCharts();
  })["catch"](function (err) {
    return console.log(err);
  });
} // countUp.js 顯示原始樣本數


function renderSampleNum() {
  var options = {
    useEasing: true,
    // 過渡動畫效果，默認ture
    useGrouping: true,
    // 千分位效果，例：1000->1,000。默認true
    separator: ',',
    // 使用千分位時分割符號
    decimal: '.',
    // 小數位分割符號
    prefix: '',
    // 前置符號
    suffix: '' // 後置符號，可漢字

  }; // target,startVal,endVal,decimals,duration,options
  // dom節點, 初始值,  結束值, 小數位數, 過渡幾秒 , 初始參數

  var sampleNum = new CountUp('sampleNum', 0, cacheData.length, 0, 2.5, options);
  sampleNum.start();
} // countUp.js 顯示篩選後樣本數


function renderFilterSampleNum() {
  var options = {
    useEasing: true,
    // 過渡動畫效果，默認ture
    useGrouping: true,
    // 千分位效果，例：1000->1,000。默認true
    separator: ',',
    // 使用千分位時分割符號
    decimal: '.',
    // 小數位分割符號
    prefix: '',
    // 前置符號
    suffix: '' // 後置符號，可漢字

  }; // target,startVal,endVal,decimals,duration,options
  // dom節點, 初始值,  結束值, 小數位數, 過渡幾秒 , 初始參數

  var sampleNum = new CountUp('sampleNum', 0, filterData.length, 0, 1.5, options);
  sampleNum.start();
} // 渲染搜尋欄選項


function renderSelect() {
  // 年齡區間排序
  var ageOpt = new Set();
  cacheData.forEach(function (el) {
    return ageOpt.add(el.age);
  });
  ageOpt = Array.from(ageOpt).sort(function (a, b) {
    var A = a.slice(0, 2);
    var B = b.slice(0, 2);
    if (A.includes('~')) A = A.split('~')[0];
    if (B.includes('~')) B = B.split('~')[0];
    return A - B;
  });
  var ageStr = '<option value="" selected>全部</option>';
  ageOpt.forEach(function (item) {
    if (item !== '') ageStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  age.innerHTML = ageStr; // 學歷

  var educationOpt = new Set();
  cacheData.forEach(function (el) {
    return educationOpt.add(el.education);
  });
  var educationStr = '<option value="" selected>全部</option>';
  educationOpt.forEach(function (item) {
    if (item !== '') educationStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  education.innerHTML = educationStr; // 畢業科系

  var majorOpt = new Set();
  cacheData.forEach(function (el) {
    return majorOpt.add(el.major);
  });
  var majorStr = '<option value="" selected>全部</option>';
  majorOpt.forEach(function (item) {
    if (item !== '') majorStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  major.innerHTML = majorStr; // 公司所在地

  var areaOpt = new Set();
  cacheData.forEach(function (el) {
    return areaOpt.add(el.company.area);
  });
  var areaStr = '<option value="" selected>全部</option>';
  areaOpt.forEach(function (item) {
    if (item !== '') areaStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  area.innerHTML = areaStr; // 工作年資排序

  var job_tenureOpt = new Set();
  cacheData.forEach(function (el) {
    return job_tenureOpt.add(el.company.job_tenure);
  });
  job_tenureOpt = Array.from(job_tenureOpt).sort(function (a, b) {
    var A = a.slice(0, 2);
    var B = b.slice(0, 2);
    if (A.includes('~')) A = A.split('~')[0];
    if (B.includes('~')) B = B.split('~')[0];
    return A - B;
  });
  var job_tenureStr = '<option value="" selected>全部</option>';
  job_tenureOpt.forEach(function (item) {
    if (item !== '') job_tenureStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  job_tenure.innerHTML = job_tenureStr; // 年薪範圍排序

  var salaryOpt = new Set();
  cacheData.forEach(function (el) {
    return salaryOpt.add(el.company.salary);
  });
  salaryOpt = Array.from(salaryOpt).sort(function (a, b) {
    var A = a.slice(0, 3);
    var B = b.slice(0, 3);
    if (A.includes('~')) A = A.split('~')[0];
    if (B.includes('~')) B = B.split('~')[0];
    return A - B;
  });
  var salaryStr = '<option value="" selected>全部</option>';
  salaryOpt.forEach(function (item) {
    if (item !== '') salaryStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  salary.innerHTML = salaryStr; // 薪資滿意度

  var salary_scoreOpt = new Set();
  cacheData.forEach(function (el) {
    return salary_scoreOpt.add(el.company.salary_score);
  });
  salary_scoreOpt = Array.from(salary_scoreOpt).sort(function (a, b) {
    return a - b;
  });
  var salary_scoreStr = '<option value="" selected>全部</option>';
  salary_scoreOpt.forEach(function (item) {
    if (item !== '') salary_scoreStr += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  salary_score.innerHTML = salary_scoreStr;
} // 過濾資料條件設定


function filterCacheData() {
  filterData = cacheData;
  if (genderStatus) filterData = filterData.filter(function (item) {
    return item.gender === genderStatus;
  });
  if (ageStatus) filterData = filterData.filter(function (item) {
    return item.age === ageStatus;
  });
  if (educationStatus) filterData = filterData.filter(function (item) {
    return item.education === educationStatus;
  });
  if (majorStatus) filterData = filterData.filter(function (item) {
    return item.major === majorStatus;
  });
  if (areaStatus) filterData = filterData.filter(function (item) {
    return item.company.area === areaStatus;
  });
  if (job_tenureStatus) filterData = filterData.filter(function (item) {
    return item.company.job_tenure === job_tenureStatus;
  });
  if (salaryStatus) filterData = filterData.filter(function (item) {
    return item.company.salary === salaryStatus;
  });
  if (salary_scoreStatus) filterData = filterData.filter(function (item) {
    return item.company.salary_score === salary_scoreStatus;
  });
  renderFilterSampleNum();
} // 渲染性別比例圖表


function renderGenderChart() {
  var genderData = [];
  filterData.forEach(function (item) {
    if (!genderData[item.gender]) {
      genderData[item.gender] = 1;
    } else {
      genderData[item.gender] += 1;
    }
  });
  var chartData = [];
  Object.keys(genderData).forEach(function (item) {
    chartData.push([item, genderData[item]]);
  });
  var genderChart = c3.generate({
    bindto: '#genderChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "男性": '#190933',
        "女性": '#C98686'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染年齡區間圖表


function renderAge() {
  var ageData = [];
  filterData.forEach(function (item) {
    if (!ageData[item.age]) {
      ageData[item.age] = 1;
    } else {
      ageData[item.age] += 1;
    }
  });
  var chartData = [];
  Object.keys(ageData).forEach(function (item) {
    chartData.push([item, ageData[item]]);
  });
  var ageChart = c3.generate({
    bindto: '#ageChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "21~25 歲": '#8C86AA',
        "26~30 歲": '#89BD9E',
        "31~35 歲": '#F0C987',
        "36~40 歲": '#390099',
        "41~45 歲": '#7E3F8F',
        "46~50 歲": '#616163'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染學歷圖表


function renderEducation() {
  var educationData = [];
  filterData.forEach(function (item) {
    if (!educationData[item.education]) {
      educationData[item.education] = 1;
    } else {
      educationData[item.education] += 1;
    }
  });
  var chartData = [];
  Object.keys(educationData).forEach(function (item) {
    chartData.push([item, educationData[item]]);
  });
  var educationChart = c3.generate({
    bindto: '#educationChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "高中畢業": '#9BC53D',
        "大專院校畢業": '#404E4D',
        "碩士畢業": '#5DD9C1',
        "博士畢業": '#ACFCD9'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染公司所在地圖表


function renderArea() {
  var areaData = [];
  filterData.forEach(function (item) {
    if (!areaData[item.company.area]) {
      areaData[item.company.area] = 1;
    } else {
      areaData[item.company.area] += 1;
    }
  });
  var chartData = [];
  Object.keys(areaData).forEach(function (item) {
    chartData.push([item, areaData[item]]);
  });
  var areaChart = c3.generate({
    bindto: '#areaChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "台灣 - 北北基": '#FFBD00',
        "台灣 - 中彰投": '#FF5400',
        "台灣 - 桃竹苗": '#9E0059',
        "台灣 - 高屏": '#390099',
        "台灣 - 雲嘉南": '#89BD9E'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染就讀科系圖表


function renderMajor() {
  var majorData = [];
  filterData.forEach(function (item) {
    if (!majorData[item.major]) {
      majorData[item.major] = 1;
    } else {
      majorData[item.major] += 1;
    }
  });
  var chartData = [];
  Object.keys(majorData).forEach(function (item) {
    chartData.push([item, majorData[item]]);
  });
  var newData = chartData.sort(function (a, b) {
    return b[1] - a[1];
  });
  var otherNum = 0;
  newData.slice(4, newData.length).forEach(function (el) {
    return otherNum += el[1];
  });
  chartData = [].concat(_toConsumableArray(newData.slice(0, 4)), [["其他", otherNum]]);
  var majorChart = c3.generate({
    bindto: '#majorChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "資訊科系相關(資工、資管、光電、電機)": '#FFBFA0',
        "非資訊、設計、語言科系相關(歷史、會計、國貿)": '#8AC6D0',
        "設計科系相關(視覺傳達、工業設計、人機互動、數位設計)": '#554971',
        "語言科系相關(日文、英文、韓文)": '#63768D',
        "其他": '#89BD9E'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染工作年資圖表


function renderJob_tenure() {
  var job_tenureData = [];
  filterData.forEach(function (item) {
    if (!job_tenureData[item.company.job_tenure]) {
      job_tenureData[item.company.job_tenure] = 1;
    } else {
      job_tenureData[item.company.job_tenure] += 1;
    }
  });
  var chartData = [];
  Object.keys(job_tenureData).forEach(function (item) {
    chartData.push([item, job_tenureData[item]]);
  });
  var job_tenureChart = c3.generate({
    bindto: '#job_tenureChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "台灣 - 北北基": '#FFBD00',
        "台灣 - 中彰投": '#FF5400',
        "台灣 - 桃竹苗": '#9E0059',
        "台灣 - 高屏": '#390099',
        "台灣 - 雲嘉南": '#89BD9E'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染年薪區間圖表


function renderSalary() {
  var salaryData = [];
  filterData.forEach(function (item) {
    if (!salaryData[item.company.salary]) {
      salaryData[item.company.salary] = 1;
    } else {
      salaryData[item.company.salary] += 1;
    }
  }); // 年薪排序

  var salaryKeys = Object.keys(salaryData).sort(function (a, b) {
    var A = a.slice(0, 3);
    var B = b.slice(0, 3);
    if (A.includes('~')) A = A.split('~')[0];
    if (B.includes('~')) B = B.split('~')[0];
    return A - B;
  });
  var chartData = [];
  salaryKeys.forEach(function (item) {
    chartData.push([item, salaryData[item]]);
  });
  var salaryChart = c3.generate({
    bindto: '#salaryChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "台灣 - 北北基": '#FFBD00',
        "台灣 - 中彰投": '#FF5400',
        "台灣 - 桃竹苗": '#9E0059',
        "台灣 - 高屏": '#390099',
        "台灣 - 雲嘉南": '#89BD9E'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染薪水滿意度圖表


function renderSalary_score() {
  var salary_scoreData = [];
  filterData.forEach(function (item) {
    if (!salary_scoreData[item.company.salary_score]) {
      salary_scoreData[item.company.salary_score] = 1;
    } else {
      salary_scoreData[item.company.salary_score] += 1;
    }
  });
  var chartData = [];
  Object.keys(salary_scoreData).forEach(function (item) {
    chartData.push([item, salary_scoreData[item]]);
  });
  var salary_scoreChart = c3.generate({
    bindto: '#salary_scoreChart',
    data: {
      columns: chartData,
      type: 'pie',
      colors: {
        "台灣 - 北北基": '#FFBD00',
        "台灣 - 中彰投": '#FF5400',
        "台灣 - 桃竹苗": '#9E0059',
        "台灣 - 高屏": '#390099',
        "台灣 - 雲嘉南": '#89BD9E'
      },
      legend: {
        show: true //是否顯示項目

      }
    }
  });
} // 渲染技能列表


function renderSkillTable() {
  var str = "";
  filterData.forEach(function (item, index) {
    str += "\n    <tr>\n      <th scope=\"row\">".concat(parseInt(index) + 1, "</th>\n      <td>").concat(item.first_job.skill, "</td>\n      <td>").concat(item.first_job.render ? item.first_job.render : '', "</td>\n    </tr>");
  });
  skillTable.innerHTML = str;
} // 為分類資料設定全域變數


var femaleArr = ['女性人數', 0, 0, 0, 0, 0, 0, 0];
var maleArr = ['男性人數', 0, 0, 0, 0, 0, 0, 0];
var avgSalaryArr = ['平均年薪', 0, 0, 0, 0, 0, 0, 0]; // 渲染年資與年薪關係圖表

function renderTenureSalary() {
  filterData.forEach(function (item) {
    var tenure = item.company.job_tenure;
    var salary = item.company.salary;

    if (item.gender === "女性") {
      classifyTenureData('female', tenure, salary);
    } else {
      classifyTenureData('male', tenure, salary);
    }
  }); // 計算平均年薪

  for (var i = 1; i < avgSalaryArr.length; i++) {
    avgSalaryArr[i] = Math.round(avgSalaryArr[i] / (femaleArr[i] + maleArr[i]));
  }

  var relationData = [femaleArr, maleArr, avgSalaryArr];
  console.log(relationData);
  var tenureSalaryChart = c3.generate({
    bindto: '#tenureSalaryChart',
    data: {
      columns: relationData,
      type: 'bar',
      types: {
        平均年薪: 'spline'
      },
      colors: {
        "女性人數": '#F4BFDB',
        "男性人數": '#00D9C0',
        "平均年薪": '#FCF6BD'
      }
    },
    axis: {
      x: {
        type: 'category',
        categories: ['1 年以下', '1~2 年', '2~3 年', '3~5 年', '5~7 年', '7~9 年', '10 年以上']
      }
    }
  });
} // 分類年資資料


function classifyTenureData(gender, tenure, salary) {
  if (gender === 'female') {
    gender = femaleArr;
  } else {
    gender = maleArr;
  }

  switch (tenure) {
    case '1 年以下':
      gender[1] += 1;
      classifySalaryData(1, salary);
      break;

    case '1~2 年':
      gender[2] += 1;
      classifySalaryData(2, salary);
      break;

    case '2~3 年':
      gender[3] += 1;
      classifySalaryData(3, salary);
      break;

    case '3~5 年':
      gender[4] += 1;
      classifySalaryData(4, salary);
      break;

    case '5~7 年':
      gender[5] += 1;
      classifySalaryData(5, salary);
      break;

    case '7~9 年':
      gender[6] += 1;
      classifySalaryData(6, salary);
      break;

    case '10 年以上':
      gender[7] += 1;
      classifySalaryData(7, salary);
      break;
  }
} // 分類年資與年薪資料


function classifySalaryData(tenure, salary) {
  switch (salary) {
    case '36 萬以下':
      avgSalaryArr[tenure] += 36;
      break;

    case '36~50 萬':
      avgSalaryArr[tenure] += 43;
      break;

    case '51~60 萬':
      avgSalaryArr[tenure] += 55;
      break;

    case '61~70 萬':
      avgSalaryArr[tenure] += 65;
      break;

    case '71~80 萬':
      avgSalaryArr[tenure] += 75;
      break;

    case '81~90 萬':
      avgSalaryArr[tenure] += 85;
      break;

    case '91~100 萬':
      avgSalaryArr[tenure] += 95;
      break;

    case '101~110 萬':
      avgSalaryArr[tenure] += 105;
      break;

    case '111~120 萬':
      avgSalaryArr[tenure] += 115;
      break;

    case '121~130 萬':
      avgSalaryArr[tenure] += 125;
      break;

    case '131~140 萬':
      avgSalaryArr[tenure] += 135;
      break;

    case '141~150 萬':
      avgSalaryArr[tenure] += 145;
      break;

    case '151~160 萬':
      avgSalaryArr[tenure] += 155;
      break;

    case '161~170 萬':
      avgSalaryArr[tenure] += 165;
      break;

    case '171~180 萬':
      avgSalaryArr[tenure] += 175;
      break;

    case '181~190 萬':
      avgSalaryArr[tenure] += 185;
      break;

    case '191~200 萬':
      avgSalaryArr[tenure] += 195;
      break;

    case '201~300 萬':
      avgSalaryArr[tenure] += 250;
      break;

    case '301~400 萬':
      avgSalaryArr[tenure] += 350;
      break;

    case '400 萬以上':
      avgSalaryArr[tenure] += 400;
      break;

    default:
      avgSalaryArr[tenure] += 36;
  }
}
//# sourceMappingURL=all.js.map
