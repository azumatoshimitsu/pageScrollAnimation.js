$.fn.pageScrollAnimation = function(arg) {
	var $root = $(this);
	var $nav = $root.find('.nav a');
	var $section = $root.find('.section');
	var $item = $root.find('.item');
	var scenario = arg.scenario;
	var unit = {top: 'px', left: 'px'};
	var d = (arg.direction === 'horizontal') ? 'left' : 'top';
	var callback = arg.callback;

	if($item.length < 1) {
		throw new Error('must element .item');
	}

	init();
	if(d === 'left') {
		$(window).scrollLeft(1);
	} else {
		$(window).scrollTop(1);
	}

	$nav.bind('click', function(e) {
		e.preventDefault();
		var $target = $( $(this).attr('href') );
		if(d === 'left') {
			$('html,body').animate({ scrollLeft: $target.data('prop')[d] }, 800);
		} else {
			$('html,body').animate({ scrollTop: $target.data('prop')[d] }, 800);
		}
	});

	$(window).bind('scroll', function(e) {
		var scrollPos = (arg.direction === 'horizontal') ? $(window).scrollLeft() : $(window).scrollTop();

		$.each(scenario, function() {
			var $item = this.$target;
			var $parent = this.$parent;
			var order = {};
			var calc;
			if($parent.data('prop') && $parent.data('prop')[d]) {
				calc = $parent.data('prop')[d] - scrollPos;
			} else {
				calc = 0;
			}

			if(calc > 0) {
				$.each(this.order, function(key, value) {
					var addUnit = unit[key] || '';
					if( key === 'opacity' ) {
						var zero = ( $parent.prev().hasClass('section')  && $parent.prev().data('prop')[d] )? $parent.prev().data('prop')[d] : 0;
						var alpha = map(calc, zero, $parent.data('prop')[d], 0, 1);
						if($item.data('prop')[key] > 0 ) {//0 -> 1
							if(scrollPos < 1) {
								order[key] = 0;
							} else {
								order[key] = 1 - alpha + $item.data('prop')[key];
							}
						} else {//1 -> 0
							order[key] = alpha + $item.data('prop')[key];
						}
					} else {
						order[key] = Math.floor( calc * value ) + $item.data('prop')[key] + addUnit;
					}
				});
				$item.css(order);
				if( Number($parent.attr('data-flg')) > 0 ) {
					$item.trigger('turn', $item);
					$parent.attr('data-flg', -1);
				}
			} else {
				$.each(this.order, function(key, value) {
					var addUnit = unit[key] || '';
					if( key === 'opacity' ) {
						order[key] = $item.data('prop')[key];
					} else {
						if( $item.data('prop') && $item.data('prop')[key] )
							order[key] = $item.data('prop')[key] + addUnit;
					}
				});
				$item.css(order);
				if( Number($parent.attr('data-flg')) < 0 ) {
					$item.trigger('complete', $item);
					$parent.attr('data-flg', 1);
				}
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
			$(this).attr('data-flg', -1);
		});
		$item.each(function(index) {
			var x = Number( $(this).css('left').replace('px', '') );
			var y = Number( $(this).css('top').replace('px', '') );
			var a = $(this).css('opacity');
			    x = x || 0;
			    y = y || 0;
			    a = a || 1;
			$(this).data( 'prop', {left: x, top: y, opacity: a} );
		});
		if(callback)
			callback();
	};

	function map(value,low1, high1, low2, high2) {
		var moto = high1 - low1;
		var ato  = high2 - low2;
		return (ato / moto) * value;
	};

};
