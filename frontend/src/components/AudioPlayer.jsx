import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./AudioPlayer.css"

import{
    faPlay,
    faPause,
    faVolumeUp,
    faVolumeDown, 
    faVolumeMute,
    faVolumeOff,
} from '@fortawesome/free-solid-svg-icons';


const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: '#ccc',
    progressColor: '#000',
    cursorColor: "transparent",
    responsive: true,
    height: 80,
    normalize: true,
    backend: "WebAudio",
    barWidth: 2,
    barGap: 3,
})

function formatTime(seconds){
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}



export default function AudioPlayer ({audioFile}){
    // getting called to many times
    // console.log('AudioPlayer received audioFile:', audioFile);  // Debug log


    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioFileName, setAudioFileName] = useState('');
    

    useEffect(() => {

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options)

        if (wavesurfer.current) {
            wavesurfer.current.load(audioFile);
        }
        wavesurfer.current.on('ready', () => {  
            setVolume(wavesurfer.current.getVolume());
            setDuration(wavesurfer.current.getDuration());
            setAudioFileName(audioFile.split('/').pop());
        });

        wavesurfer.current.on('audioprocess', () => {
            setCurrentTime(wavesurfer.current.getCurrentTime());
        })

        return () => {
            wavesurfer.current.un('audioprocess');
            wavesurfer.current.un('ready');
            wavesurfer.current.destroy();
        }

    }, [audioFile]);

    const handlePlayPause = () => {
        setPlaying(!playing);
        wavesurfer.current.playPause();
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        wavesurfer.current.setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    const handleMute = () => {
        setMuted(!muted);
        wavesurfer.current.setVolume(muted ? volume : 0);
    };

    const handleVolumeUp = () => {
        handleVolumeChange(Math.max(volume + 0.1, 0))
    };

    const handleVolumeDown = () => {
        handleVolumeChange(Math.max(volume - 0.1, 0))
    };

    return (
        <div >
            <div id='waveform' ref={waveformRef} style={{width: '60vw'}}></div>
            <div className='controls'>
                <button onClick={handlePlayPause}>
                    <FontAwesomeIcon icon={playing ? faPause : faPlay}/>
                </button>

                <button onClick={handleMute}>
                    <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeMute}/>
                </button>

                <input
                    type='range'
                    id='volume'
                    name='volume'
                    min='0'
                    max='1'
                    step='0.05'
                    value={muted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                />

                <button onClick={handleVolumeDown}>
                    <FontAwesomeIcon icon={faVolumeDown}/>
                </button>

                <button onClick={handleVolumeUp}>
                    <FontAwesomeIcon icon={faVolumeUp}/>
                </button>
            </div>
            <div className='audio-info'>
                {/* <span>
                    Playing: {audioFileName} <br />
                </span> */}
                {/* <span>
                    Duration: {formatTime(duration)} | Current Time:{''}
                    {formatTime(currentTime)} <br />
                </span>
                <span>
                    Volume: {Math.round(volume * 100)}%
                </span> */}
            </div>
        </div>
    )
}