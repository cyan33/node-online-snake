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
        let path = window.location.pathname;
        let dir = path.substring(0, path.lastIndexOf('/'));
        let file = `file://${dir}/src/audio/${name}`;
        return this.audio.find((element) => {
            return element.src === file;
        });
    }
}

export default AudioManager;