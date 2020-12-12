var stars = Array.from(document.getElementsByClassName('fa-star'));
var starsFinal = document.getElementById('stars');

stars.forEach(element => {
    element.addEventListener('mouseover', () => {
        var num = parseInt(element.classList.toString().split(' ')[2]);
        // console.log(typeof num);
        for (var i = 0; i < num; i++)
            stars[i].classList.add('hovered');
    });
});

stars.forEach(element => {
    element.addEventListener('mouseleave', () => {
        var num = parseInt(element.classList.toString().split(' ')[2]);
        // console.log(typeof num);
        for (var i = 0; i < num; i++)
            stars[i].classList.remove('hovered');
    });
});

stars.forEach(element => {
    element.addEventListener('click', () => {
        var num = parseInt(element.classList.toString().split(' ')[2]);
        // console.log(typeof num);
        for (var i = 0; i < num; i++)
            stars[i].classList.add('fixed');

        starsFinal.value = num;
        console.log(starsFinal.value);

        for (var i = num; i < 5; i++)
            stars[i].classList.remove('fixed');
    });
});

var navbar = document.querySelector('nav');

window.onscroll = function () {

    // pageYOffset or scrollY
    if (window.pageYOffset > 550) {
        navbar.classList.add('scrolled');
        document.getElementsByClassName('dropdown-menu')[0].classList.add('scrolled');
        document.getElementsByClassName('degree')[0].classList.add('scrolled');

        var navLinks = Array.from(document.getElementsByClassName('nav-link'));
        var dropdownItems = Array.from(document.getElementsByClassName('dropdown-item'));

        navLinks.forEach(element => {
            element.classList.add('scrolled');
        });

        dropdownItems.forEach(element => {
            element.classList.add('scrolled');
        });
    } else {
        navbar.classList.remove('scrolled');
        document.getElementsByClassName('dropdown-menu')[0].classList.remove('scrolled');
        document.getElementsByClassName('degree')[0].classList.remove('scrolled');

        var navLinks = Array.from(document.getElementsByClassName('nav-link'));
        var dropdownItems = Array.from(document.getElementsByClassName('dropdown-item'));

        navLinks.forEach(element => {
            element.classList.remove('scrolled');
        });

        dropdownItems.forEach(element => {
            element.classList.remove('scrolled');
        });
    }
}