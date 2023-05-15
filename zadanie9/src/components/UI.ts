import { ActiveBlock, Virus } from "./Game";

class UI {
  virusContainer = document.createElement("div");
  score: HTMLDivElement | undefined;
  highScore: HTMLDivElement | undefined;
  nextBlock = document.createElement("div");
  screen = document.getElementById("screen") as HTMLDivElement;
  private viruses = 0;
  constructor() {
    this.nextBlock.classList.add("next-block");
    this.screen.appendChild(this.nextBlock);
  }

  public gameOver() {
    const gameOver = document.createElement("div");
    gameOver.classList.add("game-over");
    gameOver.innerHTML = "<img src='/img/go.png' alt='game over' />";
    this.screen.appendChild(gameOver);

    const dr = document.createElement("div");

    dr.classList.add("dr");
    dr.innerHTML = "<img src='/img/go_dr.png' alt='dr' />";
    this.screen.appendChild(dr);

    this.virusContainer.classList.add("virus-container--stage-cleared");

    const hand = document.getElementById("hand");
    if (hand) {
      hand.classList.add("hand--game-over");
    }

    this.nextBlock.remove();
  }

  public createViruses = (viruses: Virus[]) => {
    for (const virus of viruses) {
      const color =
        virus.color === 0 ? "yellow" : virus.color === 1 ? "blue" : "brown";

      const virusDiv = document.createElement("div");
      virusDiv.setAttribute("id", virus.ID);
      virusDiv.classList.add("virus", color);

      this.virusContainer.appendChild(virusDiv);
    }

    this.virusContainer.classList.add("virus-container");

    this.screen.appendChild(this.virusContainer);

    this.viruses = viruses.length;
    this.updateVirusesLeft();
  };

  public updateViruses(ID: string) {
    document.getElementById(ID)?.remove();
    this.viruses--;
    this.updateVirusesLeft();
  }

  public updateVirusesLeft() {
    const virusesLeft = document.getElementById("viruses-left");
    if (virusesLeft) {
      virusesLeft.innerHTML = "";
      const virusesLeftArr = this.viruses.toString().split("");
      while (virusesLeftArr.length < 2) {
        virusesLeftArr.unshift("0");
      }

      for (const num of virusesLeftArr) {
        const scoreNum = document.createElement("div");
        scoreNum.classList.add("score-num");
        scoreNum.innerHTML = `<img src="/img/cyfry/${num}.png" alt="${num}" />`;
        virusesLeft.appendChild(scoreNum);
      }
    }
  }

  public createScore() {
    this.score = document.createElement("div");
    this.score.classList.add("score");
    const scoreArr = [0, 0, 0, 0, 0, 0, 0];

    for (const num of scoreArr) {
      const scoreNum = document.createElement("div");
      scoreNum.classList.add("score-num");
      scoreNum.innerHTML = `<img src="/img/cyfry/${num}.png" alt="${num}" />`;
      this.score.appendChild(scoreNum);
    }
    this.screen.appendChild(this.score);
  }

  public updateScore(score: number) {
    const scoreArr = score.toString().split("");
    while (scoreArr.length < 7) {
      scoreArr.unshift("0");
    }

    if (!this.score) return;

    this.score.innerHTML = "";
    for (const num of scoreArr) {
      const scoreNum = document.createElement("div");
      scoreNum.classList.add("score-num");
      scoreNum.innerHTML = `<img src="/img/cyfry/${num}.png" alt="${num}" />`;
      this.score.appendChild(scoreNum);
    }
  }

  public createHighScore() {
    this.highScore = document.createElement("div");
    this.highScore.classList.add("high-score");
    const scoreArr = [0, 0, 0, 0, 0, 0, 0];

    for (const num of scoreArr) {
      const scoreNum = document.createElement("div");
      scoreNum.classList.add("score-num");
      scoreNum.innerHTML = `<img src="/img/cyfry/${num}.png" alt="${num}" />`;
      this.highScore.appendChild(scoreNum);
    }
    this.screen.appendChild(this.highScore);
  }

  public updateHighScore(score: number) {
    const scoreArr = score.toString().split("");
    while (scoreArr.length < 7) {
      scoreArr.unshift("0");
    }

    if (!this.highScore) return;

    this.highScore.innerHTML = "";
    for (const num of scoreArr) {
      const scoreNum = document.createElement("div");
      scoreNum.classList.add("score-num");
      scoreNum.innerHTML = `<img src="/img/cyfry/${num}.png" alt="${num}" />`;
      this.highScore.appendChild(scoreNum);
    }
  }

  public stageCleared() {
    const stageCleared = document.createElement("div");
    stageCleared.classList.add("stage-cleared");
    stageCleared.innerHTML = "<img src='/img/sc.png' alt='stage cleared' />";
    this.screen.appendChild(stageCleared);

    this.virusContainer.classList.add("virus-container--stage-cleared");
  }

  public animatePill() {
    // const arr = [];

    // for (let i = -1 + Math.PI / 2; i < Math.PI; i += 0.01) {
    //   let y = 0;
    //   if (i < Math.PI / 2) {
    //     y = -Math.pow(i - Math.PI / 2, 2) + 1;
    //   } else {
    //     y = Math.sin(i);
    //   }

    //   const top = (1 - y) * 48 + 12;
    //   const left = 376 + (596 - 376) * ((i + 1 - Math.PI / 2) / Math.PI);
    //   arr.push({ left: `${Math.round(left)}px`, top: `${Math.round(top)}px` });
    // }

    // arr.reverse();

    // for (let i = 1; i <= 20; i++) {
    //   arr.push({ left: "376px", top: `${60 + i * 2}px` });
    // }

    this.nextBlock.animate(
      [
        { left: "556px", top: "60px" },
        { left: "555px", top: "59px" },
        { left: "555px", top: "59px" },
        { left: "554px", top: "59px" },
        { left: "553px", top: "58px" },
        { left: "552px", top: "58px" },
        { left: "552px", top: "57px" },
        { left: "551px", top: "57px" },
        { left: "550px", top: "56px" },
        { left: "550px", top: "56px" },
        { left: "549px", top: "55px" },
        { left: "548px", top: "55px" },
        { left: "548px", top: "54px" },
        { left: "547px", top: "54px" },
        { left: "546px", top: "53px" },
        { left: "545px", top: "53px" },
        { left: "545px", top: "52px" },
        { left: "544px", top: "52px" },
        { left: "543px", top: "51px" },
        { left: "543px", top: "51px" },
        { left: "542px", top: "50px" },
        { left: "541px", top: "50px" },
        { left: "541px", top: "49px" },
        { left: "540px", top: "49px" },
        { left: "539px", top: "49px" },
        { left: "538px", top: "48px" },
        { left: "538px", top: "48px" },
        { left: "537px", top: "47px" },
        { left: "536px", top: "47px" },
        { left: "536px", top: "46px" },
        { left: "535px", top: "46px" },
        { left: "534px", top: "45px" },
        { left: "534px", top: "45px" },
        { left: "533px", top: "44px" },
        { left: "532px", top: "44px" },
        { left: "531px", top: "44px" },
        { left: "531px", top: "43px" },
        { left: "530px", top: "43px" },
        { left: "529px", top: "42px" },
        { left: "529px", top: "42px" },
        { left: "528px", top: "41px" },
        { left: "527px", top: "41px" },
        { left: "527px", top: "40px" },
        { left: "526px", top: "40px" },
        { left: "525px", top: "40px" },
        { left: "524px", top: "39px" },
        { left: "524px", top: "39px" },
        { left: "523px", top: "38px" },
        { left: "522px", top: "38px" },
        { left: "522px", top: "37px" },
        { left: "521px", top: "37px" },
        { left: "520px", top: "37px" },
        { left: "520px", top: "36px" },
        { left: "519px", top: "36px" },
        { left: "518px", top: "35px" },
        { left: "517px", top: "35px" },
        { left: "517px", top: "34px" },
        { left: "516px", top: "34px" },
        { left: "515px", top: "34px" },
        { left: "515px", top: "33px" },
        { left: "514px", top: "33px" },
        { left: "513px", top: "32px" },
        { left: "513px", top: "32px" },
        { left: "512px", top: "32px" },
        { left: "511px", top: "31px" },
        { left: "510px", top: "31px" },
        { left: "510px", top: "31px" },
        { left: "509px", top: "30px" },
        { left: "508px", top: "30px" },
        { left: "508px", top: "29px" },
        { left: "507px", top: "29px" },
        { left: "506px", top: "29px" },
        { left: "506px", top: "28px" },
        { left: "505px", top: "28px" },
        { left: "504px", top: "28px" },
        { left: "503px", top: "27px" },
        { left: "503px", top: "27px" },
        { left: "502px", top: "27px" },
        { left: "501px", top: "26px" },
        { left: "501px", top: "26px" },
        { left: "500px", top: "26px" },
        { left: "499px", top: "25px" },
        { left: "499px", top: "25px" },
        { left: "498px", top: "25px" },
        { left: "497px", top: "24px" },
        { left: "496px", top: "24px" },
        { left: "496px", top: "24px" },
        { left: "495px", top: "23px" },
        { left: "494px", top: "23px" },
        { left: "494px", top: "23px" },
        { left: "493px", top: "22px" },
        { left: "492px", top: "22px" },
        { left: "492px", top: "22px" },
        { left: "491px", top: "21px" },
        { left: "490px", top: "21px" },
        { left: "489px", top: "21px" },
        { left: "489px", top: "21px" },
        { left: "488px", top: "20px" },
        { left: "487px", top: "20px" },
        { left: "487px", top: "20px" },
        { left: "486px", top: "20px" },
        { left: "485px", top: "19px" },
        { left: "485px", top: "19px" },
        { left: "484px", top: "19px" },
        { left: "483px", top: "19px" },
        { left: "482px", top: "18px" },
        { left: "482px", top: "18px" },
        { left: "481px", top: "18px" },
        { left: "480px", top: "18px" },
        { left: "480px", top: "17px" },
        { left: "479px", top: "17px" },
        { left: "478px", top: "17px" },
        { left: "478px", top: "17px" },
        { left: "477px", top: "17px" },
        { left: "476px", top: "16px" },
        { left: "475px", top: "16px" },
        { left: "475px", top: "16px" },
        { left: "474px", top: "16px" },
        { left: "473px", top: "16px" },
        { left: "473px", top: "15px" },
        { left: "472px", top: "15px" },
        { left: "471px", top: "15px" },
        { left: "471px", top: "15px" },
        { left: "470px", top: "15px" },
        { left: "469px", top: "15px" },
        { left: "468px", top: "14px" },
        { left: "468px", top: "14px" },
        { left: "467px", top: "14px" },
        { left: "466px", top: "14px" },
        { left: "466px", top: "14px" },
        { left: "465px", top: "14px" },
        { left: "464px", top: "14px" },
        { left: "464px", top: "13px" },
        { left: "463px", top: "13px" },
        { left: "462px", top: "13px" },
        { left: "461px", top: "13px" },
        { left: "461px", top: "13px" },
        { left: "460px", top: "13px" },
        { left: "459px", top: "13px" },
        { left: "459px", top: "13px" },
        { left: "458px", top: "13px" },
        { left: "457px", top: "13px" },
        { left: "457px", top: "13px" },
        { left: "456px", top: "12px" },
        { left: "455px", top: "12px" },
        { left: "454px", top: "12px" },
        { left: "454px", top: "12px" },
        { left: "453px", top: "12px" },
        { left: "452px", top: "12px" },
        { left: "452px", top: "12px" },
        { left: "451px", top: "12px" },
        { left: "450px", top: "12px" },
        { left: "450px", top: "12px" },
        { left: "449px", top: "12px" },
        { left: "448px", top: "12px" },
        { left: "447px", top: "12px" },
        { left: "447px", top: "12px" },
        { left: "446px", top: "12px" },
        { left: "445px", top: "12px" },
        { left: "445px", top: "12px" },
        { left: "444px", top: "12px" },
        { left: "443px", top: "12px" },
        { left: "443px", top: "12px" },
        { left: "442px", top: "12px" },
        { left: "441px", top: "12px" },
        { left: "440px", top: "12px" },
        { left: "440px", top: "12px" },
        { left: "439px", top: "12px" },
        { left: "438px", top: "13px" },
        { left: "438px", top: "13px" },
        { left: "437px", top: "13px" },
        { left: "436px", top: "13px" },
        { left: "436px", top: "13px" },
        { left: "435px", top: "13px" },
        { left: "434px", top: "13px" },
        { left: "433px", top: "14px" },
        { left: "433px", top: "14px" },
        { left: "432px", top: "14px" },
        { left: "431px", top: "14px" },
        { left: "431px", top: "14px" },
        { left: "430px", top: "15px" },
        { left: "429px", top: "15px" },
        { left: "429px", top: "15px" },
        { left: "428px", top: "15px" },
        { left: "427px", top: "15px" },
        { left: "426px", top: "16px" },
        { left: "426px", top: "16px" },
        { left: "425px", top: "16px" },
        { left: "424px", top: "17px" },
        { left: "424px", top: "17px" },
        { left: "423px", top: "17px" },
        { left: "422px", top: "18px" },
        { left: "422px", top: "18px" },
        { left: "421px", top: "18px" },
        { left: "420px", top: "19px" },
        { left: "419px", top: "19px" },
        { left: "419px", top: "19px" },
        { left: "418px", top: "20px" },
        { left: "417px", top: "20px" },
        { left: "417px", top: "20px" },
        { left: "416px", top: "21px" },
        { left: "415px", top: "21px" },
        { left: "415px", top: "22px" },
        { left: "414px", top: "22px" },
        { left: "413px", top: "23px" },
        { left: "412px", top: "23px" },
        { left: "412px", top: "24px" },
        { left: "411px", top: "24px" },
        { left: "410px", top: "24px" },
        { left: "410px", top: "25px" },
        { left: "409px", top: "25px" },
        { left: "408px", top: "26px" },
        { left: "408px", top: "27px" },
        { left: "407px", top: "27px" },
        { left: "406px", top: "28px" },
        { left: "405px", top: "28px" },
        { left: "405px", top: "29px" },
        { left: "404px", top: "29px" },
        { left: "403px", top: "30px" },
        { left: "403px", top: "30px" },
        { left: "402px", top: "31px" },
        { left: "401px", top: "32px" },
        { left: "401px", top: "32px" },
        { left: "400px", top: "33px" },
        { left: "399px", top: "34px" },
        { left: "398px", top: "34px" },
        { left: "398px", top: "35px" },
        { left: "397px", top: "36px" },
        { left: "396px", top: "36px" },
        { left: "396px", top: "37px" },
        { left: "395px", top: "38px" },
        { left: "394px", top: "38px" },
        { left: "394px", top: "39px" },
        { left: "393px", top: "40px" },
        { left: "392px", top: "40px" },
        { left: "391px", top: "41px" },
        { left: "391px", top: "42px" },
        { left: "390px", top: "43px" },
        { left: "389px", top: "43px" },
        { left: "389px", top: "44px" },
        { left: "388px", top: "45px" },
        { left: "387px", top: "46px" },
        { left: "387px", top: "47px" },
        { left: "386px", top: "48px" },
        { left: "385px", top: "48px" },
        { left: "384px", top: "49px" },
        { left: "384px", top: "50px" },
        { left: "383px", top: "51px" },
        { left: "382px", top: "52px" },
        { left: "382px", top: "53px" },
        { left: "381px", top: "54px" },
        { left: "380px", top: "54px" },
        { left: "380px", top: "55px" },
        { left: "379px", top: "56px" },
        { left: "378px", top: "57px" },
        { left: "377px", top: "58px" },
        { left: "377px", top: "59px" },
        { left: "376px", top: "60px" },
        { left: "376px", top: "62px" },
        { left: "376px", top: "64px" },
        { left: "376px", top: "66px" },
        { left: "376px", top: "68px" },
        { left: "376px", top: "70px" },
        { left: "376px", top: "72px" },
        { left: "376px", top: "74px" },
        { left: "376px", top: "76px" },
        { left: "376px", top: "78px" },
        { left: "376px", top: "80px" },
        { left: "376px", top: "82px" },
        { left: "376px", top: "84px" },
        { left: "376px", top: "86px" },
        { left: "376px", top: "88px" },
        { left: "376px", top: "90px" },
        { left: "376px", top: "92px" },
        { left: "376px", top: "94px" },
        { left: "376px", top: "96px" },
        { left: "376px", top: "98px" },
        { left: "376px", top: "100px" },
      ],
      {
        duration: 500,
      }
    );

    setTimeout(() => {
      this.animateHand();
    }, 500 - 300);
  }

  public animateHand() {
    const hand = document.getElementById("hand");
    if (!hand) return;

    hand.style.left = "672px";
    hand.style.top = "118px";
    hand.innerHTML = `
      <div style="display: flex;">
        <img src="/img/hands/middle11.png" />
        <img src="/img/hands/middle12.png" />
      </div>
      <div style="display: flex;">
        <img src="/img/hands/middle21.png" />
        <img src="/img/hands/middle22.png" />
      </div>`;

    setTimeout(() => {
      hand.style.left = "696px";
      hand.style.top = "138px";
      hand.classList.add("hand--animate");
      hand.innerHTML = `
      <img src="/img/hands/down_1.png" />
      <img src="/img/hands/down_2.png" />
      `;
    }, 100);

    setTimeout(() => {
      hand.style.left = "672px";
      hand.style.top = "118px";
      hand.innerHTML = `
      <div style="display: flex;">
        <img src="/img/hands/middle11.png" />
        <img src="/img/hands/middle12.png" />
      </div>
      <div style="display: flex;">
        <img src="/img/hands/middle21.png" />
        <img src="/img/hands/middle22.png" />
      </div>`;
    }, 200);

    setTimeout(() => {
      hand.style.left = "696px";
      hand.style.top = "90px";
      hand.innerHTML = `
      <img src="/img/hands/up_1.png" />
      <img src="/img/hands/up_2.png" />
      <img src="/img/hands/up_3.png" />
      `;
    }, 300);
  }

  public showBlock(block: ActiveBlock) {
    this.nextBlock.innerHTML = "";
    this.nextBlock.append(block.blocks[1].element, block.blocks[2].element);
  }
}

export default UI;
