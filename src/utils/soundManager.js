import { Howl } from 'howler';

class SoundManager {
  constructor() {
    this.sounds = {
      ambient: new Howl({
        src: ['/sounds/ambient-focus.mp3'],
        volume: 0.3,
        loop: true,
      }),
      complete: new Howl({
        src: ['/sounds/complete.mp3'],
        volume: 0.5,
      }),
      notification: new Howl({
        src: ['/sounds/notification.mp3'],
        volume: 0.4,
      }),
      celebration: new Howl({
        src: ['/sounds/celebration.mp3'],
        volume: 0.6,
      }),
    };
  }

  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].play();
    }
  }

  stop(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].stop();
    }
  }

  setVolume(soundName, volume) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].volume(volume);
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => sound.stop());
  }
}

export default new SoundManager();
