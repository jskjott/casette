
const midi = require('./midi')
const udp = require('./udp')
const OSC = require('./osc')

import { Midi } from './midi'
import { Udp } from './udp'
import { Osc } from './osc'

export interface IOType {
  ip: string
  midi: Midi
  udp: Udp
  osc: Osc
  start: () => void
  clear: () => void
  run: () => void
  length: () => number
  setIp: (addr: string) => void
}

export function IO(this: IOType, app: any) {
  this.ip = '127.0.0.1'
  this.midi = new midi(app)
  this.osc = new OSC(app)
  this.udp = new udp(app)

  this.start = function () {
    this.clear()
    this.midi.start()
    this.udp.start()
    this.osc.start()
  }

  this.clear = function () {
    this.midi.clear()
    this.udp.clear()
    this.osc.clear()
  }

  this.run = function () {
    this.midi.run()
    this.udp.run()
    this.osc.run()
  }

  this.length = function () {
    return this.midi.stack.length + this.udp.stack.length + this.osc.stack.length
  }

  this.setIp = function (addr) {
    if (validateIP(addr) !== true) { console.warn('io', 'Invalid IP'); return }
    this.ip = addr
  }

  function validateIP(addr: string) { return !!(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr)) }
}
