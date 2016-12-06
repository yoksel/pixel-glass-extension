var currents = {
  maket: localStorage.maket ? localStorage.maket : maketsList[0],
  blendMode: localStorage.blendMode ? localStorage.blendMode : blendModesList[0],
  opacity: localStorage.opacity ? localStorage.opacity : 0.2,
  state: localStorage.state ? localStorage.state : statesList[0],
  bodyClass: {
    maket: '',
    blendMode: '',
    state: ''
  }
};

//---------------------------------------------

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  var itemName = '';

  if ( request.getCurrents ) {
    sendResponse({ currents: currents });
  }
  else if (request.setBodyClass ) {
    itemName = 'maket';

    if ( request.setBodyClass.blendMode ) {
      itemName = 'blendMode';
    }
    else if ( request.setBodyClass.state ) {
      itemName = 'state';
    }

    currents[itemName] = request.setBodyClass[ itemName ];
    localStorage[itemName] = currents[itemName];

    setBodyClass( itemName );

    sendResponse({farewell: "Set current maket"});
  }
  else if (request.setGlassStyle) {
    var opacity = request.setGlassStyle.opacity;
    glassElem.setAttribute('style', 'opacity: ' + opacity);
    currents.opacity = opacity;
    localStorage.opacity = currents.opacity;
    sendResponse({farewell: "Set opacity"});
  }

});

//---------------------------------------------

var doc = document;
var maketsSelector = doc.querySelector('.maket-selector');
var url = document.location.pathname;
var pageId = url === '/' ? 'index' : url.slice(1, -5);

if ( pageId === 'gallery' ) {
  pageId = 'photo';
}

var style = document.createElement('style');
document.head.appendChild(style);

// Add glass
var bodyFirstChild = document.body.firstChild;
var glassElem = document.createElement('div');
var glassElemClass = 'maket-glass';
glassElem.setAttribute('style', 'opacity: ' + currents.opacity);
glassElem.classList.add(glassElemClass);
document.body.insertBefore(glassElem, bodyFirstChild);

// Set class with maket to body
setBodyClass();

// Add styles for background images
maketsList.forEach( function(item, i, arr){
  setBgImgs( item );
});

// Functions
// ------------------------------------------

function setBgImgs( maketItem ) {
  var screenSizes = {
    'mobile': '',
    'tablet': '768px',
    'desktop': '1200px',
  };

  if ( screens && screens[ maketItem ]) {
    screenSizes = screens[ maketItem ];
  }

  var imgUrlBegin = maketItem + "-" + pageId;
  var bodyClass = '.' + getBodyClass('maket', maketItem);
  var styleStrings = [];

  for (var type in screenSizes) {
    var width = screenSizes[type];
    var url = 'img/' + maketItem + '/' + imgUrlBegin + '-' + type +'.jpg';
    var imgURL = chrome.extension.getURL( url );
    var bgiStr = 'background-image: url(' + imgURL + ');';
    var styleStr = bodyClass + ' .' + glassElemClass +'  { ' + bgiStr + ' }';

    if ( width ) {
      styleStr = '@media ( min-width: ' + width + ' ) { ' + styleStr + ' }';
    }
    styleStrings.push( styleStr );
  }

  style.innerHTML += styleStrings.join('\n');
}

// ------------------------------------------

function getBodyClass( key, item ) {
  item = item ? item : currents[ key ];
  currents.bodyClass[ key ] = 'page--' + key + '-' + item;
  return currents.bodyClass[ key ];
}

// ------------------------------------------

function setBodyClass( key ) {

  if ( !key ){
    var keys = Object.keys( currents.bodyClass );
    keys.forEach(function( item ) {
      addClass( item );
    });
    return;
  }

  if ( currents.bodyClass[ key ] ) {
    doc.body.classList.remove( currents.bodyClass[ key ] );
    addClass( key );
  }
}

//---------------------------------------------

function resetBodyClass() {
  var keys = Object.keys( currents.bodyClass );
  keys.forEach(function( item ) {
    doc.body.classList.remove( currents.bodyClass[ item ] );
  });
  return;
}

//---------------------------------------------

function setBodyState() {
  doc.body.dataset.state = currents.state;
}

// ------------------------------------------

function addClass( key ) {
  var newBodyClass = getBodyClass( key );
  document.body.classList.add( newBodyClass );
}
