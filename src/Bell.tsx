import React, { useState } from "react"
import "./Bell.css"

function Bell() {
    const [wobbling, setWobbling] = useState(false)
    const [carrierFreq, setCarrierFreq] = useState(440)
    const [modFreq, setModFreq] = useState(700)
    const [fmAmount, setFmAmount] = useState(400)

    /* Generate a bell tone with FM synthesis */
    const playAudio = () => {
        const DECAY_SEC = 5
        const audioContext = new window.AudioContext()

        // carrier
        const osc = new OscillatorNode(audioContext, { frequency: carrierFreq, type: "sine" })

        // amplitude envelope
        const ampEnv = audioContext.createGain()
        const ampEnvGainParam = ampEnv.gain
        ampEnvGainParam.setValueAtTime(1, audioContext.currentTime)
        ampEnvGainParam.linearRampToValueAtTime(0, audioContext.currentTime + DECAY_SEC)

        // modulator
        const modSine = new OscillatorNode(audioContext, { frequency: modFreq, type: "sine" })

        // fm envelope: ramp amount to 0
        const modSineGain = audioContext.createGain()
        const modSineGainParam = modSineGain.gain
        modSineGainParam.setValueAtTime(fmAmount, audioContext.currentTime)
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

    const handleClick = () => {
        playAudio()
        setWobbling(false)
        setTimeout(() => {
            setWobbling(true)
            setTimeout(() => setWobbling(false), 3500) 
        }, 50)
    }

    return (
        <div className="bell-container">
            <div className="title">Bell Tone Designer</div>
            <div className="bell-icon" style={wobbling ? { animation: "bell-wobble 0.35s 17" } : {}} >
                🔔
            </div>
            <button className="striker-button" onClick={handleClick}>
                STRIKE
            </button>
            <div className="input-container">
                <div className="input-field">
                    <label>Carrier Frequency </label>
                    <input type="number" value={carrierFreq} onChange={e => setCarrierFreq(Number(e.target.value))} />
                </div>
                <div className="input-field">
                    <label>Modulator Frequency </label>
                    <input type="number" value={modFreq} onChange={e => setModFreq(Number(e.target.value))} />
                </div>
                <div className="input-field">
                    <label>FM Amount </label>
                    <input type="number" value={fmAmount} onChange={e => setFmAmount(Number(e.target.value))} />
                </div>
            </div>
        </div>
    )
}

export default Bell
