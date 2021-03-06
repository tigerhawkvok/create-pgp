// Generated by CoffeeScript 1.10.0

/*
 * As per
 * https://github.com/openpgpjs/openpgpjs
 */

(function() {
  var defaultKeySelector, defaultMessageSelector, defaultOutputSelector, defaultQuerySelector, doEncrypt, failCleanup, lookupKeyFromKeyServer, openpgp, successCleanup, workerConfig;

  defaultQuerySelector = "#query-keyserver";

  defaultMessageSelector = "#plaintext-message";

  defaultKeySelector = "#public-key";

  defaultOutputSelector = "#ciphertext-message";

  openpgp = window.openpgp;

  workerConfig = {
    path: "openpgp.worker.min.js"
  };

  openpgp.initWorker(workerConfig);

  openpgp.config.aead_protect = true;

  doEncrypt = function(messageSelector, keySelector, outputSelector) {
    var options, publicKey;
    if (messageSelector == null) {
      messageSelector = defaultMessageSelector;
    }
    if (keySelector == null) {
      keySelector = defaultKeySelector;
    }
    if (outputSelector == null) {
      outputSelector = defaultOutputSelector;
    }
    publicKey = $(keySelector).val();
    if (publicKey == null) {
      failCleanup("Please input a public key");
    }
    options = {
      data: $(messageSelector).val(),
      publicKeys: openpgp.key.readArmored(publicKey).keys
    };
    openpgp.encrypt(options).then(function(ciphertext) {
      var html, message;
      message = ciphertext.data;
      if (message != null) {
        if (!($(outputSelector).length > 0)) {
          html = "<textarea id=\"" + (outputSelector.slice(1)) + "\" class=\"form-control " + (outputSelector.slice(1)) + "\" readonly>\n</textarea>";
          $("#ciphertext-container").append(html);
        }
        $(outputSelector).val(message);
        return successCleanup();
      } else {
        message = "Couldn't encrypt message";
        failCleanup(message, outputSelector);
        return false;
      }
    });
    return false;
  };

  lookupKeyFromKeyServer = function(keyserver, querySelector, keySelector) {
    var hkp, options;
    if (keyserver == null) {
      keyserver = "https://pgp.mit.edu";
    }
    if (querySelector == null) {
      querySelector = defaultQuerySelector;
    }
    if (keySelector == null) {
      keySelector = defaultKeySelector;
    }
    hkp = new openpgp.HKP(keyserver);
    options = {
      query: $(querySelector).val()
    };
    hkp.lookup(options).then(function(key) {
      var message, publicKey;
      publicKey = openpgp.key.readArmored(key);
      if (publicKey != null) {
        $(keySelector).val(publicKey);
        return successCleanup();
      } else {
        message = "Couldn't fetch public key";
        failCleanup(message);
        return false;
      }
    });
    return false;
  };

  successCleanup = function() {
    $(".alert").remove();
    return false;
  };

  failCleanup = function(message, outputSelector) {
    var html;
    if (outputSelector == null) {
      outputSelector = defaultOutputSelector;
    }
    $(outputSelector).remove();
    $(".alert").remove();
    if (message != null) {
      html = "<div class=\"alert alert-error\">\n  " + message + "\n</div>";
      $("#message-container").prepend(html);
    }
    return false;
  };

  $(function() {

    /*
     * Setup bindings
     */
    return $("#init-encrypt").click(function() {
      return doEncrypt();
    });
  });

}).call(this);
