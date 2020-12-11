$(document).ready(function(){
    $(".owl_content").owlCarousel({
      rewindNav: false,
      addClassActive: true, //important
      mouseDrag: false,
      afterAction: function add_mid_class(el){
        $('.owl-item')                     
          .removeClass('middle')
          .removeClass('middle_beside')
          .removeClass('next_to_mid')
          .removeClass('prev_to_mid');
        var middle_item = Math.floor($('.active').length / 2);
        middle_item --;
        $('.active').eq(middle_item - 1).addClass('middle_beside');
        $('.active').eq(middle_item).addClass('middle');
        $('.active').eq(middle_item + 1).addClass('middle_beside');
        $('.active').eq(middle_item + 1).nextAll().addClass('next_to_mid');
        $('.active').eq(middle_item - 1).prevAll().addClass('prev_to_mid');
      }
    });
  
    var owl = $(".owl_content").data('owlCarousel');
    $('.owl_wrapper .next').click(function(){owl.next();});
    $('.owl_wrapper .prev').click(function(){owl.prev();});
  });

  var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}