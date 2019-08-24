//const osc = require('node-osc')
const osc = window.require('electron').remote.require('node-osc')

import { MidiInput } from './midi'

export interface Osc {
  stack: { path: string, msg: string}[]
  port: number | null
  options: {
    default: number
    tidalCycles: number
    superCollider: number
    sonicPi: number
  }
  start: () => void
  clear: () => void
  run: () => void
  send: (arg0: string, arg1: string) => void
  play: (arg0: { path: string, msg: string}) => void
  select: (arg0: string | number) => void
  setup: () => void
  client: {
    send: (arg0: [], err: (arg0: Error) => void ) => void
    close: () => void
  }
}

function OSC (this: Osc, app: any) {
  this.stack = []
  this.port = null

  // TODO make this configurable.
  this.options = { 
    default: 49162, 
    tidalCycles: 6010, 
    superCollider: 57120, 
    sonicPi: 4559 
  }

  this.start = function () {
    console.info('OSC', 'Starting..')
    this.setup()
    this.select(this.options.superCollider)
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (path, msg) {
    console.log('send osc', msg)
    this.stack.push({ path, msg })
  }
  
  this.play = function ({ path, msg }) {
    if (!this.client) { console.warn('OSC', 'Unavailable client'); return }
    if (!msg) { console.warn('OSC', 'Empty message'); return }
    const oscMsg = new osc.Message(path)
    oscMsg.append(msg.split(" "))
    this.client.send(oscMsg, err => {
      if (err) { console.warn(err) }
    })
  }

  this.select = (port) => {
    if (typeof port === 'string') {
      if(parseInt(port) === this.port) { console.warn('UDP', 'Already selected'); return }
      else {
        console.info('UDP', `Selected port: ${port}`)
        this.port = parseInt(port)
      }
    } 
    if (typeof port === 'number') {
      if (isNaN(port) || port < 1000) { console.warn('UDP', 'Unavailable port'); return }
    }
  }

  this.setup = () => {
    if (!this.port) { return }
    if (this.client) { this.client.close() }
    this.client = new osc.Client(app.io.ip, this.port)
    console.info('OSC', 'Started client at ' + app.io.ip + ':' + this.port)
  }
}

module.exports = OSC