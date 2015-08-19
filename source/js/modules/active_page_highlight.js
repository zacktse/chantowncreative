// active page highlighting
function setActive() {
  var aObj = document.getElementById('js-navigation-menu').getElementsByTagName('a');
  for(var i=0;i<aObj.length;i++) {
    if(document.location.href.indexOf(aObj[i].href)>=0) {
      aObj[i].className='active';
    }
  }
}

setActive();
