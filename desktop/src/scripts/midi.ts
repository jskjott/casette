interface IncomingMidi {
  channel: number
  octave: number
  note: string
  velocity: number
  length: number
}

export interface MidiInput {
  channel: number
  octave: number
  note: number
  velocity: number
  length: number
}

interface Device {
  name: string
}

export interface Midi {
  index: number
  devices: Device[]
  stack: MidiInput[]
  start: () => void
  clear: () => void
  run: () => void
  send: (arg0: IncomingMidi) => void
  set: (arg0: MidiInput, arg1: Device) => void
  select: (id: number) => Device | void
  device: () => Device
  list: () => Device[]
  next: () => void
  setup: () => void
  access: (arg0: WebMidi.MIDIAccess) => void
  toString: () => string
}

function midi(this: Midi, app: any) {

  this.index = 0
  this.devices = []
  this.stack = []

  this.start = function () {
    console.info('Starting Midi..')
    this.setup()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    for (const id in this.stack) {
      this.set(this.stack[id], this.device())
    }
  }

  // Midi

  this.send = function ({ channel, octave, note, velocity, length }) {
    let noteNumber = []
    let convertedNote 
    convertedNote = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].indexOf( note )
    
    let msg = Object.assign({}, { channel, octave, note: convertedNote, velocity, length })
    this.stack.push(msg)
  }

  this.set = (data: MidiInput, device: any) => {
    const channel = convertChannel(data.channel)
    const note = convertNote(data.octave, data.note)
    const velocity = data.velocity > 127 || data.velocity < 0 ? 60: data.velocity
    const length = window.performance.now() + convertLength(data.length, 1)

    if (!device) { console.warn('No midi device!'); return }
    device.send([channel[0], note, velocity]) 
    device.send([channel[1], note, velocity], length)
  }

  this.select = function (id: number) {
    if (this.devices[id] !== undefined) {
      this.index = id
      // this.update()
      console.log(`Midi Device: ${this.device().name}`)
      return this.device()
    }
  }

  this.device = function () {
    return this.devices[this.index]
  }

  this.list = function () {
    return this.devices
  }

  this.next = function () {
    this.select((this.index + 1) % this.devices.length)
  }

  // Setup

  this.setup = function () {
    if (!navigator.requestMIDIAccess) { return }
    navigator.requestMIDIAccess({ sysex: false }).then(this.access, (err) => {
      console.warn('No Midi', err)
    })
  }

  this.access = function (midiAccess) {
    const iter = midiAccess.outputs.values()
    for (let i = iter.next(); i && !i.done; i = iter.next()) {
      app.io.midi.devices.push(i.value)
    }
    app.io.midi.select(0)
  }

  this.toString = function () {
    return this.devices.length > 0 ? `${this.devices[this.index].name}` : 'No Midi'
  }

  function convertChannel(id: number) {
    return [0x90 + id, 0x80 + id]
  }

  function convertNote(octave: number, note: number) {
    return 24 + (octave * 12) + note // 60 = C3
  }

  function convertLength(val: number, bpm: number) {
    // [ 1 = (1/16) ] ~> 
    // [ 8 = (8/16) or half bar ] ~> 
    // [ 16 = (16/16) or full bar. ]
    // return (60000 / bpm) * (val / 16)
    if (!bpm) {
      bpm = 120
    }
    return (60000 / bpm) * (val / 16)
  }

  function clamp(v: number, min: number, max: number) { return v < min ? min : v > max ? max : v }
}

module.exports = midi