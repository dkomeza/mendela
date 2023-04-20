import UI from "./UI";

interface iStorate {
  previousHighScore: number;
  loadHighScore: () => void;
  saveHighScore: (score: number) => void;
}

class Storage implements iStorate {
  previousHighScore = 0;
  loadHighScore = () => {
    const highScore = localStorage.getItem("highScore");
    UI.createHighScore();
    if (highScore) {
      UI.updateHighScore(Number(highScore));
      this.previousHighScore = Number(highScore);
    } else {
      UI.updateHighScore(0);
    }
  };

  saveHighScore = (score: number) => {
    if (score > this.previousHighScore) {
      localStorage.setItem("highScore", score.toString());
      UI.updateHighScore(score);
    }
  };
}

export default new Storage();
