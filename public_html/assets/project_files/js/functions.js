// функция получения cookie по имени
export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// функция установки cookie
export function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

// загружаем дополнительные скрипты
export function loadScript(path, callback) {
    console.log(callback);
    let done = false,
        scr = document.createElement('script');

    scr.onload = handleLoad;
    scr.onreadystatechange = handleReadyStateChange;
    scr.onerror = handleError;
    scr.src = path;
    document.body.appendChild(scr);

    function handleLoad() {
        if (!done) {
            done = true;
            callback(path, "ok");
        }
    }

    function handleReadyStateChange() {
        let state;

        if (!done) {
            state = scr.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    }

    function handleError() {
        if (!done) {
            done = true;
            callback(path, "error");
        }
    }
}

// прокручиваем страницу до указанного блока
export function scrollIntoView(anchor) {
    let blockID = anchor.getAttribute('href').substr(1);
    if (document.getElementById(blockID)) {
        document.getElementById(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// определение видимости элемента
export function visible(target) {
    let targetPosition = {
            top: window.pageYOffset + target.getBoundingClientRect().top,
            bottom: window.pageYOffset + target.getBoundingClientRect().bottom
        },
        windowPosition = {
            top: window.pageYOffset,
            bottom: window.pageYOffset + document.documentElement.clientHeight
        };
    if (targetPosition.bottom > windowPosition.top && targetPosition.top < windowPosition.bottom) {
        return true;
    } else {
        return false;
    }
}

// ленивая загрузка
export function lazyLoad(lazyLoadAttr) {
    lazyLoadAttr = lazyLoadAttr || 'data-src';
    let media = document.querySelectorAll('[' + lazyLoadAttr + ']');
    media.forEach(function (elem) {
        if (visible(elem)) {
            if (elem.tagName == 'IMG' || elem.tagName == 'IFRAME') {
                elem.src = elem.dataset.src;
            } else {
                elem.style.backgroundImage = 'url(' + elem.dataset.src + ')';
            }
            elem.removeAttribute('data-src');
        }
    });
}

// Маска ввода номера телефона
export function phoneMask(event) {
    if (!(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Tab')) {
        event.preventDefault()
    }
    let mask = '+7(111)111-11-11'; // Задаем маску

    if (/[0-9\+\ \-\(\)]/.test(event.key)) {

        let currentString = this.value;
        let currentLength = currentString.length;

        if (/[0-9]/.test(event.key)) {
            for (let i = currentLength; i < mask.length; i++) {
                let number = event.key;
                if (mask[i] == '1') {
                    if (i == 3 && number != '9') {
                        number = '';
                    }
                    this.value = currentString + number;
                    break;
                }
                currentString += mask[i];
            }
        }
    }
}

// инициализируем слайдер
export function initSliders(sliders, params) {
    if(typeof Swiper !== 'undefined'){
        sliders.forEach(function (elem, i) {
            new Swiper(elem, params[i]);
        });
    }
}

// инициализируем галереи
export function initGalleries(galleries, params) {
    if(typeof lightGallery !== 'undefined'){
        galleries.forEach(function (elem, i) {
            lightGallery(elem, params[i]);
        });
    }
}