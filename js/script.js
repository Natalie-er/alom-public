const fixedBody = {
    add: () => {
        $('body').addClass('is-fixed');
    },

    remove: () => {
        $('body').removeClass('is-fixed');
    },
};

const setHeaderHeight = () => {
    $('body').css('--header-top-height', `${$('.header').height()}px`);
};

const submenu = {
    button: '.js-submenu-button',
    menu: null,
    menuHeight: null,

    init() {
        this.menu = $('.js-menu');
        this.menuHeight = $(this.menu).innerHeight();

        $(this.button).each((index, button) => {
            const submenu = $(button).find('.js-submenu');
            const buttonText = $(button).find('.menu__link').text();

            $(submenu).prepend(`<div class="submenu__back">${buttonText}</div>`);

            const buttonClose = $(submenu).find('.submenu__back');
            const submenuHeight = $(submenu).innerHeight();
            
            $(button).click(() => {
                this.open(button, submenu, submenuHeight);
            });

            $(buttonClose).click((e) => {
                e.stopPropagation();
                this.close(button, submenu, submenuHeight);
            });
        });
    },

    open(button, submenu, submenuHeight) {
        if (this.menuHeight > submenuHeight) {
            $(submenu).css({
                'min-height': this.menuHeight,
            });
        } else {
            $(this.menu).animate({
                'min-height': submenuHeight,
            }, 200, 'linear');
        }

        setTimeout(() => {
            $(button).addClass('submenu-is-open');
        }, 200);
    },

    close(
        button = $('.submenu-is-open'),
        submenu = $('.submenu-is-open').find('.js-submenu'),
        submenuHeight = $(submenu).innerHeight()
        ) {
        $(button).removeClass('submenu-is-open');

        setTimeout(() => {
            $(submenu).css({
                'min-height': submenuHeight,
            });
            $(this.menu).animate({
                'min-height': this.menuHeight,
            }, 200, 'linear');
        }, 200);
    },
};

const menu = {
    button: '.js-menu-button',
    menuContainer: $('.js-menu-container'),
    menuWrapper: $('.js-menu-wrapper'),
    isOpenClass: 'menu-is-open',
    isMenuOpen: false,

    init() {
        $(this.button).click(() => {
            if (this.isMenuOpen) {
                this.close();
            } else {
                this.open();
            }
        });

        submenu.init();
    },
    
    open() {
        $(this.menuContainer).addClass(this.isOpenClass);
        this.isMenuOpen = true;
        fixedBody.add();
    },

    close() {
        $(this.menuContainer).removeClass(this.isOpenClass);
        this.isMenuOpen = false;
        fixedBody.remove();

        setTimeout(() => {
            submenu.close();
        }, 300);
    }
};

jQuery(() => {
    $('input[type="tel"]').mask("+7 (X99) 999-99-99", {
        watchDataMask: true,
        translation: {
            'X': {
                pattern: /9/, 
                optional: false,
            },
        },
    });

    $.fn.validator.Constructor.DEFAULTS.focus = false;

    $('form[data-ajax]').validator().on('submit', function(e) {
        e.preventDefault();

        const form = $(this);
        const formId = form.data('ajax'); 
        const btn = $(form).find('[type="submit"]');

        formData = new FormData(form.get(0));
        formData.append('submit' + formId, 1);

        $.ajax({
            type: 'POST',
            contentType: false,
            processData: false,
            dataType: 'json',
            data: formData,
            success: function(data) {
                console.log('success')
            },
            error: function(data) {
                console.log(data.type);
                console.log('error');
            }
        });
    });

    if (screen.width < 1024) {
        setHeaderHeight();
        menu.init();
    }
});