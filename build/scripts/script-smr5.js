$(document).ready(function(){

    // smr5 banner slides counter
    var $status = $('.slick_counter');
    var $slickElement = $('.smr5-slider-for');
    $slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
    //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
    var i = (currentSlide ? currentSlide : 0) + 1;
    $status.html("<span>" + '0' + i + ' / ' + "</span>"  + '0' + slick.slideCount);
  });

  // smr5 banner slider 
  $slickElement.slick({
      dots: true,
      slidesToShow: 1,
      centerMode: true,
      slidesToScroll: 1,
      infinite: true,
      touchThreshold: 20,
      variableWidth: false,
      rows: 0,
      speed: 300,
      autoplay: true,
      autoplaySpeed: 3000,
      asNavFor: '.smr5-slider-nav'
  });
  
  // smr5 banner slider 
  $('.smr5-slider-nav').slick({
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: $slickElement,
    arrows:false,
    rows: 0,
    swipeToSlide: false,
    focusOnSelect: true,
    variableWidth: false
  });

  // loc 
  $(".sc-job-area .loc").click(function(){
    $(this).toggleClass('active').siblings().removeClass('active')
  })


})


