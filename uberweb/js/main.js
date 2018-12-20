
//main menu
$(function() {
$(".main-menu__icon").click(function(){
    $(".main-menu__list").toggleClass("main-menu__list--state--open")
})
});
//main menu
// Tabs
(function($) {
    $(function() {

        $('ul.tabs__caption').on('click', 'li:not(.tabs__item--active)', function() {
            $(this)
                .addClass('tabs__item--active').siblings().removeClass('tabs__item--active')
                .closest('div.tabs').find('div.tabs__content').removeClass('tabs__content--active').eq($(this).index()).addClass('tabs__content--active');
        });

    });
})(jQuery);
// End Tabs