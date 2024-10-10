import AudioPlayer from "../components/AudioPlayer";

const Home = () => {
    return (
        <div>
            {/* Reference the audio file using a relative URL */}
            <AudioPlayer audioFile={process.env.PUBLIC_URL + "/converted_audio_file.wav"} />
        </div>
    );
};

export default Home;
