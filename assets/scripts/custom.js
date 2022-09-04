document.addEventListener("DOMContentLoaded", () => {
    langEvents();
    menuEvents();
    sliderEvents();
    benefitsEvents();
});

function sliderEvents() {
    const sliderElement = document.querySelector('.solution__card');
    const sliderContainer = document.querySelector('.solution__group');
    const buttons = document.querySelectorAll('.solution__slider-btn');
    const stepSlider = sliderElement.offsetWidth;
    let x;
    let sliderIndex = 0;

    buttons.forEach((btn, index) => {
        btn.onclick = () => {
            sliderIndex = index;
            sliderElement.style.marginLeft = `-${sliderIndex * stepSlider}px`;

            buttons.forEach((btn) => {
                btn.classList.remove('active');
            });

            btn.classList.add('active');
        }
    });

    sliderContainer.addEventListener('touchstart', e => {
        x = e.changedTouches[0].clientX;
    });

    sliderContainer.addEventListener('touchend', e => {
        if (e.changedTouches[0].clientX - x > 50) {
            if (sliderIndex !== 0) {
                sliderIndex--;
            }
        } else if (e.changedTouches[0].clientX - x < -50) {
            if (sliderIndex !== 1) {
                sliderIndex++;
            }
        }

        buttons.forEach((btn) => {
            btn.classList.remove('active');
        });

        buttons[sliderIndex].classList.add('active');
        sliderElement.style.marginLeft = `-${sliderIndex * stepSlider}px`;
    });
}

function menuEvents() {
    const menuBtn = document.getElementById('menu-btn');
    const menuList = document.querySelector('.nav__items');
    const menuBg = document.querySelector('.nav__bg');

    let showMenu = false;

    menuBg.onclick = () => {
        menuBtn.click();
    }

    menuBtn.onclick = () => {
        if (!showMenu) {
            menuList.classList.add('show');
            menuBtn.classList.add('active');
        } else {
            menuList.classList.remove('show');
            menuBtn.classList.remove('active');
        }

        showMenu = !showMenu;
    }
}

function langEvents() {
    const langBtn = document.querySelector('.switcher');
    const langList = document.querySelector('.switcher-list');

    let isLangList = false;

    langBtn.onclick = () => {
        !isLangList
            ? langList.classList.add('show')
            : langList.classList.remove('show');

        isLangList = !isLangList;
    }
}

function benefitsEvents() {
    const cards = document.querySelectorAll('.benefits__card:not(.no-hover)');

    cards.forEach((card) => {
        card.onclick = () => {
            if (card.classList.contains('reverse')) {
                card.classList.remove('reverse');
            } else {
                card.classList.add('reverse');
            }
        }
    });
}
