import * as functions from './functions.min.js';

document.addEventListener('readystatechange', function () {
    if (document.readyState == 'complete') {
        // основной объект со всеми функциями
        const projectScripts = {
            // конфигурация
            header: document.querySelector('.jsHeader'),
            footer: document.querySelector('.jsFooter'),
            main: document.querySelector('.jsMain'),
            wrap: document.querySelector('.jsSiteWrap'),
            menu: document.querySelector('#menu'),
            lazyLoadAttr: 'data-msrc',
            scrollHideElems: document.querySelectorAll('.jsScrollHide'),
            sections: document.querySelectorAll('.jsSection'),
            navLinks: document.querySelectorAll('.nav-link'),
            sliders: document.querySelectorAll('.swiper'),
            galleries: document.querySelectorAll('.jsGallery'),
            togglers: document.querySelectorAll('.jsToggler'),
            mqLg: window.matchMedia('(min-width: 992px)').matches,

            fixedMenu: function (scrollHideElems, parentNode, offsetTop, mq) {
                if (offsetTop - window.pageYOffset <= 30 && mq) {
                    scrollHideElems.forEach(el => {
                        el.classList.add('d-none');
                    });
                    parentNode.classList.add('fixed-menu');
                }
                if (window.pageYOffset < 30 || !mq) {
                    scrollHideElems.forEach(el => {
                        el.classList.remove('d-none');
                        if (el.classList.contains('d-none')) {

                        }
                    });
                    parentNode.classList.remove('fixed-menu');
                }
            },

        };

        function documentReady() {
            if (projectScripts.togglers.length) {
                projectScripts.togglers.forEach(el => {
                    let target = document.getElementById(el.dataset.target);
                    if (target) {
                        el.addEventListener('click', () => target.classList.toggle('active'));
                    }
                });
            }

            // выставляем внутренние отступы для контентной части страницы
            functions.changeContentPadding(
                projectScripts.header,
                projectScripts.footer,
                projectScripts.main,
                projectScripts.wrap,
                projectScripts.sections
            );
            window.onresize = function () {
                projectScripts.mqLg = window.matchMedia('(min-width: 992px)').matches;
                // фиксируем меню на ПК
                if (projectScripts.menu) {
                    projectScripts.fixedMenu(
                        projectScripts.scrollHideElems,
                        projectScripts.menu.parentNode,
                        projectScripts.menu.offsetTop,
                        projectScripts.mqLg
                    );
                }

                functions.changeContentPadding(
                    projectScripts.header,
                    projectScripts.footer,
                    projectScripts.main,
                    projectScripts.wrap,
                    projectScripts.sections
                );
            };

            // init sliders
            if (projectScripts.sliders.length) {
                const sliderParams = {
                    "big":{
                            direction: 'horizontal',
                            loop: true,
                            slidesPerView: 1,
                            spaceBetween: 1,
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                        },
                    "medium": {
                        direction: 'horizontal',
                        loop: true,
                        slidesPerView: 1,
                        spaceBetween: 1,
                        lazy: true,
                        breakpoints: {
                            576: {
                                slidesPerView: 2
                            },

                            768: {
                                slidesPerView: 3,
                            },

                            1200: {
                                slidesPerView: 4,
                            }
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            type: 'bullets',
                            clickable: true
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    }
                };
                functions.loadScript('assets/project_files/js/swiper-bundle.min.js', () => functions.initSliders(projectScripts.sliders, sliderParams));
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
                functions.lazyLoad(projectScripts.lazyLoadAttr);

                // фиксируем меню на ПК
                if (projectScripts.menu) {
                    projectScripts.fixedMenu(
                        projectScripts.scrollHideElems,
                        projectScripts.menu.parentNode.parentNode,
                        projectScripts.menu.offsetTop,
                        projectScripts.mqLg
                    );
                }
            });
            functions.lazyLoad(projectScripts.lazyLoadAttr);
        }

        documentReady();
    }
});