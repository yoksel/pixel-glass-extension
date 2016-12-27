var popupContent = document.querySelector('.popup-content');
var currents = {};

sendMsg( 'getCurrents' );

// Add states switcher
var paramsStates = {
    listName: 'states',
    itemName: 'state',
    type: 'radio',
    list: statesList
};

// Makets switcher
var paramsMakets = {
    listName: 'makets',
    itemName: 'maket',
    type: 'radio',
    list: maketsList
};

// BlendModes switcher params
var paramsModes = {
    listName: 'blendModes',
    itemName: 'blendMode',
    type: 'radio',
    list: blendModesList
};

// Opacity range params
var paramsOpacity = {
    itemName: 'opacity',
    type: 'range',
    setAttr: 'style',
    attrs: {
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.2
    }
};

//---------------------------------------------

function sendMsg( func, key, value ) {
  var data = {};
  data[ func ] = {};

  if ( key ) {
    data[ func ][ key ] = value;
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id,
      data,
      function(response) {
        if( response && response.currents ){
          currents = response.currents;
          paramsOpacity.attrs.value = currents.opacity;

          initControls();
        }
      });
  });
}

//---------------------------------------------

function initControls() {
  createInputsSet(paramsStates);
  createInputsSet(paramsMakets);
  createInputsSet(paramsModes);
  createInputsRange(paramsOpacity);
}

//---------------------------------------------

function createInputsSet(params) {
    var listName = params.listName;
    var itemName = params.itemName;
    var type = params.type;
    var list = params.list;
    var action = params.action;

    var itemsSet = document.createElement('div');
    itemsSet.classList.add( 'popup-content__item',
                            'popup-content__item--' + listName);

    list.forEach(function(item, i, arr) {

        var id = itemName + '-' + item;
        var input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('id', id);
        input.setAttribute('name', listName);
        input.setAttribute('data-content', item);

        if (item == currents[itemName]) {
            input.setAttribute('checked', '');
        }

        var label = document.createElement('label');
        label.setAttribute('for', itemName + '-' + item);
        label.innerHTML = item;

        itemsSet.appendChild(input);
        itemsSet.appendChild(label);

        input.onclick = function() {
            var value = this.dataset.content;
            sendMsg('setBodyClass', itemName, value);

        };
    });

    popupContent.appendChild(itemsSet);
}

//---------------------------------------------

function createInputsRange(params) {
    var itemName = params.itemName;
    var attrs = params.attrs;
    var type = params.type;
    var setAttr = params.setAttr;

    var itemsSet = document.createElement('div');
    itemsSet.classList.add( 'popup-content__item',
                            'popup-content__item--' + itemName);

    var id = itemName;
    var input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('id', id);

    for (var attr in attrs) {
        input.setAttribute(attr, attrs[ attr ]);
    }
    input.setAttribute('value', currents.opacity);

    var label = document.createElement('label');
    label.setAttribute('for', itemName);
    label.innerHTML = itemName;

    itemsSet.appendChild(input);
    itemsSet.appendChild(label);

    input.oninput = function() {
        if ( setAttr === 'style'){
            sendMsg('setGlassStyle', itemName, this.value);
        }
        else {
            sendMsg('setBodyClass', itemName, this.value);

        }
    };

    popupContent.appendChild(itemsSet);
}
