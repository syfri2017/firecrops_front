//异步加载详情页
$(function () {
    var unscid = getQueryString("unscid");
    var params = {
        unscid : unscid,
    }
    loadDiv("jxcsplan/jxcsplan_xxcj");
});

//退出登录
function logout(){
    $('#login-out-form')[0].submit();
    // window.location.href = "../login.html";
}

//axios默认设置cookie
axios.defaults.withCredentials = true;	
new Vue({
    el: '#app',
    data: function () {
        return {
        }
    },
    created: function () {
    
    },
    methods: {
        
    },

})