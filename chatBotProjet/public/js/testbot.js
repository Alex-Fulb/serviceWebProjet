(function($) {
    $(document).ready(function() {
        var $chatbox = $('.chatbox'),
            $chatboxTitle = $('.test'),
            $chatboxTitleOption = $('.chatbox__title__option'),
            $chatboxCredentials = $('.chatbox__credentials'),
            $popUpList = $('<div><input type="radio">A<br><input type="radio">B<br><input type="radio">C</div>');

        $chatboxTitle.on('click', function() {
            $chatbox.toggleClass('chatbox--tray');
        });
        $chatboxTitleOption.on('click', function(e) {
            e.stopPropagation();
            //$chatbox.addClass('chatbox--closed');
        });
        $chatbox.on('transitionend', function() {
            if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
        });
        
    });
})(jQuery);