import * as functions from './functions.min.js';

document.addEventListener('readystatechange', function () {
    const contentWidth = document.body.scrollWidth;
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
            fancybox: document.querySelectorAll('[data-fancybox]'),
            togglers: document.querySelectorAll('.jsToggler'),
            inputFiles: document.querySelectorAll('input[type="file"]'), // коллекция файловых инпутов
            inputText: document.querySelectorAll('.input-field'), // коллекция нефайловых инпутов
            faqs: document.querySelectorAll('.faq-item'), // коллекция вопросов
            mqLg: window.matchMedia('(min-width: 992px)').matches,

            fixedMenu: function (scrollHideElems, parentNode, offsetTop, mq) {
                let scrollWidth = window.screen.width - document.body.clientWidth;
                if (offsetTop - window.pageYOffset <= 30 && mq) {
                    scrollHideElems.forEach(el => {
                        el.classList.add('d-none');
                    });
                    parentNode.classList.add('fixed-menu');
                }
                if (window.pageYOffset < 30 || !mq) {
                    scrollHideElems.forEach(el => {
                        el.classList.remove('d-none');
                    });
                    parentNode.classList.remove('fixed-menu');
                }
            },

            hidePlaceholders: function (el){
                let parent = el.closest('div'),
                    label = parent.querySelector('.input-label');
                if(el.value){
                    label.classList.add('full');
                }else{
                    label.classList.remove('full');
                }
            }

        };

        function documentReady() {
            /* скрываем плейсхолдер */
            if(projectScripts.inputText.length){
                projectScripts.inputText.forEach(el=>{
                    projectScripts.hidePlaceholders(el);
                    el.addEventListener('change', () =>{ projectScripts.hidePlaceholders(el) });
                });
            }
            /* скрываем плейсхолдер */

            /* вешаем обработчики на input типа файл */
            if (projectScripts.inputFiles.length) {
                projectScripts.inputFiles.forEach(function (elem) {
                    elem.addEventListener('change', functions.fileHandler);
                });
            }
            /* вешаем обработчики на input типа файл */

            /* модалки и галерея */
            if (projectScripts.fancybox.length) {

                functions.loadScript('assets/project_files/js/fancybox.umd.min.js', () => {
                    let link = document.createElement('link');
                    link.setAttribute('rel', 'stylesheet');
                    link.setAttribute('href', 'assets/project_files/css/fancybox.css');
                    document.head.appendChild(link);
                    projectScripts.fancybox.forEach(el => {

                    });
                    console.log(document.body.scrollWidth);
                    Fancybox.bind("[data-fancybox]", {
                        on: {
                            reveal:(fancybox, slide) =>{
                                let fixedMenu = document.querySelector('.fixed-menu');
                                if(fixedMenu){
                                    fixedMenu.style.marginLeft = '-'+(document.body.scrollWidth - contentWidth) / 2 + 'px';
                                }
                            },
                            destroy: (fancybox, slide) =>{
                                let fixedMenu = document.querySelector('.fixed-menu');
                                if(fixedMenu){
                                    fixedMenu.style.marginLeft = 'auto';
                                }
                            },
                            done: (fancybox, slide) => {
                                if (slide.value) {
                                    let modal = document.querySelector(slide.src),
                                        input = modal.querySelector('input[name="value"]'),
                                        textInputs = modal.querySelectorAll('.input-field'),
                                        block = modal.querySelector('.jsValue');
                                    if(textInputs.length){
                                        textInputs.forEach(el=>{
                                            projectScripts.hidePlaceholders(el);
                                            el.addEventListener('change', () =>{ projectScripts.hidePlaceholders(el) });
                                        });
                                    }
                                    if (input) {
                                        input.value = slide.value;
                                    }
                                    if (block) {
                                        block.innerText = slide.value;
                                    }
                                }
                            },
                        },
                    });
                });
            }
            /* модалки и галерея */

            /* переключатель */
            if (projectScripts.togglers.length) {
                projectScripts.togglers.forEach(el => {
                    let target = document.getElementById(el.dataset.target);
                    if (target) {
                        el.addEventListener('click', () => {
                            target.classList.toggle('active');
                        });
                    }
                });
            }
            /* переключатель */

            /* вешаем обработчики на вопросы и ответы */
            if (projectScripts.faqs.length) {
                const faqs = projectScripts.faqs,
                    faqColumns = document.querySelectorAll('.faq-column');
                faqs.forEach(function (elem) {
                    let answer = elem.querySelector('.answer'),
                        curPaddingBottom = Number(window.getComputedStyle(elem).paddingBottom.replace('px', ''));
                    answer.style.bottom = curPaddingBottom + 'px';
                    elem.addEventListener('click', function (e) {
                        faqs.forEach(el => {
                            if (el !== elem) {
                                el.classList.remove('active');
                                el.style.paddingBottom = curPaddingBottom + 'px';
                            }
                        });
                        if (!elem.classList.contains('active')) {
                            elem.style.paddingBottom = (answer.scrollHeight + curPaddingBottom * 2) + 'px';
                            elem.classList.add('active');
                        } else {
                            elem.style.paddingBottom = curPaddingBottom + 'px';
                            elem.classList.remove('active');
                        }
                    });
                });
            }
            /* вешаем обработчики на вопросы и ответы */

            /* выставляем внутренние отступы для контентной части страницы */
            functions.changeContentPadding(
                projectScripts.header,
                projectScripts.footer,
                projectScripts.main,
                projectScripts.wrap,
                projectScripts.sections
            );
            /* выставляем внутренние отступы для контентной части страницы */

            window.onresize = function () {
                projectScripts.mqLg = window.matchMedia('(min-width: 992px)').matches;
                /* фиксируем меню на ПК при изменении размера окна */
                if (projectScripts.menu) {
                    projectScripts.fixedMenu(
                        projectScripts.scrollHideElems,
                        projectScripts.menu.parentNode,
                        projectScripts.menu.offsetTop,
                        projectScripts.mqLg
                    );
                }
                /* фиксируем меню на ПК при изменении размера окна */

                /* выставляем внутренние отступы для контентной части страницы при изменении размера окна */
                functions.changeContentPadding(
                    projectScripts.header,
                    projectScripts.footer,
                    projectScripts.main,
                    projectScripts.wrap,
                    projectScripts.sections
                );
                /* выставляем внутренние отступы для контентной части страницы при изменении размера окна */
            };

            /* инициализируем слайдеры */
            if (projectScripts.sliders.length) {
                const sliderParams = {
                    "big": {
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
                            el: '.swiper-pagination-medium',
                            type: 'bullets',
                            clickable: true
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    },
                    "small": {
                        direction: 'horizontal',
                        loop: true,
                        slidesPerView: 1,
                        spaceBetween: 1,
                        pagination: {
                            el: '.swiper-pagination-small',
                            type: 'bullets',
                            clickable: true
                        },
                    },
                };
                functions.loadScript('assets/project_files/js/swiper-bundle.min.js', () => functions.initSliders(projectScripts.sliders, sliderParams));
            }
            /* инициализируем слайдеры */

            /* плавный скролл */
            const anchors = document.querySelectorAll('a[href*="#"]');
            for (let i = 0; i < anchors.length; i++) {
                let anchor = anchors[i];
                if (anchor.getAttribute('href').indexOf('http') == -1 && !anchor.getAttribute('data-bs-toggle')) {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        setTimeout(function () {
                            functions.scrollIntoView(anchor);
                        }, 500);
                    });
                }
            }
            /* плавный скролл */

            /* прокручиваем страницу если в адресе есть якорь */
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
            /* прокручиваем страницу если в адресе есть якорь */


            /* маска ввода номера телефона */
            let phoneMaskEls = document.querySelectorAll('input[type="tel"]');
            for (let i = 0; i < phoneMaskEls.length; i++) {
                phoneMaskEls[i].addEventListener('keydown', functions.phoneMask);
            }
            /* маска ввода номера телефона */

            /* вставляем защитный ключ */
            let antiSpamKey = document.querySelectorAll('input[name="secret"]');
            if (antiSpamKey.length) {
                for (let k = 0; k < antiSpamKey.length; k++) {
                    antiSpamKey[k].value = antiSpamKey[k].dataset.secret;
                }
            }
            /* вставляем защитный ключ */

            /* отслеживаем прокрутку */
            window.addEventListener('scroll', function () {
                functions.lazyLoad(projectScripts.lazyLoadAttr);

                /* фиксируем меню на ПК при скролле */
                if (projectScripts.menu) {
                    projectScripts.fixedMenu(
                        projectScripts.scrollHideElems,
                        projectScripts.menu.parentNode.parentNode,
                        projectScripts.menu.offsetTop,
                        projectScripts.mqLg
                    );
                }
                /* фиксируем меню на ПК при скролле */
            });
            /* отслеживаем прокрутку */

            /* ленивая загрузка */
            functions.lazyLoad(projectScripts.lazyLoadAttr);
        }

        documentReady();
    }
});