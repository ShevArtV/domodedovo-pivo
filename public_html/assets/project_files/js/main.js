import * as functions from './functions.js';
document.addEventListener('readystatechange', function () {
    if (document.readyState == 'complete') {
        // основной объект со всеми функциями
        const projectScripts = {
            // конфигурация
            navLinks: document.querySelectorAll('.nav-link'),
            sliders: document.querySelectorAll('.swiper'),
        };

        function documentReady() {
             if(projectScripts.sliders.length){
                 let params = [
                     {
                         direction: 'horizontal',
                         loop: false,
                         slidesPerView:1,
                         navigation: {
                             nextEl: '.swiper-button-next',
                             prevEl: '.swiper-button-prev',
                         },
                     }
                 ];
                 functions.loadScript('assets/project_files/js/swiper-bundle.min.js', () => functions.initSliders(projectScripts.sliders, params));
             }


            const anchors = document.querySelectorAll('a[href*="#"]');
            for (let i = 0; i < anchors.length; i++) {
                let anchor = anchors[i];
                // Плавный скролл
                if (anchor.getAttribute('href').indexOf('http') == -1 && !anchor.getAttribute('data-bs-toggle')) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        setTimeout(function () {
                            functions.scrollIntoView(anchor);
                        }, 500);
                    });
                }
            }

            // прокручиваем страницу если в адресе есть якорь
            let targetId = document.location.href.match(/#(.*)$/);
            if (targetId) {
                projectScripts.navLinks.forEach(function (link) {
                    if (targetId[0].indexOf(link.getAttribute('href')) != -1) {
                        setTimeout(function () {
                            functions.scrollIntoView(link);
                        }, 1000);
                    }
                });
            }


            // Маска ввода номера телефона
            let phoneMaskEls = document.querySelectorAll('input[type="tel"]');
            for (let i = 0; i < phoneMaskEls.length; i++) {
                phoneMaskEls[i].addEventListener('keydown', functions.phoneMask);
            }

            // Вставляем защитный ключ
            let antiSpamKey = document.querySelectorAll('input[name="secret"]');
            if (antiSpamKey.length) {
                for (let k = 0; k < antiSpamKey.length; k++) {
                    antiSpamKey[k].value = antiSpamKey[k].dataset.secret;
                }
            }

            // отслеживаем прокрутку
            window.addEventListener('scroll', function () {
                functions.lazyLoad();
            });
            functions.lazyLoad();
        }
        documentReady();
    }
});