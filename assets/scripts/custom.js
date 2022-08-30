document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.querySelector('.switcher');
    const langList = document.querySelector('.switcher-list');

    let isLangList = false;

    langBtn.onclick = () => {
        !isLangList
            ? langList.classList.add('show')
            : langList.classList.remove('show');

        isLangList = !isLangList;
    }
});
