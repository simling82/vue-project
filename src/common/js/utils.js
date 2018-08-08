/* eslint-disable */
export default {
    /*
        * @获取url参数
        * @param {String} item
        */
    query (item) {
        var svalue = window.location.hash.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
        return svalue ? svalue[1] : svalue;
    },
    pxToRem(pxnum) {
        const dp = document.body.clientWidth / 750;
        return Math.floor(pxnum * dp);
    }
}
  