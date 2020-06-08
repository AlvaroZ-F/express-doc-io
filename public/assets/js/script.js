var typing = false;
var timeout = undefined;
var username = 'anonymous';
const docForm = document.getElementById('docForm')

$(document).ready(function () {
	var socket = io.connect();
	var uId = prompt("Enter your username: ", '');
	socket.emit('username', uId);

	socket.on('message', message => {
		console.log(message)
	});

	socket.on('newuser', newuser => {
		console.log(newuser);
	})

	socket.on('online-users', function (data) {
		$('.userlist').html(data);
	});

	socket.on('remained-users', function (data) {
		$('.userlist').html(data);
	});

	//Communication between server - client. Text updating
	socket.on('updated_edit', function (data) {
		console.log(data);
		$('.ql-editor').text(data);
	});

	$('.editable').on('keyup', function () {
		var text = $('.ql-editor').text();
		socket.emit('para', text);
	});

	$('.editable').on('keydown', function () {
		typing = true;
		socket.emit('typing', {user: uId, typing: true);
	});

	socket.on('display', (data) => {
		if (data.typing == true) {
			$('.usertag').html(`${data.user} is typing...`);
		} else {
			$('.usertag').html("");
			typing = false;
		}
	});
	var b = $(window).height() / 1.60;
	$('.editable').css('height', b);
	$(window).on('resize', function () {
		var a = $(window).height() / 1.60;
		$('.editable').css('height', a)
	});
});

if ($(window).width() < 700) {
	var quill = new Quill('.editable', {
		modules: {
			toolbar: [['bold', 'italic', 'underline', { 'color': [] }]]
		},
		theme: 'snow', formats: ['bold', 'italic', 'underline', 'link', 'list', 'blockquote', 'color', 'background']
	})
} else {
	var quill = new Quill('.editable', {
		modules: {
			toolbar: [
				['bold', 'italic', 'underline', 'link', 'blockquote'],
				[{ 'list': 'ordered' }, { 'list': 'bullet' }],
				[{ 'indent': '-1' }, { 'indent': '+1' }],
				[{ 'color': [] }, { 'background': [] }],
				[{ 'align': [] }],
				['clean']
			]
		},
		theme: 'snow',
		formats: ['bold', 'italic', 'underline', 'link', 'list', 'blockquote', 'indent', 'align', 'color', 'background']
	})
}

quill.focus();

window.onbeforeunload = function () {
	if (change.length() > 0) {
		return 'There are unsaved changes. Are you sure you want to leave?'
	}
};

alertify.set('notifier', 'position', 'top-center');

var delay = (function () {
	var c = 0;
	return function (a, b) {
		clearTimeout(c); c = setTimeout(a, b)
	}
})();

function spell_check() {
	if ($('.spell-check').hasClass('color')) {
		$('.spell-check').removeClass('color');
		$('.editable').attr('spellcheck', false);
	} else {
		$('.spell-check').addClass('color');
		$('.editable').attr('spellcheck', true);
	}
}

var doc = new jsPDF();

var specialElementHandlers = {
	'.editable': function (element, renderer) {
		return true;
	}
};

function save_PDF() {
	doc.fromHTML($('.editable').html(), 15, 15, {
		'width': 700,
		'elementHandlers': specialElementHandlers
	});
	doc.save('express-notepad.pdf');
}