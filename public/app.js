var navbar = document.querySelector('nav')

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