import { hideElement, showElement } from "./common";
import { _isFunction } from "../index";
import { GAME_LOCALE } from "../../constants";

function StartBtn(element) {
  this.btnElement = element;

  this.setCaption = function (text) {
    this.btnElement.innerText = text;
  };

  this.setup = function ({ startOnClick }) {
    console.log("hi", this.btnElement);

    this.setCaption(GAME_LOCALE.START_BTN_CAPTION);
    if (this.btnElement) {
      this.btnElement.addEventListener("click", () => {
        if (_isFunction(startOnClick)) {
          startOnClick();
        }

        hideElement(this.btnElement);
      });
    }
  };

  this.show = function () {
    showElement(this.btnElement);
    this.setCaption(GAME_LOCALE.RESTART_BTN_CAPTION);
  };

  this.hide = function () {
    hideElement(this.btnElement);
  };
}

StartBtn.getStartButton = function () {
  if (!StartBtn.btn) {
    StartBtn.btn = new StartBtn(document.getElementById("start"));
  }

  return StartBtn.btn;
};

export default StartBtn;
