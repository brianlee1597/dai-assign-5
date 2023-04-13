// main extension logic
jQuery(function () {
  const lineClicker = new LineClicker();
  const scrollButtons = new ScrollButtons();
  const keyboard = new SoftwareKeyboard();

  // line clicker function
  $(document).on("keydown", function (e) {
    e.preventDefault();

    if (e.key == " ") {
      e.stopPropagation();
      lineClicker.execute();
    }
  });

  // scroll buttons functions
  const delta = $(document).height() / 10;

  $(scrollButtons.scrollUpButton).on("click", function (e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $(document).scrollTop() - delta,
    }, 500);
  })

  $(scrollButtons.scrollDownButton).on("click", function (e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $(document).scrollTop() + delta,
    }, 500);
  })

  // keyboard click functions
  $("input[type='text'], textarea").on("focus", function(e) {
    keyboard.input = this;
  })

  $("input[type='text'], textarea").on("focusout", function(e) {
    keyboard.input = null;
  })

  $.get("https://sarahmorrisonsmith.com/accessibility/keyboard.html", function (data) {
    $("body").append(data);
    $('.keyboard').hide();

    $('.key').on("mousedown", function (e) {
      e.preventDefault() //prevents focus
    })

    $('.key').on("click", function (e) {
      e.preventDefault();

      const focused = keyboard.input;
      let innerText = $(this).text().replace(/[\s\n]+/g, "");

      if (innerText === "CapsLock") {
        keyboard.capsLock = !keyboard.capsLock;
        return;
      }

      if (!keyboard.capsLock) {
        innerText = innerText.toLowerCase();
      }

      switch (innerText) {
        case "backspace":
          $(focused).val($(focused).val().slice(0, $(focused).val().length - 1));
          break;
        case "enter":
          $(focused).val($(focused).val() + "\n");
          break;
        default: 
          $(focused).val($(focused).val() + innerText);
      }
    })
  });

  $(keyboard.keyboardShowHide).on("click", function (e) {
    e.preventDefault();

    $('.keyboard')[keyboard.showKeyboard ? "hide" : "show"]();
    keyboard.showKeyboard = !keyboard.showKeyboard;
  })
})

// Helper Classes
class SoftwareKeyboard {
  constructor () {
    this.input = null;
    this.showKeyboard = false;
    this.capsLock = false;
    this.keyboardShowHide = $("<button id='keyboard'>keyboard</button>");
    $("#scroll_buttons").append(this.keyboardShowHide);
  }
}

class ScrollButtons {
  constructor () {
    this.scrollButtonsContainer = $("<div id='scroll_buttons'></div>");
    this.scrollUpButton = $("<button id='scroll_up'>scroll up</button>");
    this.scrollDownButton = $("<button id='scroll_down'>scroll down</button>");

    $("body").append(this.scrollButtonsContainer);
    $("#scroll_buttons").append(this.scrollUpButton);
    $("#scroll_buttons").append(this.scrollDownButton);
  }
}

class LineClicker {
  constructor () {
    this.state = 0;
    this.horizontal = $("<div id='horizontal_line'></div>");
    this.vertical = $("<div id='vertical_line'></div>");

    $("body").append(this.horizontal);
    $("body").append(this.vertical);
  }

  #animateVertical () {
    this.vertical.animate({
      "left": "100%",
    }, 10000);
  }

  #animateHorizontal () {
    this.vertical.stop();
    this.horizontal.animate({
      "top": "100%",
    }, 10000);
  }

  #clickAndReset () {
    this.horizontal.stop();
    this.#simulateClick();
    $(this.horizontal).css("top", "0");
    $(this.vertical).css("left", "0");
    this.state = 0;
  }

  #simulateClick () {
    const x = $(this.vertical).position().left;
    const y = $(this.horizontal).position().top;
    const elementToClick = document.elementFromPoint(x , y);

    if (!elementToClick) return;

    function dispatchEvent (elt, name) {
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(name, true, true);
        elt.dispatchEvent(clickEvent);
    }

    dispatchEvent(elementToClick, "mouseover");
    dispatchEvent(elementToClick, "mousedown");
    dispatchEvent(elementToClick, "click");
  }

  execute () {
    switch (++this.state) {
      case 1: this.#animateVertical();
        break;
      case 2: this.#animateHorizontal();
        break;
      case 3: this.#clickAndReset();
        break;
      default: null;
    }
  }
}