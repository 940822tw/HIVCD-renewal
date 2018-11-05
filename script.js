var url = "https://spreadsheets.google.com/feeds/cells/1tqK4G41PtdN4KZobLkVGZnWzio5GItNnTxPv6w-UUfM/1/public/basic?alt=json-in-script&callback=?";
var url2 = "https://spreadsheets.google.com/feeds/cells/1tqK4G41PtdN4KZobLkVGZnWzio5GItNnTxPv6w-UUfM/2/public/basic?alt=json-in-script&callback=?";


var contentArray = [];
var categoryArray = [];
var listToggle = false;
var findHash = false;
var mainHTML="";

function Category(one) {
  this.one = one;
  this.two = [];
}

function Content(count, index, no, title, activation, hash) {
  this.count = count; //1
  this.index = index; //2
  this.no = no; //3
  this.title = title; //4
  this.activation = activation; //5
  this.hash = hash; //6
  this.html = ""

  if (this.no.length == 1) {
    categoryArray[this.no * 1 - 1] = new Category(this.index)
  }

  if (this.no.length == 3) {
    categoryArray[this.no.slice(0, 1) * 1 - 1].two[this.no.substring(2) * 1 - 1] = this.index
  }

}

$.getJSON(url2, function(data) {
  var entry = data.feed.entry;
  var status = entry[1].content.$t
  if (status == "maintenance") {
    $("#alert").append("<br>　The site is currently under maintenance.")
    $("header").remove();
    $("#container").remove();
    $("#list").remove();
  } else if (status == "close") {
    $("#alert").append("<br>　The site has been closed or removed. Please contact admin.<br>　→ hiuproto@gmail.com")
    $("header").remove();
    $("#container").remove();
    $("#list").remove();
  } else {
    $("#alert").remove();

  }
})
    display()
function display() {
  $.getJSON(url, function(data) {
    $("header").css({
      "opacity": 1
    })
    $("#container").css({
      "opacity": 1
    })

    var entry = data.feed.entry;
    var length = data.feed.openSearch$totalResults.$t;
    var html = ""
    mainHTML = entry[1].content.$t;
    for (var i = 9; i < length; i++) {
      contentArray[entry[i + 1].content.$t] = new Content(
        entry[i].content.$t, //count
        entry[i + 1].content.$t, //index
        entry[i + 2].content.$t, //no
        entry[i + 3].content.$t, //title
        entry[i + 4].content.$t, //activation
        entry[i + 5].content.$t); //hash
      if (entry[i + 4].content.$t == "○") {
        contentArray[entry[i + 1].content.$t].html = entry[i + 6].content.$t;
      }
      i += entry[i].content.$t * 1;
    }
    // console.log(contentArray);
    callback(makeList);
    callback(hashURL);

    // for(var )
  })
}

function callback(cb) {
  cb()
}

function makeList() {
  var html = ""
  html += "<ul>"
  for (var i = 0; i < categoryArray.length; i++) {
    var one = contentArray[categoryArray[i].one]
    html += "<li><a onclick='render(" + one.index + ")'>" + one.title + " </a></li>"
    for (var j = 0; j < categoryArray[i].two.length; j++) {
      var two = contentArray[categoryArray[i].two[j]]
      html += "<li>　<a onclick='render(" + two.index + ")'>" + two.title + "</a></li>"
    }
  }
  html += "</ul>"
  $("#list").append(html)
}


function list() {
  if (!listToggle) {
    $("#list").animate({
      left: 0
    }, 300);
  } else {
    $("#list").animate({
      left: "-101%"
    }, 0);
  }
  listToggle = !listToggle
}

function list2() {
  if (!listToggle) {
    $("#list").animate({
      left: 0
    }, 300);
  } else {
    $("#list").animate({
      left: "-101%"
    }, 300);
  }
  listToggle = !listToggle
}


function render(index) {
  if (contentArray[index].activation == "×") {
    return;
  }
  if (findHash == true) {
    findHash = !findHash
  } else {
    list();
  }

  window.location.hash = contentArray[index].hash;
  var html = ""
  $("#wrapper").remove();
  html += "<div id='wrapper'>";
  html += contentArray[index].html;
  html += "</div>"
  $("#container").append(html);
}


function hashURL() {
  if (window.location.hash) {
    for (var i = 0; i < contentArray.length; i++) {
      var object = contentArray[i];
      // console.log(object["hash"]);
      if (window.location.hash == "#" + object["hash"]) {
        findHash = true;
        render(i);
        return;
      }
    }
  } else {
      $("#wrapper").append(mainHTML)
    }
  }
