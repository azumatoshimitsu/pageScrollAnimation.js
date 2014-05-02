$.fn.pageScrollAnimation = function(arg) {
	var $root = $(this);
	var $section = $root.find('.section');
	var $item = $root.find('.item');
	var scenario = arg.scenario;
	var unit = {top: 'px', left: 'px'};
	var d = (arg.direction === 'horizontal') ? 'left' : 'top';
	var callback = arg.callback;

	init();
	if(d === 'left') {
		$(window).scrollLeft(1);
	} else {
		$(window).scrollTop(1);
	}

	//スクロール量に応じてプロパティを設定
	//$parent の位置 - スクロール量が 0 でオブジェクトの位置が揃う
	$(window).bind('scroll', function(e) {
		var scrollPos = (arg.direction === 'horizontal') ? $(window).scrollLeft() : $(window).scrollTop();

		$.each(scenario, function() {
			var $item = this.$target;
			var $parent = this.$parent;
			var order = {};
			var calc = $parent.data('prop')[d] - scrollPos;

			if(calc > 0) {
				$.each(this.order, function(key, value) {
					var addUnit = unit[key] || '';
					order[key] = Math.floor( calc * value ) + $item.data('prop')[key] + addUnit;
				});
				$item.css(order);
			} else {
				$.each(this.order, function(key, value) {
					var addUnit = unit[key] || '';
					order[key] = $item.data('prop')[key] + addUnit;
				});
				$item.css(order);
				$item.trigger('complete', $item);
			}
		});
	});

	function init() {
		$section.each(function(index) {
			var x = $(this).offset().left;
			var y = $(this).offset().top;
			    x = x || 0;
			    y = y || 0;
			$(this).data( 'prop', {left: x, top: y} );
			$(this).attr('data-x', x);
			$(this).attr('data-y', y);
		});

		$item.each(function(index) {
			var x = Number( $(this).css('left').replace('px', '') );
			var y = Number( $(this).css('top').replace('px', '') );
			    x = x || 0;
			    y = y || 0;
			$(this).data( 'prop', {left: x, top: y} );
			$(this).attr('data-x', x);
			$(this).attr('data-y', y);
		});
		callback();
	};

};
