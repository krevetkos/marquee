class Marquee {
  constructor(tester, etalon, container, speed, step) {
    this.text_container = tester;
    this.tester = tester.clientWidth;
    this.etalon = etalon.clientWidth;
    this.text = tester.innerText;
    this.container = container;
    this.right_point = etalon.getBoundingClientRect().right;
    this.left_point = etalon.getBoundingClientRect().left;
    this.speed = speed;
    this.step = step;
  }
  elements_quantity = 0;
  elements_collection = [];
  items = null;
  active = false;
  active_new = false;
  new_text = false;
  change = false;
  getElementsQuantity = function () {
    this.elements_quantity = Math.floor(this.etalon / this.tester) + 2;
  };
  makeInitialLines = function () {
    for (let i = 0; i < this.elements_quantity; i++) {
      let element = document.createElement('DIV');
      element.classList.add('line');
      element.classList.add('crossed');
      element.innerText = this.text;
      element.style.left = this.etalon + 10 + 'px';
      this.container.appendChild(element);
    }
  };

  changeText = function (text) {
    if (text.trim() === this.text.trim()) {
      return;
    }
    this.text_container.innerText = text;
    this.tester = this.text_container.clientWidth;
    this.getElementsQuantity();
    this.change = !this.change;
    this.new_text = !this.new_text;
  };

  start = function () {
    this.getElementsQuantity();
    this.makeInitialLines();
    this.elements_collection = document.getElementsByClassName('line');
    setInterval(() => {
      if (!this.items) {
        this.items = [];
        for (let i = 0; i < this.elements_collection.length; i++) {
          this.items.push(this.elements_collection[i]);
        }
      }
      if (!this.active) {
        this.items[0].classList.toggle('active');
        this.active = !this.active;
      }
      if (this.active_new) {
        for (let i = 0; i < this.items.length; i++) {
          if (!this.items[i].classList.contains('active')) {
            this.items[i].classList.toggle('active');
            this.active_new = false;
            break;
          }
        }
      }
      for (let i = 0; i < this.items.length; i++) {
        if (
          this.items[i].classList.contains('active') &&
          this.items[i].getBoundingClientRect().right > this.left_point
        ) {
          this.items[i].style.left =
            Number(this.items[i].style.left.slice(0, -2)) - this.step + 'px';
          if (
            !this.active_new &&
            this.items[i].classList.contains('crossed') &&
            Math.floor(this.items[i].getBoundingClientRect().right) >
              this.right_point - this.step &&
            Math.floor(this.items[i].getBoundingClientRect().right) <
              this.right_point + this.step
          ) {
            this.items[i].classList.toggle('crossed');
            this.active_new = !this.active_new;
          }
        } else if (
          this.items[i].classList.contains('active') &&
          this.items[i].getBoundingClientRect().right < this.left_point
        ) {
          this.items[i].classList.toggle('active');
          this.items[i].classList.toggle('crossed');
          this.items[i].style.left = this.etalon + 10 + 'px';
        }
      }
      if (this.new_text) {
        if (this.elements_quantity > this.items.length || this.change) {
          if (this.elements_quantity > this.items.length) {
            for (
              let i = 0;
              i < this.elements_quantity - this.items.length;
              i++
            ) {
              let element = document.createElement('DIV');
              element.classList.add('line');
              element.classList.add('crossed');
              element.innerText = this.text;
              element.style.left = this.etalon + 10 + 'px';
              this.container.appendChild(element);
              this.items.push(element);
            }
          }
          if (this.change) {
            let to_change = this.items.find((element) => {
              return (
                !element.classList.contains('active') &&
                element.innerText.trim() !==
                  this.text_container.innerText.trim()
              );
            });
            if (to_change) {
              to_change.innerText = this.text_container.innerText;
            }
            let kep_change = this.items.find((element) => {
              return (
                element.innerText.trim() !==
                this.text_container.innerText.trim()
              );
            });
            if (!kep_change) {
              this.new_text = !this.new_text;
              this.change = !this.change;
            }
          }
        }

      }
    }, this.speed);
  };
}

const tester = document.getElementById('tester');
const etalon = document.getElementById('container');
const container = document.getElementById('inner-container');

const marquee = new Marquee(tester, etalon, container, 25, 4);

marquee.start();

const input = document.getElementsByClassName('change-text');

input[0].addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    marquee.changeText(e.target.value);
  }
});
