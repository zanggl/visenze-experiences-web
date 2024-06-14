function insert(element) {
  var styles = document.querySelector('#vi__nui_tw_styles');
  if (!styles) {
    const div = document.createElement('div');
    div.id = 'visenze';
    div.attachShadow({ mode: 'open' });
    document.head.appendChild(div);
    element.id = 'vi__nui_tw_styles';
    div.shadowRoot.appendChild(element);
  } else if (element.innerHTML) {
    styles.innerHTML = element.innerHTML;
  }
}

module.exports = insert;
