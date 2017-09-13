$(function() {
    var hotelsApp = (function () {

        var getHotels = function () {
            $(document).on('click', '.j-load-hotels', function (e) {
                e.preventDefault();
                var $item = $('.container').find('.item');

                $item.removeClass('hide');
            });

            $(document).on('click', '.j-load-preview', function (e) {
                e.preventDefault();

                $this = $(this);
                $error = $this.closest('.item').find('.error');

                $error.hide();

                var hotelId = $this.closest('.item').find('.hidden-field').text();

                $this.toggleClass('toggle');

                if ($this.hasClass('toggle')) {
                    $this.text('Hide Reviews');
                    $this.closest('.item').find('.item-bottom').removeClass('hide');
                } else {
                    $this.text('Show Reviews');
                    $this.closest('.item').find('.item-bottom').addClass('hide');
                }

                $.ajax({
                    url: 'http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=' + hotelId,
                    type: 'GET',
                    dataType: 'json',
                    timeout: 5000
                }).done(function (data) {
                    data.forEach(function (review) {
                        $this.closest('.item').find('.j-review-name').text(review.name);
                        $this.closest('.item').find('.j-review-comment').text(review.comment);

                        if (review.positive) {
                            $this.closest('.item').find('.j-circle').text('+');
                        } else if (review.positive === false) {
                            $this.closest('.item').find('.j-circle').text('-');
                        }
                    });
                }).fail(function (err) {
                    var error = JSON.parse(err.responseText).error;

                    $error.show();
                    $error.text(error)
                }).always(function () {

                });
            });
        };

        var registerEvents = function() {
            getHotels();
        };

        return {
            registerEvents: registerEvents
        };
    })();

    hotelsApp.registerEvents();

});
