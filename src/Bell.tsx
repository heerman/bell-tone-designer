import "./Bell.css"

/* Generate a bell tone with FM synthesis */
const playAudio = async () => {
    // parameters
    const CARRIER_FREQ = 440
    const MOD_FREQ = 700
    const FM_AMOUNT = 400
    const DECAY_SEC = 5

    const audioContext = new window.AudioContext()

    // carrier
    const osc = new OscillatorNode(audioContext, { frequency: CARRIER_FREQ, type: "sine" })

    // amplitude envelope
    const ampEnv = audioContext.createGain()
    const ampEnvGainParam = ampEnv.gain
    ampEnvGainParam.setValueAtTime(1, audioContext.currentTime)
    ampEnvGainParam.linearRampToValueAtTime(0, audioContext.currentTime + DECAY_SEC)

    // modulator
    const modSine = new OscillatorNode(audioContext, { frequency: MOD_FREQ, type: "sine" })

    // fm envelope: ramp amount to 0
    const modSineGain = audioContext.createGain()
    const modSineGainParam = modSineGain.gain
    modSineGainParam.setValueAtTime(FM_AMOUNT, audioContext.currentTime)
    modSineGainParam.linearRampToValueAtTime(0, audioContext.currentTime + DECAY_SEC * 0.95)

    // connect mod to carrier frequency
    modSine.connect(modSineGain)
    modSineGain.connect(osc.frequency)

    // connect carrier to audio_out
    osc.connect(ampEnv)
    ampEnv.connect(audioContext.destination)

    // start oscillators now
    osc.start()
    modSine.start()
}

function Bell() {
    return <>
        <div className="bell-icon">🔔</div>
        <button className="striker-button" onClick={playAudio}>STRIKE</button>
    </>
}

export default Bell
