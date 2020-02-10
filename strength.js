(function($, window, document, undefined) {
  let pluginName = "strength",
    defaults = {
      shownClass: "shown-element", // Specify the button to show or hide the password style
      showText: "Show Password",
      hideText: "Hide Password"
    };

  /**
   * Initial plugin constructor
   *
   * @param {*} element - The element (input-password) that request to use the plugin
   * @param {Object} options - The options to init the plugin (show documentation)
   */
  function Plugin(element, options) {
    this.element = element;
    this.$elem = $(this.element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      /**
       * Specify the password strength level
       *
       * @param {String} passwordValue - The current password value into input
       * @param {String} idElement - The element id that uses the plugin
       */
      function checkStrength(passwordValue) {
        const level = passwordValue.length > 0 ? zxcvbn(passwordValue).score : -1;

        $("#strength-text").html("");
        $("#strength-color").removeClass();

        switch (level) {
          case 0:
          case 1:
            $("#strength-color").addClass("very-weak");
            $("#strength-text").html("Very Weak");
            break;

          case 2:
            $("#strength-color").addClass("weak");
            $("#strength-text").html("Weak");
            break;

          case 3:
            $("#strength-color").addClass("medium");
            $("#strength-text").html("Medium");
            break;

          case 4:
            $("#strength-color").addClass("strong");
            $("#strength-text").html("Strong");
            break;
            default:
        }
      }

      const idElement = this.$elem.attr("id");
      let isShown = false;

      let shownText = `<a href="" class="${this.options.shownClass}">${this.options.showText}</a>`;

      this.$elem.after(
        `
          <div class="strength_meter">
            <div id="strength-color">
              <p id="strength-text"></p>
            </div>
          </div>

          <div class="info-password">${shownText}</div>
        `
      );

      /**
       * This event capture the new input password
       */
      this.$elem.bind("keyup", () => {
        checkStrength($("#" + idElement).val());
      });

      /**
       * This event change the input password type [show..hidden]
       */
      $(document.body).on("click", "." + this.options.shownClass, e => {
        e.preventDefault();

        if (isShown) {
          $("#" + idElement).prop("type", "password");
          $("." + this.options.shownClass).html(this.options.showText);
          isShown = false;
        } else {
          $("#" + idElement).prop("type", "text");
          $("." + this.options.shownClass).html(this.options.hideText);
          isShown = true;
        }
      });
    }
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName))
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
    });
  };
})(jQuery, window, document);
