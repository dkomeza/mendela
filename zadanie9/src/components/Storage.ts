import UI from "./UI";

interface iStorage {
  previousHighScore: number;
  loadHighScore: () => void;
  saveHighScore: (score: number) => void;
}

class Storage implements iStorage {
  previousHighScore = 0;

  UI: UI | undefined;

  setUI(UI: UI) {
    this.UI = UI;
  }

  loadHighScore = () => {
    const highScore = localStorage.getItem("highScore");
    this.UI?.createHighScore();
    if (highScore) {
      this.UI?.updateHighScore(Number(highScore));
      this.previousHighScore = Number(highScore);
    } else {
      this.UI?.updateHighScore(0);
    }
  };

  saveHighScore = (score: number) => {
    if (score > this.previousHighScore) {
      localStorage.setItem("highScore", score.toString());
      this.UI?.updateHighScore(score);
    }
  };
}

export default new Storage();
export { Storage };
export type { iStorage };
