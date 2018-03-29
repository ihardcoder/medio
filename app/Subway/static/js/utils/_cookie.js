/** 
 * @constant Cookies 本地cookie数据
 * @type {Object}
 */
const Cookies = {
  // 原始字符串
  origin: '',
  // 解析后的hash对象
  hash: {}
};

/**
 * @private
 * @function 更新cookie数据
 * @param {string} origin document.cookie字符串
 */
function updateCookieHash(origin){
  Cookies.origin = origin;
  origin.split(';').forEach(item => {
    const [,key,value] = /(.+)=(.*)/.exec(item.trim());
    Cookies.hash[key] = value;
  });
}

export function getCookie(key){
  if(!key || typeof key !== 'string'){
    return undefined;
  }
  if(document.cookie !== Cookies.origin){
    updateCookieHash(document.cookie);
  };
  return Cookies.hash[key] || undefined;
};

export function setCookie(key,value,opts){
  const Expires = opts && opts.expires ? (new Date(Date.now() + opts.expires)).toUTCString() : '';
  const Path = opts && opts.path || '/' ;
  document.cookie = `${key}=${escape(value)};expires=${Expires};path=${Path}`;
  updateCookieHash(document.cookie);
};