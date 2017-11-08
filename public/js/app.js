$(document).ready(function () {

    var $hotelItem = $('#j-hotel-item').html(),
        $container = $('.container'),
        collection = []
        $error = $('.j-error');

    $.ajax({
        url: 'http://fake-hotel-api.herokuapp.com/api/hotels',
        type: 'GET',
        dataType: 'json',
        timeout: 5000
    }).done(function (data) {
        if (data && !data.error) {
            var escaper = createEscaper();

            data.slice(0, 5).forEach(function(item, i) {
                var stars;

                if (item.stars === 1) {
                    stars = '★☆☆☆☆';
                } else if (item.stars === 2) {
                    stars = '★★☆☆☆';
                } else if (item.stars === 3) {
                    stars = '★★★☆☆';
                } else if (item.stars === 4) {
                    stars = '★★★★☆';
                } else if (item.stars === 5) {
                    stars = '★★★★★';
                }

                collection.push(
                    $hotelItem
                        .replace(/\$0/g, escaper(item.id))
                        .replace('$1', escaper(item.images[0]))
                        .replace('$2', escaper(item.name))
                        .replace('$3', escaper(stars))
                        .replace('$4', escaper(item.city))
                        .replace('$5', escaper(item.country))
                        .replace('$6', escaper(item.description))
                        .replace('$7', escaper(item.price))
                        .replace('$8', escaper(item.date_start))
                        .replace('$9', escaper(item.date_end))
                );
            });

            $container.append(collection);
        }
    }).fail(function (err) {

        var defaultMsg = 'Something went wrong',
            error;

        try {
            error = JSON.parse(err.responseText).error || defaultMsg;
        } catch (e) {
            error = defaultMsg;
        }

        $error.text(error).show();

    }).always(function () {

    });

    $(document).on('click', '.j-load-hotels', function (e) {
        e.preventDefault();
        var $item = $('.container').find('.item');

        $item.removeClass('hide');
        $(this).hide();
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

        if (!$(this).hasClass('toggle')) {
            return;
        }

        $.ajax({
            url: '/proxy/api/reviews?hotel_id=' + hotelId,
            type: 'GET',
            dataType: 'json',
            timeout: 5000
        }).done(function (data) {
            data.apiBody.forEach(function (review) {
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
});

/**
 * Creates html escaper/unescaper.
 *
 * @param direction bool If true then escaper context is loaded, otherwise unescape context.
 * @return function Escaper/unescaper function.
 */
createEscaper = function (direction) {
    if (typeof direction === "undefined") {
        direction = true;
    }

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };

    var unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#x27;': "'",
        '&#x60;': '`'
    };

    var map = direction ? escapeMap : unescapeMap;

    var escaper = function(match) {
        return map[match];
    };

    var keys = [];

    for (var i in map) {
        if (!map.hasOwnProperty(i)) {
            continue;
        }

        keys.push(i);
    }

    var source = '(?:' + keys.join('|') + ')';

    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');

    return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};
