!function($){
  
  var defaults = {
    firstLevel: "> h2",
    secondLevel: false,
    innerWrapper: ".jumpto-block",
    offset: 400,
    animate: 1000,
    navContainer: false,
    anchorTopPadding: 20,
    showTitle: "Jump To",
    closeButton: true
	};
 
	
	function isScrolledIntoView(elem)
  {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + ($(window).height() /4);
      
      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }
	
  $.fn.jumpto = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        html = "",
        block = $(settings.innerWrapper),
        selectors = "",
        title = "",
        close ="";
        
    el.addClass("jumpto-cotainer");
    
    redrawMenu = function(){
    /*  $(selectors.slice(0,-2)).each(function( index ) {
        if (isScrolledIntoView($(this))) {
          $(".jumpto-subnav a").removeClass("active").parent().find(" a[href='#"+$(this).attr("id")+"']").addClass("active")
          if($("a[href='#"+$(this).attr("id")+"']").parent().parent().hasClass("jumpto-second")) {
            $("a[href='#"+$(this).attr("id")+"']").closest(".jumpto-second").show()
          }
          if($("a[href='#"+$(this).attr("id")+"']").parent().parent().hasClass("jumpto-first")) {
            $("a[href='#"+$(this).attr("id")+"']").closest(".jumpto-first").find(".jumpto-second").hide()
          }
          if($("a[href='#"+$(this).attr("id")+"']").parent().find(".jumpto-second")) {
            $("a[href='#"+$(this).attr("id")+"']").parent().find(".jumpto-second").show()
          }
        }
      });*/
      
      if($(document).scrollTop() > settings.offset+254) {
        $(".jumpto-subnav").removeClass("bottom").addClass("fixed");
      } else {
        $(".jumpto-subnav").removeClass("bottom fixed");
      }
      if($(document).scrollTop() > el.outerHeight(true)) {
        $(".jumpto-subnav").addClass("bottom fixed");
      }
    }
 
      $.post("/testback/prdMatCourse/getCourseList",function(d){
       //  console.log("yiji",d)
         //一级菜单的渲染
          $.each(d.courseList,function(i,obj){   
           if(obj.pid==0){//pid为0的是一级菜单，二级菜单的pid等于一级菜单的id
           
             $(".jumpto-first").append("<li data-id='"+obj.id+"'><span></span><a href='#"+obj.id+"'>"+obj.name+"</a><ul class='jumpto-second'></ul></li>");
           } 
        })
       $(".jumpto-first li a").on("click",function(){
         $(this).next().show().parents("li").siblings().find("a").next().hide();
       })
       for(var j=0;j<$(".jumpto-first li").length;j++){
        var data_id = $(".jumpto-first li").eq(j).attr("data-id");
        for(var k=0;k<d.courseList.length;k++){
          if(d.courseList[k].pid == data_id){
            $(".jumpto-first li").eq(j).find("ul").append("<li><em>•</em><a href='#"+d.courseList[k].id+"'>" + d.courseList[k].name + "</a></li>")
          }
        }
    } 
        
   //渲染右边的图片
     $.post("/testback/prdMatCourse/getCourseDetailList",function(d){
        var l = $(".jumpto-first>li").length;
        for(var i=0;i<l;i++){
          var pid = $(".jumpto-first>li").eq(i).attr("data-id");
          $(".page_container").append("<div class='jumpto-block' id='"+pid+"'></div>");
        }
        for(var j=0;j<l;j++){
          var data_id = $(".jumpto-block").eq(j).attr("id");
          for(var k=0;k<d.courseDetailList.length;k++){
            if(d.courseDetailList[k].pid == data_id){
              $(".jumpto-block").eq(j).append('<p id="'+d.courseDetailList[k].id+'"><img data-prdid="'+d.courseDetailList[k].prdid+'" src="'+d.courseDetailList[k].imgurl+'" alt=""></p>')
            }
          }
        } 
    // 给盒子设置高度
    for(var i=0;i<$(".jumpto-block").length;i++){
      var len = $(".jumpto-block").eq(i).find("p").length;
      var h = $(".jumpto-block").eq(0).find("p").height();
      $(".jumpto-block").eq(i).css("height",len*h);
    }
    //滚动
    $(window).scroll(function(){
      for(var j=0;j<$(".jumpto-block").length;j++){
          var  jumptop = $(".jumpto-block").eq(j).offset().top;
          console.log($(document).scrollTop(),jumptop)
          if($("html,body").scrollTop() >= jumptop){
              $(".jumpto-first li").eq(j).find("a").addClass("active").parents("li").siblings().find("a").removeClass("active");
             $(".jumpto-first li").eq(j).find(".sanjiao").addClass("sj_active").removeClass("sanjiao").parents("li").siblings().find(".sj_active").removeClass("sj_active").addClass("sanjiao");
          }
      }
    })
    $(".jumpto-block img").on("click",function(){
      var prdid = $(this).attr("data-prdid")
      window.location.href="pfdetails000.html?prdid=" + prdid+"&num=0";
    })
   })        
  })
    if(settings.navContainer == false) {
      $(this).append("<nav class='jumpto-subnav'>"+ title +"<ul class='jumpto-first'>" + html + "</ul>"+ close +"</nav>")
    }else{
      $(settings.navContainer).addClass("jumpto-subnav").html(title +"<ul class='jumpto-first'>" + html + "</ul>"+ close)
    }
    
    
    $('.jumpto-subnav a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
          || location.hostname == this.hostname) {
    
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top - settings.anchorTopPadding-84
          }, settings.animate, 'swing');
          return false;
        }
      }
    });
    
    $(window).scroll(function() {   
      redrawMenu()
    });

    
    /*setInterval(function() {
    var track = [];
      $(selectors.slice(0,-2)).each(function( index ) {
        track.push(isScrolledIntoView($(this)))
      });
      if($.inArray(true, track) == -1) {
        $(".jumpto-subnav a").removeClass("active")
        $(".jumpto-subnav .jumpto-second").hide()
      }
    }, 500);*/
  }
}(window.jQuery);

