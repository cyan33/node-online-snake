class AudioManager {
    constructor() {
        this.audio = new Array();
    }

    addAudio(sound) {
        this.audio.push(new Audio(`src/audio/${sound}`));
    }

    loadAudio(audio) {
        for(let i = 0; i < audio.length; i++) {
            this.addAudio(audio[i]);
        }
    }

    getAudioByName(name) {
        let file = `/src/audio/${name}`;
        return this.audio.find((element) => {
            const { src } = element
            return src.substr(src.indexOf('/src/')) === file;
        });
    }
}

export default AudioManager;