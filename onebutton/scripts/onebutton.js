// main extension logic
jQuery(function () {
  const lineClicker = new LineClicker();
  const scrollButtons = new ScrollButtons();

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
    }, 1000);
  })

  $(scrollButtons.scrollDownButton).on("click", function (e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $(document).scrollTop() + delta,
    }, 1000);
  })
})

// Helper Classes
class ScrollButtons {
  constructor () {
    this.scrollButtonsContainer = $("<div id='scroll_buttons'></div>");
    this.scrollUpButton = $("<button id='scroll_up'>up</button>");
    this.scrollDownButton = $("<button id='scroll_down'>down</button>");

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