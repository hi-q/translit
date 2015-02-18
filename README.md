# Transliteration

My sense of beauty is always suffering seeing cyrillic text.

For now here will be only Russian Cyr -> Russian Lat transliteration.

Later ukrainian and belarusian will be added.

Feel free to use with MIT.

# Usage
```
var transliterated = transliterate(str, [ rules ], [ transliterateWordPartFn ]);

```

Rules will be applied in the specified order specified by array.
```
rules - 
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
	if (str === 'Бь') {
		return strTo;
	}

	if (str === 'Ня' &&  strTo === 'Ńa') {
		return '<b>Ńa</b>'; //custom token wrapping or other job
	}

	//...
};
```

