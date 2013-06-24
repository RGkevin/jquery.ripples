/* Author: Kevin Lopez @RGkevin

*/

(function($) {

	$.fn.ripples = function(options) {

		var settings = $.extend({
			// set defaults
			delay 	  : 30, // speed of ripples
			riprad 	  : 3,
			mapind : '',
			onmousemove : true,
			randomripples : true,
			frecuency : 700, // interval for random ripples
			width : false,
			height : false,
			id : ''
		}, options);

		return this.each(function(){


			var $this = $(this),
			canvas    = document.createElement('canvas'),
			image     = $this,
			width     = settings.width ? settings.width : this.width,
			height    = settings.height ? settings.height : this.height;

			// creating canvas

			canvas.width = width;
			canvas.height = height;
			canvas.id = settings.id ? settings.id : '';
			image.after(canvas);
			var ctx = $(canvas)[0].getContext('2d');

			// drawing image
			image.remove(); // hide original image
			ctx.drawImage(this, 0, 0);

			// effect settings
			var texture = ctx.getImageData(0, 0, width, height),
			ripple      = ctx.getImageData(0, 0, width, height),
			size        = width * (height + 2) * 2,
			oldind      = width,
			newind      = width * (height + 3),
			riprad      = settings.riprad,
			mapind,
			half_width  = width >> 1,
			half_height = height >> 1,
			ripplemap   = [],
			last_map    = [];

			for (var i = 0; i < size; i++) {
				last_map[i] = ripplemap[i] = 0;
			}

			/**
			 * Main loop
			 */
			function run() {
				newframe();
				ctx.putImageData(ripple, 0, 0);
			}

			/**
			* Disturb water at specified point
			*/
			function disturb(dx, dy) {
				dx <<= 0;
				dy <<= 0;

				for (var j = dy - riprad; j < dy + riprad; j++) {
					for (var k = dx - riprad; k < dx + riprad; k++) {
						ripplemap[oldind + (j * width) + k] += 512;
					}
				}
			}

			/**
			* Generates new ripples
			*/
			function newframe() {
				var i, a, b, data, cur_pixel, new_pixel, old_data;

				i = oldind;
				oldind = newind;
				newind = i;

				i = 0;
				mapind = oldind;

				// create local copies of variables to decrease
				// scope lookup time in Firefox
				var _width = width,
					_height = height,
					_ripplemap = ripplemap,
					_mapind = mapind,
					_newind = newind,
					_last_map = last_map,
					_rd = ripple.data,
					_td = texture.data,
					_half_width = half_width,
					_half_height = half_height;

				for (var y = 0; y < _height; y++) {
					for (var x = 0; x < _width; x++) {
						data = (
							_ripplemap[_mapind - _width] +
							_ripplemap[_mapind + _width] +
							_ripplemap[_mapind - 1] +
							_ripplemap[_mapind + 1]) >> 1;

						data -= _ripplemap[_newind + i];
						data -= data >> 5;

						_ripplemap[_newind + i] = data;

						//where data=0 then still, where data>0 then wave
						data = 1024 - data;

						old_data = _last_map[i];
						_last_map[i] = data;

						if (old_data != data) {
							//offsets
							a = (((x - _half_width) * data / 1024) << 0) + _half_width;
							b = (((y - _half_height) * data / 1024) << 0) + _half_height;

							//bounds check
							if (a >= _width) a = _width - 1;
							if (a < 0) a = 0;
							if (b >= _height) b = _height - 1;
							if (b < 0) b = 0;

							new_pixel = (a + (b * _width)) * 4;
							cur_pixel = i * 4;

							_rd[cur_pixel] = _td[new_pixel];
							_rd[cur_pixel + 1] = _td[new_pixel + 1];
							_rd[cur_pixel + 2] = _td[new_pixel + 2];
						}

						++_mapind;
						++i;
					}
				}

				mapind = _mapind;
			}

			/**
			* Generating riples when mouse moves
			*/

			if(settings.onmousemove){
				canvas.onmousemove = function(evt) {
					// console.log(disturb);
					disturb(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
				};
			};

			/**
			* Run core
			*/

			setInterval(run, settings.delay);

			// generate random ripples
			if (settings.randomripples) {
				var rnd = Math.random;
				setInterval(function() {
					disturb(rnd() * width, rnd() * height);
				}, settings.frecuency);
			};
		});
	};

}(window.jQuery));
