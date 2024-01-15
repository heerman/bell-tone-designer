import "./Bell.css"

const playAudio = async () => {
    const DECAY_SEC = 2
    const audioContext = new window.AudioContext()

    const osc = new OscillatorNode(audioContext, { frequency: 660, type: "sine" })
    osc.start()

    const ampEnv = audioContext.createGain()
    const gainParam = ampEnv.gain
    gainParam.setValueAtTime(1, audioContext.currentTime)
    gainParam.linearRampToValueAtTime(0, audioContext.currentTime + DECAY_SEC)

    osc.connect(ampEnv).connect(audioContext.destination)
}

function Bell() {
    return <>
        <div className="bell-icon">🔔</div>
        <button className="striker-button" onClick={playAudio}>STRIKE</button>
    </>
}

export default Bell
