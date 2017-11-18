/**
 * How to use:
 * const kb = new KeyBus();
 * 
 * kb.down(38, function() {
 *  do something
 * })
 */

export default class KeyBus {
  constructor(target) {
    this.target = target
    this.enableMultiKey = false

    this.simulDownListeners = {}
  }

  enableMultiKey() {
    this.enableMultiKey = true
    this.keyhash = {}
  }

  disableMultiKey() {
    this.enableMultiKey = false
    this.keyhash = null
  }

  getKeyhash() {
    return this.enableMultiKey ? this.keyhash : null
  }

  down(keyCode, cb) {
    if (this.enableMultiKey) {
      throw Error('multikey handlers should not use the "on" method of KeyBus')
      return
    }

    function keydownHandler(e) {
      if (e.keyCode === keyCode) {
        e.preventDefault()
        cb()
      }
    }

    this.target.addEventListener('keydown', keydownHandler)
    
    return {
      remove() {
        this.target.removeEventListener('keydown', keydownHandler)
      }
    }
  }

  up(keyCode, cb) {
    if (this.enableMultiKey) {
      throw Error('multikey handlers should not use the "on" method of KeyBus')
      return
    }

    function keyupHandler(e) {
      if (e.keyCode === keyCode) {
        e.preventDefault()
        cb()
      }
    }

    this.target.addEventListener('keyup', keyupHandler)

    return {
      remove() {
        this.target.removeEventListener('keydown', keyupHandler)
      }
    }
  }

  simulDown(keyCode, cb) {
    this.simulDownListeners[keyCode] ? this.simulDownListeners[keyCode] = [cb] 
      : this.simulDownListeners[keyCode].push(cb)

    function updateKeyhash(e, val) {
      if (e.keyCode === keyCode) {
        e.preventDefault()
        this.keyhash[keyCode] = val
      }
    }

    const keydownUpdate = (e) => updateKeyhash(e, true)
    const keyupUpdate = (e) => updateKeyhash(e, false)


    this.target.addEventListener('keydown', keydownUpdate)
    this.target.addEventListener('keyup', keyupUpdate)

    return {
      remove() {
        this.simulDownListeners[keyCode].splice(this.simulDownListeners[keyCode].indexOf(cb), 1)

        this.target.removeEventListener('keydown', keydownUpdate)
        this.target.removeEventListener('keyup', keyupUpdate)
      }
    }
  }

  executeMultiKeyHandlers() {
    for (let key in this.simulDownListeners) {
      if (this.keyhash[key]) {
        this.simulDownListeners[key].forEach(cb => {
          cb()
        })
      }
    }
  }
}
