# Transliteration

My sense of beauty is always suffering seeing cyrillic text.

For now here will be only Russian Cyr -> Russian Lat transliteration.

Later ukrainian and belarusian will be added.

Also current implementation is slow and very simple. Async transliteration with buffering will be added.

Feel free to use with MIT.

# Usage
```
var transliterated = transliterate(str, [ rules ]);

transliterateAsync(str, [ transliterateAsyncFn ],  [ bufferSizeChars ], [ rules ]));

```

Rules will be applied in the specified order specified by array.
```
rules =
[
	['Бь', 'B´'],
	[ 'Вы', 'Vy' ],
	['Ги','Gi'],
	['А', 'A']
];
```

transliterateAsyncFn - string will be transliterated asynchronously with buffers of defined or default size 100 and when all async done this callback will be triggered with the transliterated string.

```
var data = '';
transliterateAsyncFn = function (originalChunk, replacedChunk, chunkStartIndex) {
	if (originalChunk === 'Ня' &&  replacedChunk === 'Ńa') {
		data += '<b>Ńa</b>'; //custom token wrapping or other job
	}
};
```
bufferSizeChars - string will be parsed using binary buffer of fixed size if available


# Logging

You can specify your custom logger settings by
```
transiterate.log = yourLogFn
```

Log is disabled by default;
