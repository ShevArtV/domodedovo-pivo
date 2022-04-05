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
export function isVisible(target) {
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
        if (isVisible(elem)) {
            if (elem.tagName == 'IMG' || elem.tagName == 'IFRAME') {
                elem.src = elem.dataset[lazyLoadAttr.replace('data-', '')];
            } else {
                elem.style.backgroundImage = 'url(' + elem.dataset[lazyLoadAttr.replace('data-', '')] + ')';
            }
            elem.removeAttribute(lazyLoadAttr);
        }
    });
}

// Маска ввода номера телефона
export function phoneMask(event) {
    if (!(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Tab')) {
        event.preventDefault();
    }
    const change = new Event('change');
    let mask = '+7(111)111-11-11'; // Задаем маску

    if (/[0-9\+\ \-\(\)]/.test(event.key)) {

        let currentString = event.target.value;
        let currentLength = currentString.length;

        if (/[0-9]/.test(event.key)) {
            for (let i = currentLength; i < mask.length; i++) {
                let number = event.key;
                if (mask[i] == '1') {
                    if (i == 3 && number != '9') {
                        number = '';
                    }
                    event.target.value = currentString + number;
                    break;
                }
                currentString += mask[i];
            }
        }
    }
    event.target.dispatchEvent(change);
}

// инициализируем слайдер
export function initSliders(sliders, params) {
    if(typeof Swiper !== 'undefined'){
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'assets/project_files/css/swiper.min.css');
        document.head.appendChild(link);
        sliders.forEach(function (elem, i) {
            let paramsId = elem.dataset.params;
            new Swiper(elem, params[paramsId]);
        });
    }
}

// устанавливаем отступы для контента
export function changeContentPadding(header,footer,main,wrap,sections) {
    if (window.matchMedia("(min-width: 576px)").matches) {
        header.classList.add('fixed-top');
        header.classList.remove('fixed-bottom');
        wrap.style.paddingTop = header.clientHeight + 'px';
    } else {
        header.classList.remove('fixed-top');
        header.classList.add('fixed-bottom');
        wrap.style.paddingBottom = header.clientHeight + 'px';
    }

    let minHeight = document.documentElement.clientHeight - header.clientHeight - footer.clientHeight;
    sections.forEach(function (section, i) {
        if (i !== sections.length - 1 && sections.length > 1) {
            minHeight = document.documentElement.clientHeight - header.clientHeight;

        }
        if(i === 0){
            section.style.minHeight = minHeight + 'px';
        }
        if(i === 0 && section.querySelector('.big-slider')){
            section.querySelector('.big-slider').style.minHeight = minHeight - 20 + 'px';
        }
    });
}

// функция обработки файлов
export function fileHandler(e) {
    let parent = e.target.closest('.form-group'),
        fileName = parent.querySelector('.jsFileName'),
        fileBtn = parent.querySelector('.jsFileBtn'),
        fileBtnCurText = fileBtn.innerText,
        fileBtnNextText = fileBtn.dataset.text;
    if (e.target.files.length == 1) {
        fileName.innerText = e.target.files[0].name;
        if(fileBtnCurText === 'Прикрепить'){
            fileBtn.innerText = fileBtnNextText;
            fileBtn.dataset.text = fileBtnCurText;
        }
    } else {
        fileName.innerText = fileName.dataset.text;
    }
}

//функция отправки ajax
export function sendAjax(url, params, callback, method, type) {
    const request = new XMLHttpRequest();
    url = url || document.location.href;
    method = method || 'POST';
    request.open(method, url, true);
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.responseType = type || 'json';
    request.addEventListener('readystatechange', function () {
        if (request.readyState === 4 && request.status === 200) {
            callback(request.response);
        }
    });
    request.send(params);
}

// функция разворачивания svg
export function getImgData(el, response) {
    let svg = new DOMParser().parseFromString(response, "text/html").getElementsByTagName("svg")[0];
    svg.removeAttribute('xmlns');
    if (el.getAttribute('id')) {
        svg.setAttribute('id', el.getAttribute('id'));
    }
    if (el.getAttribute('class')) {
        svg.setAttribute('class', el.getAttribute('class'));
    }
    if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
        svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + svg.getAttribute('width'));
    }
    el.replaceWith(svg);
}