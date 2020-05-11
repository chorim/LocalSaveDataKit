# LocalSaveDataKit
A simply local data save / load for legacy web

## Summary 
Keep user input data when refresh or page movement.
 
## Dependencies
1. jQuery.js
2. jQuery.throttle.js (when enabled scroll option)

## How to use it?
> Import a localSaveDataKit.js
```html
<script src="localSaveDataKit.js"></script>
```

> Add ``localSaveData`` class to the object you want to save data. ``id`` attribute can like customize.

Case 1) ul > li > a[data-value="{value}"]
```html
<ul class="localSaveData" id="ulData">
    <li class="on localSaveData-selected"><a data-value="Test">Test</a></li>
    <li class=""><a data-value="Test 2">Test 2</a></li>
    <li class=""><a data-value="Test 3">Test 3</a></li>
</ul>
```

Case 2) input[type="text"]
```html
<input type="text" id="keyword_input" class="localSaveData" placeholder="Search">
```

Case 3) select > option
```html
<select class="localSaveData" id="selectData">
    <option value="test1">test1</option>
    <option value="test2">test2</option>
</select>
```

> Initialize a localSaveDataKit.
```javascript
var localSaveDataKit = new LocalSaveDataKit({
    uniqueId: 'lsdk_store', // cookie name
    scroll: true, // When its `true` values, save a scroll position. 
    expireSeconds: 60 * 3 // 3 mins
});

// Load a data from cookie.
localSaveDataKit.init(function () {
    fetch();
});

// Whenever ajax requests, it stores the data in a cookie.
function fetch() {
    localSaveDataKit.save();
    $.ajax({ ... });
}
```

> You can also manually load and save the specific data in cookies.
```javascript
// save
localSaveDataKit.raw('cookie_name', 'value');

// load
var cookie_name = localSaveDataKit.rawGet('cookie_name'); // value
``` 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
