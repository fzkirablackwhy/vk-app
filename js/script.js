var form = document.querySelector('.form-id');
var uid_input = document.querySelector('.form-id__input');
uid_input.value = '';
VK.init({
    apiId: 5744005
});
form.addEventListener('submit', function(event) {
    'use strict';
    event.preventDefault();

    function isValidInput(input) {
        return /[a-z][0-9]+/.test(input);
    }
    VK.Api.call('utils.resolveScreenName', {
        screen_name: uid_input.value
    }, function(r) {
        if (r.response && (isNaN(uid_input.value))) {
            if (!r.response.object_id && !isValidInput(uid_input)) {
                alert('Пользователь не найден!');
                uid_input.value = ' ';
            } else {
                uid_input.value = r.response.object_id;
            }
        }
    });

    function clear_section() {
        document.querySelector('.gallery').innerHTML = '';
    };
    clear_section();
});

function authInfo(response) {
    'use strict';
    if (response.session) {
        var id = response.session.mid;
    }
    VK.Api.call('utils.resolveScreenName', {
        screen_name: uid_input.value
    }, function(r) {
        if (r.response && (isNaN(uid_input.value))) {
            uid_input.value = r.response.object_id;
        }
    });
    VK.Api.call('users.get', {
        user_ids: uid_input.value,
        fields: 'sex,photo_big, screen_name'
    }, function(r) {
        if (r.response) {
            if (r.response[0].first_name) {
                var user_div = document.createElement('div'),
                    user_photo = document.createElement('img'),
                    title = document.createElement('h2');
                document.querySelector('.gallery').style.display = 'block';
                title.classList.add('gallery__subtitle');
                title.appendChild(document.createTextNode('Фотографии с альбома пользователя' + ' ' + r.response[0].first_name + ' ' + r.response[0].last_name + ' :'));
                user_div.classList.add('user', 'block');
                user_photo.classList.add('user__user-photo');
                user_photo.setAttribute('src', r.response[0].photo_big);
                user_div.appendChild(user_photo);
                document.querySelector('.gallery').appendChild(user_div);
                document.querySelector('.gallery').appendChild(title);
            }
        } else {
            alert('Пользователь не найден!');
        }
    });
    VK.api('photos.get', {
        owner_id: uid_input.value,
        album_id: 'wall',
        extended: '1',
        count: 50
    }, function (r) {
        if (r.response) {
            var gallery_list = document.createElement('div');
            gallery_list.classList.add('gallery__gallery-list', 'block');
            document.querySelector('.gallery').appendChild(gallery_list);
            for (var i = 0; i < r.response.length; i++) {
                var image_item = document.createElement('a');
                var wall_photo = document.createElement('img');
                var icon_bubble = document.createElement('span');
                var icon_heart = document.createElement('span');
                var likes = r.response[i].likes.count;
                var comments = r.response[i].comments.count;
                var date = r.response[i].created;
                var pub_date = (new Date(date * 1000)).toLocaleDateString();
                icon_bubble.classList.add('icon-bubble');
                icon_heart.classList.add('icon-heart');
                icon_heart.appendChild(document.createTextNode(likes));
                icon_bubble.appendChild(document.createTextNode(comments));
                image_item.classList.add('gallery-list__image-item');
                image_item.setAttribute('data-caption', r.response[i].likes.count + ' likes ' + r.response[i].comments.count + ' comments ' + pub_date);
                if (r.response[i].src_xxbig) {
                    image_item.setAttribute('href', r.response[i].src_xxbig);
                } else if (r.response[i].src_xbig) {
                    image_item.setAttribute('href', r.response[i].src_xbig);
                } else {
                    image_item.setAttribute('href', r.response[i].src_big);
                }
                wall_photo.classList.add('image-item__image');
                wall_photo.style.backgroundImage = 'url(' + r.response[i].src_big + ')';
                image_item.appendChild(wall_photo);
                image_item.appendChild(icon_heart);
                image_item.appendChild(icon_bubble);
                gallery_list.appendChild(image_item);
                // jQuery('.gallery').append('<ul>' + r.response[i].likes.count + ' ' + r.response[i].comments.count + '</ul>');
            };
        };
        document.querySelector('img').addEventListener('click', baguetteBox.run('.gallery__gallery-list', {
            animation: 'fadeIn'
        }), false);
    });
}
