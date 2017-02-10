//获得地址栏参数
var myScroll;
function loaded() {
    pullUpEl = document.getElementById('pullUp');  
    pullUpOffset = pullUpEl.offsetHeight;
     
    myScroll = new iScroll('wrapper', {
        useTransition: true,
        scrollbars: 'custom',
        resizeScrollbars:true,
        onRefresh: function () {
           if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
            }
        },
        onScrollMove: function () {
           if (this.y < (this.maxScrollY - 50) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 10) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';              
                pullUpAction(); // Execute custom function (ajax call?)
            }
        }
    });
     
    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}
//document.addEventListener('touchmove', function (e) {  e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
/*function killerrors() { 
return true; 
} 
window.onerror = killerrors; */
// 商品添加
  var customerid,searchStr,address;
$(function(){
  // cookie
    customerid = getparam().customerid;
   if( customerid ) {
      setCookie('customerid',customerid);
   }
   customerid= getCookie('customerid');
   searchStr = getparam().searchStr;
   address = location.href;


  // 获取 购物车 数量
  $.post('/testback/prdCart/getCustomerCartCountList','info={customerid:"'+customerid+'"}',function(data){
     if(data.code == 0){
       if(data.count != 0 ){
         $('.hea-right span i').text(data.count).show();
       }  
     }
  },'json');

  

});
function add(obj){
  if( customerid ){
    var prdid=$(obj).attr('data');
    var i = $('.hea-right span i').text();
     $.ajax({
        type : "post",
        url : "/testback/prdCart/addGoodsInCart", // 请求的地址
        data :"info={customerid:'"+customerid+"',prdid:'"+prdid+"',number:1}",
        dataType : "json",
        success : function(data){
          console.log(data)
           if(data.code == 0) {
               i++;
               $('.hea-right span i').text(i).show();  
              }
           }
    });
  } else if( customerid == null || customerid == 'undefined' || customerid == 'none') {

       location.href = 'oasis://login?url='+address+'&';  
  } 
};

function tj(obj){
  /* var sectionsid = $(obj).attr('data');
   var prdid = $(obj).attr('data');
   var i = $('.hea-right span i').text();
   console.log(getparam ());
   console.log(getparam ().searchStr);
   if ( getparam ().searchStr || getparam().id) {
     window.location.href='details.html?prdid='+prdid+'&searchStr='+ getparam().searchStr +'&txt=4'+'&id='+getparam().id+"&num=0";
   }else{
     window.location.href='details.html?id='+prdid+'&num='+ i +'&txt=0'+'&sectionsid='+sectionsid;
   }*/
   var prdid = $(obj).attr('data');
   var type = $(obj).attr('type');
   window.location.href='details.html?prdid='+prdid/*+'&type='+type*/+'&num=0';
};

//跳转 购物车

$('.hea-right span').on('click',function () {
   if( customerid ){
     window.location.href='/order/purchase.html?customerid='+customerid;

    } else if( customerid == null || customerid == 'undefined' || customerid == 'none') {
     location.href = 'oasis://login?url='+address+'&';
  } 
});

/*//z返回

  $('.hea-left i').on('click',function () {
     if (getparam().txt == 4) {
     //  location.href = 'classify.html?customerid='+customerid;
     javascript:history.go(-1);
     }else if (getparam().txt == 0 ) {
       location.href = 'classify.html?id='+getparam().id+'&txt=0';
     }
  });*/







