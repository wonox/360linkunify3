//操作したいHTML領域を取得
const elem = document.getElementById("listid");
const input = document.querySelector("input");
const log = document.getElementById("values");
const loading = document.getElementsByClassName("loading");

// input.addEventListener("input", doiquery);
input.addEventListener("input", (e) => {
  console.log(input.value.length);
  elem.innerHTML = "";
  log.innerHtml = "";
  // input.value.length > 9 ? doiquery(e) : (elem.innerHTML = "");
  if (input.value.length > 8) {
    //if (e.target.value.match(/^10.\d{4}.*$/i)) {
    //log.innerHtml = "";
    checkResult(e.target.value);
  } else {
    elem.innerHTML = "";
    log.innerHtml = "";
  }
});

function checkResult(point) {
  if (point.match(/[0-9]{4}\-[0-9xX]{4}/)) {
    console.log("issn");
    doiquery("issn=" + point);
  } else if (point.match(/^10.\d{4}.*$/i)) {
    doiquery("doi=" + point);
  } else {
    elem.innerHTML = "no data";
    log.textContent = "no log";
  }
}

// APIにアクセス --- (*1)
// const api = "https://api.aoikujira.com/tenki/week.php?fmt=json&city=319";
function doiquery(doitargetvalue) {
  // const doitext = doitargetvalue.target.value;
  const doitext = doitargetvalue;
  const api = "https://respected-fourth-bar.glitch.me/doi?" + doitext;
  loading[0].style.visibility = "visible";
  console.log(api);
  log.textContent = api;

  fetch(api)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      loading[0].style.visibility = "hidden";
      return tenki(data);
    })
    .catch((e) => {
      console.log(e); //エラーをキャッチし表示
    });
  // 結果を表示 --- (*2)
  function tenki(data) {
    console.log(Array.isArray(data));
    Object.entries(data).forEach(([key, value], index) => {
      console.log(Object.keys(value).length);
      // オブジェクトが空でなければ
      if (Object.keys(value).length) {
        h2texts = "<h2>" + key + "</h2>";
        elem.insertAdjacentHTML("beforeend", h2texts);
        plotres(value, "");
      }
    });

    function plotres(response, prefix) {
      for (var key in response) {
        if (typeof response[key] == "object") {
          if (Array.isArray(response[key])) {
            // 配列の場合は forEach で要素ごとにに再帰呼び出し
            response[key].forEach(function (item) {
              plotres(item, prefix + " " + key);
            });
          } else {
            // 連想配列はそのまま再帰呼び出し
            // h2texts = "<h2>" + prefix + "</h2>";
            // elem.insertAdjacentHTML("beforeend", h2texts);
            plotres(response[key], prefix + " " + key);
          }
        } else {
          // 配列や連想配列でなければキーの値を表示
          console.log(prefix + " " + key + ": " + response[key]);
          listtexts =
            '<ul class="hidden_box"><li>' +
            key +
            ": " +
            response[key] +
            "</li>";
          elem.insertAdjacentHTML("beforeend", listtexts);
        }
      }
    } // close of plotress
  }
}
