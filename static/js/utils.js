window.Utils = {};
window.Utils.getCookie = function getCookie(name) {
  var arg = name + "=",
    alen = arg.length,
    clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
  }
  return null;
}

window.Utils.getCookieVal = function getCookieVal(offset) {
  var endstr = document.cookie.indexOf(";", offset);
  if (endstr == -1) endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

window.Utils.setCookie = function setCookie(name, value) {
  var argv = arguments;
  var argc = argv.length;
  var date = new Date();
  date.setTime(date.getTime() + 31536000);
  var expires = (2 < argc) ? argv[2] : date;
  var path = "/";
  var domain = null;
  var secure = false;
  document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
}

//获取页面参数部分
window.Utils.getPageParameter = function getPageParameter() {
  var urlArr = location.href.split(/\?|\#/),
    url0 = urlArr[0],
    url1 = urlArr[1],
    url2 = urlArr[2];
  //
  if (url2) {
    url1 = url1 + '#' + url2
  }
  return url1;
}

/**
 *获取URL中的参数值
 *1、支持获取?和#后面的参数
 *2、自动utf-8和escape编码的解码
 *3、GBK编码将不做处理，原样吐出
 *@param a String ->key 参数名
 *@return String 参数值
 */
window.Utils.getParameter = function getParameter(a) {
  //var b,c,d,e="",f,g,h=/[^\u4E00-\u9FA5\w\s]/g,i,j;
  var b, c, d, e = "",
    f, g, h = /[\u4E00-\u9FA5]/g,
    i, j;
  b = window.location.href.replace(/&amp;/g, "&");
  d = (c = b.indexOf("?")) > -1 ? c : b.indexOf("#");
  if (a != null && d > -1) {
    b = b.substring(d + 1);
    b = b.replace(/#/g, "&");
    c = b.split("&");
    for (d = 0; d < c.length; d++) {
      var f, g;
      f = c[d].split("=")[0];
      g = c[d].substring(c[d].indexOf("=") + 1);
      try {
        i = j = "";
        i = decodeURIComponent(f);
        j = decodeURIComponent(g);
        f = !h.test(i) ? f : i;
        g = !h.test(j) ? g : j;
      } catch (ex) {}

      //两遍
      f = f.indexOf("%25") > -1 ? unescape(f) : f;
      g = g.indexOf("%25") > -1 ? unescape(g) : g;
      //一遍
      f = unescape(f);
      g = unescape(g);
      //返回
      if (f == a) {
        e = g
      }
    }
  }
  return e
}
