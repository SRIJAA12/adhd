import { Howl } from 'howler';

class SoundManager {
  constructor() {
    this.sounds = {
      celebration: new Howl({
        src: ['/sounds/celebration.mp3'],
        volume: 0.5,
      }),
      notification: new Howl({
        src: ['/sounds/notification.mp3'],
        volume: 0.3,
      }),
      complete: new Howl({
        src: ['/sounds/complete.mp3'],
        volume: 0.4,
      }),
    };
  }

  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].play();
    }
  }

  setVolume(soundName, volume) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].volume(volume);
    }
  }
}

export default new SoundManager();
