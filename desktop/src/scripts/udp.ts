'use strict'

//const dgram = require('dgram')
const dgram = window.require('electron').remote.require('dgram')

import { MidiInput } from './midi'

export interface Udp {
  stack: string[]
  port: number | null
  options: {
    default: number
  }
  start: () => void
  clear: () => void
  run: () => void
  send: (arg0: string) => void
  play: (arg0: string) => void
  select: (arg0: string | number) => void
  server: Socket
  listener: Socket
}

function udp(this: Udp, app: any) {
  this.stack = []
  this.port = null
  this.options = { default: 49161 }

  this.start = function () {
    this.select(this.options.default)
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.play(this.stack[id])
    }
  }

  this.send = function (msg) {
    this.stack.push(msg)
  }

  this.play = function (data) {
    this.server.send(Buffer.from(`${data}`), this.port, app.io.ip, (err: Error) => {
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

  this.server = dgram.createSocket('udp4')
  this.listener = dgram.createSocket('udp4')

  // Input

  this.listener.on('message', (msg: string, rinfo: string) => {
    // app.commander.trigger(`${msg}`, false)
  })

  this.listener.on('listening', () => {
    const address = this.listener.address()
    console.log(`UDP Listening: ${address.address}:${address.port}`)
  })

  this.listener.on('error', (err: Error) => {
    console.warn(`Server error:\n ${err.stack}`)
    this.listener.close()
  })

  this.listener.bind(49160)
}


module.exports = udp