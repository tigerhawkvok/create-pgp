###
# As per
# https://github.com/openpgpjs/openpgpjs
###

defaultQuerySelector = "#query-keyserver"
defaultMessageSelector = "#plaintext-message"
defaultKeySelector = "#public-key"
defaultOutputSelector = "#ciphertext-message"

openpgp = window.openpgp

workerConfig =
  path: "openpgp.worker.min.js"

openpgp.initWorker workerConfig

openpgp.config.aead_protect = true

doEncrypt = (messageSelector = defaultMessageSelector, keySelector = defaultKeySelector, outputSelector = defaultOutputSelector) ->
  publicKey = $(keySelector).val()
  unless publicKey?
    failCleanup "Please input a public key"
  options =
    data: $(messageSelector).val()
    publicKeys: openpgp.key.readArmored(publicKey).keys
  openpgp.encrypt(options).then (ciphertext) ->
    message = ciphertext.data
    if message?
      unless $(outputSelector).length > 0
        
        html = """
        <textarea id="#{outputSelector.slice(1)}" class="form-control #{outputSelector.slice(1)}" readonly>
        </textarea>
        """
        $("#ciphertext-container").append html
      $(outputSelector).val message
      successCleanup()
    else
      # Alert it
      message = "Couldn't encrypt message"
      failCleanup message, outputSelector
      false
  false

lookupKeyFromKeyServer = (keyserver = "https://pgp.mit.edu", querySelector = defaultQuerySelector, keySelector = defaultKeySelector) ->
  hkp = new openpgp.HKP keyserver
  options =
    query: $(querySelector).val()
  hkp.lookup(options).then (key) ->
    publicKey = openpgp.key.readArmored key
    if publicKey?
      $(keySelector).val(publicKey)
      successCleanup()
    else
      # Alert it
      message = "Couldn't fetch public key"
      failCleanup message
      false
  false


successCleanup = ->
  $(".alert").remove()
  false


failCleanup = (message, outputSelector = defaultOutputSelector) ->
  $(outputSelector).remove()
  $(".alert").remove()
  if message?
    # Alert it
    html = """
    <div class="alert alert-error">
      #{message}
    </div>
    """
    $("#message-container").prepend html
  false

$ ->
  ###
  # Setup bindings
  ###
  $("#init-encrypt").click ->
    doEncrypt()
