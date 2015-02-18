# Transliteration

My sense of beauty is always suffering seeing cyrillic text.

For now here will be only Russian Cyr -> Russian Lat transliteration.

Later ukrainian and belarusian will be added.

Also current implementation is slow and very simple. Async transliteration with buffering will be added.

Feel free to use with MIT.

# Usage
```
var transliterated = transliterate(str, [ rules ], [ transliterateWordPartFn ]);

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

transliterateWordPartFn

```
transliterateWordPartFn = function (strFrom, strTo) {
	if (str === 'Ня' &&  strTo === 'Ńa') {
		return '<b>Ńa</b>'; //custom token wrapping or other job
	}

	return strTo;
};
```

# Logging

You can specify your custom logger settings by
```
transiterate.log = yourLogFn
```

The default one is global.console.log.
