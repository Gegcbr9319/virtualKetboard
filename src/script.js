import key from './keys.js';
import special from './special_keys.js';

/*function newElement(element, className) {
  let item;
  if (!element) item = document.createElement('div');
  else item = document.createElement(element);
  if (!className) return item;
  item.classList.add(className);
  return item;
}*/
class VirtualKeyboard {
  constructor() {
    this.element = null,
      this.textarea = null,
      this.state = {
        isShiftLeftPressed: !1,
        isShiftRightPressed: !1,
        isCapsLockPressed: !1,
        case: 'shiftOff',
        lang: 'eng',
      },
      this.current = {
        element: null,
        code: null,
        event: null,
        char: null,
      },
      this.previous = {
        element: null,
        code: null,
        event: null,
        char: null,
      };
  }

  createDocumentWraper(key) {
    document.body.classList.add('body');
    const DIV = document.createElement('div');
    DIV.classList.add('centralizer');
    const TITTLE = document.createElement('p');
    TITTLE.innerText = 'Виртуальная клавиатура';
    TITTLE.classList.add('title');
    DIV.append(TITTLE);
    const TEXT = document.createElement('textarea');
    TEXT.classList.add('textarea');
    TEXT.id = 'textarea';
    TEXT.setAttribute('rows', '5');
    TEXT.setAttribute('cols', '50');
    this.textarea = TEXT;
    DIV.appendChild(this.textarea);
    this.element = document.createElement('div');
    this.element.setAttribute('class', '');
    this.element.classList.add('keyboard');
    this.element.id = 'keyboard';
    const create_DOCUMENT = document.createDocumentFragment();
    for (let i = 0; i < key.length; i++) {
      const ROW = document.createElement('div');
      ROW.classList.add('row');
      for (let f = 0; f < key[i].length; f++) {
        const KEY = document.createElement('div');
        KEY.classList.add('key', key[i][f].code);
        const SPAN_RU = document.createElement('span');
        SPAN_RU.classList.add('rus', 'hidden'),
          SPAN_RU.insertAdjacentHTML('afterbegin', `<span class = "shiftOff hidden">${key[i][f].rus.shiftOff}</span>`),
          SPAN_RU.insertAdjacentHTML('beforeEnd', `<span class = "shiftOn hidden">${key[i][f].rus.shiftOn}</span>`),
          SPAN_RU.insertAdjacentHTML('beforeEnd', `<span class = "caps hidden">${key[i][f].rus.caps || key[i][f].rus.shiftOn}</span>`),
          SPAN_RU.insertAdjacentHTML('beforeEnd', `<span class = "shiftAndCaps hidden">${key[i][f].rus.shiftAndCaps || key[i][f].rus.shiftOff}</span>`),
          KEY.appendChild(SPAN_RU);
        const SPAN_EN = document.createElement('span');
        SPAN_EN.classList.add('eng'),
          SPAN_EN.insertAdjacentHTML('afterbegin', `<span class = "shiftOff">${key[i][f].eng.shiftOff}</span>`),
          SPAN_EN.insertAdjacentHTML('beforeEnd', `<span class = "shiftOn hidden">${key[i][f].eng.shiftOn}</span>`),
          SPAN_EN.insertAdjacentHTML('beforeEnd', `<span class = "caps hidden">${key[i][f].eng.caps || key[i][f].eng.shiftOn}</span>`),
          SPAN_EN.insertAdjacentHTML('beforeEnd', `<span class = "shiftAndCaps hidden">${key[i][f].eng.shiftAndCaps || key[i][f].eng.shiftOff}</span>`),
          KEY.appendChild(SPAN_EN),
          ROW.appendChild(KEY);

      }
      create_DOCUMENT.appendChild(ROW);
    }
    this.element.appendChild(create_DOCUMENT), DIV.appendChild(this.element);
    const INFO = document.createElement('p');
    INFO.innerText = 'Клавиатура для Windows';
    INFO.classList.add('description');
    DIV.appendChild(INFO);
    const LANG = document.createElement('p');
    LANG.innerText = 'Переключить язык левый ctrl + alt';
    LANG.classList.add('language');
    DIV.appendChild(LANG);
    document.body.appendChild(DIV);
  }
  addActive() {
    this.current.element.classList.add('active');
  }
  removeActive() {
    this.current.element && (this.previous.element && this.previous.element.classList.contains('active') && (['CapsLock', 'ShiftLeft', 'ShiftRight'].includes(this.previous.code) || this.previous.element.classList.remove('active')),
      this.current.element.classList.remove('active'));
  }
  toggleCase() {
    const ELEM = this.element.querySelectorAll(`div>.${this.state.lang}`);
    for (let i = 0; i < ELEM.length; i++) {
      ELEM[i].querySelectorAll('span')[0].classList.contains('hidden') || ELEM[i].querySelectorAll('span')[0].classList.add('hidden');
      ELEM[i].querySelectorAll('span')[1].classList.contains('hidden') || ELEM[i].querySelectorAll('span')[1].classList.add('hidden');
      ELEM[i].querySelectorAll('span')[2].classList.contains('hidden') || ELEM[i].querySelectorAll('span')[2].classList.add('hidden');
      ELEM[i].querySelectorAll('span')[3].classList.contains('hidden') || ELEM[i].querySelectorAll('span')[3].classList.add('hidden');
      (
        this.state.isShiftLeftPressed || this.state.isShiftRightPressed) && this.state.isCapsLockPressed ?
        (
          ELEM[i].querySelectorAll('span')[3].classList.remove('hidden'),
          this.state.case = 'shiftCaps') :
        this.state.isCapsLockPressed ?
          (
            ELEM[i].querySelectorAll('span')[2].classList.remove('hidden'),
            this.state.case = 'caps'
          ) :
          this.state.isShiftLeftPressed || this.state.isShiftRightPressed ?
            (
              ELEM[i].querySelectorAll('span')[1].classList.remove('hidden'),
              this.state.case = 'caseUp'
            ) :
            (
              ELEM[i].querySelectorAll('span')[0].classList.remove('hidden'),
              this.state.case = 'caseDown');
    }
  }
  toggleLang() {
    const FUNC = function () {
      const FUNC = this.element.querySelectorAll(`div>.${this.state.lang}`);
      for (let i = 0; i < FUNC.length; i++) {
        FUNC[i].classList.toggle('hidden');
        FUNC[i].querySelectorAll(`span.${this.state.case}`)[0].classList.toggle('hidden');
      }
    }.bind(this);
    FUNC(),
      this.state.lang === 'eng' ?
        this.state.lang = 'rus' :
        this.state.lang = 'eng',
      localStorage.setItem('lang', this.state.lang),
      FUNC();
  }
  implementKey() {
    let TextArea = this.textarea.value;
    const selectionStart = this.textarea.selectionStart;
    const f = function () {
      selectionStart >= 0 && selectionStart <= TextArea ?
        (this.textarea.value = TextArea.slice(0, selectionStart) + this.current.char + TextArea.slice(selectionStart, TextArea.length),
          this.textarea.selectionStart = selectionStart + this.current.char.length,
          this.textarea.selectionEnd = selectionStart + this.current.char.length) :
        this.textarea.value += this.current.char;
    }.bind(this);
    if (special.includes(this.current.code)) {
      switch (this.current.code) {
        case 'Backspace':
          selectionStart > 0 && selectionStart <= TextArea.length && (TextArea = TextArea.slice(0, selectionStart - 1) + TextArea.slice(selectionStart, TextArea.length),
            this.textarea.value = TextArea,
            this.textarea.selectionStart = selectionStart - 1,
            this.textarea.selectionEnd = selectionStart - 1);
          break;
        case 'Delete':
          selectionStart >= 0 && selectionStart <= TextArea.length - 1 && (TextArea = TextArea.slice(0, selectionStart) + TextArea.slice(selectionStart + 1, TextArea.length),
            this.textarea.value = TextArea,
            this.textarea.selectionStart = selectionStart,
            this.textarea.selectionEnd = selectionStart);
          break;
        case 'Tab':
          this.current.char = '\\t', f();
          break;
        case 'Enter':
          this.current.char = '\\n', f();
          break;
        case 'CapsLock':
          this.state.isCapsLockPressed && !this.current.event.repeat ?
            (
              this.removeActive(),
              this.state.isCapsLockPressed = !1) :
            (
              this.addActive(),
              this.state.isCapsLockPressed = !0),
            this.toggleCase();
          break;
        case 'ShiftLeft':
          this.state.isShiftLeftPressed || this.state.isShiftRightPressed || (this.addActive(), this.state.isShiftLeftPressed = !0, this.toggleCase());
          break;
        case 'ShiftRight':
          this.state.isShiftRightPressed || this.state.isShiftLeftPressed || (this.addActive(), this.state.isShiftRightPressed = !0, this.toggleCase());
      }
    } else f();
    this.current.event.ctrlKey && this.current.event.altKey && this.toggleLang();
  }
  keyDownHandler(key) {
    key.preventDefault(),
      this.current.event = key,
      this.current.code = key.code, [this.current.element] = this.element.getElementsByClassName(key.code),
      this.current.element && (this.current.char = this.current.element.querySelectorAll(':not(.hidden)')[1].textContent,
        this.implementKey(),
        this.current.code === 'MetaLeft' ?
          (
            this.addActive(),
            setTimeout(this.removeActiveState.bind(this), 300)) : ['CapsLock', 'ShiftLeft', 'ShiftRight'].includes(this.current.code) || this.addActive());
  }

  keyUpHandler(key) {
    const q = this.element.getElementsByClassName(key.code)[0];
    q && (this.current.element = q.closest('div'), key.code !== 'CapsLock' && this.removeActive(), key.code !== 'ShiftLeft' && key.code !== 'ShiftRight' || (key.code === 'ShiftLeft' ?
      (
        this.state.isShiftLeftPressed = !1, this.removeActive()) :
      key.code === 'ShiftRight' && (this.state.isShiftRightPressed = !1, this.removeActive()),
      this.toggleCase()));
  }
  mouseDownHandler(key) {
    key.target.tagName === 'SPAN' && (this.current.event = key, this.current.element = key.target.closest('div'), [, , this.current.code] = this.current.element.classList, this.current.char = key.target.textContent, this.implementKey(), this.current.code !== 'CapsLock' && this.addActive(), this.previous = { ...this.current }, key.preventDefault());
  }
  mouseUpHandler(key) {
    this.current.event = key,
      this.current.element = key.target.closest('div'),
      this.current.element && (this.current.element.classList.contains('key') ? [, , this.current.code] = this.current.element.classList : this.current = { ...this.previous }, this.current.code !== 'CapsLock' && (this.removeActive(), this.state.isShiftLeftPressed && this.current.code === 'ShiftLeft' && (this.state.isShiftLeftPressed = !1, this.toggleCase()), this.state.isShiftRightPressed && this.current.code === 'ShiftRight' && (this.state.isShiftRightPressed = !1, this.toggleCase())));
  }
  initLanguage() { localStorage.lang === 'rus' && this.toggleLang(); }

  initKeyboard(key) { this.createDocumentWraper(key), this.initLanguage(), document.addEventListener('keyup', this.keyUpHandler.bind(this)), document.addEventListener('keydown', this.keyDownHandler.bind(this)), document.addEventListener('mouseup', this.mouseUpHandler.bind(this)), this.element.addEventListener('mousedown', this.mouseDownHandler.bind(this)); }   

}
const virtualKeyboard = new VirtualKeyboard();
virtualKeyboard.initKeyboard(key);
//virtualKeyboard.createDocumentWraper(key);
