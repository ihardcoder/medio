export function getJsonp(options = {url: undefined, data: null,jsonpCallback: 'callback'}, callback) {
  const DOMScript = document.createElement('script');
  DOMScript.setAttribute('type', 'text/javascript');

  const CallbackName = `go2map_fe_ci_jsonp_${(new Date()).getTime() + parseInt(Math.random() * 1000)}`;
  // 生成随机回调函数名并暴露至全局作用域
  window[CallbackName] = function(response) {
    callback(response);
    document.body.removeChild(DOMScript);
    window[CallbackName] = null;
  };

  const FullUrlArr = [
    `${options.url}${/\?/.test(options.url)? '&':'?'}`
  ];
  if(options.data){
    for(let key in options.data){
      FullUrlArr.push(`${key}=${escape(options.data[key])}&`);
    }
  }
  FullUrlArr.push(`${options.jsonpCallback || 'callback'}=${CallbackName}`);

  DOMScript.setAttribute('src', FullUrlArr.join(''));

  document.body.appendChild(DOMScript);
}

export const Axios = axios.create({
  timeout: 3000,
  // 携带客户端验证信息-cookie
  withCredentials: true
});