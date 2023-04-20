import Game, { ActiveBlock } from "./Game";

class UI {
  virusContainer = document.createElement("div");
  score: HTMLDivElement | undefined;
  highScore: HTMLDivElement | undefined;
  nextBlock = document.createElement("div");
  constructor() {
    this.nextBlock.classList.add("next-block");
    document.body.appendChild(this.nextBlock);
  }

  public gameOver() {
    const gameOver = document.createElement("div");
    gameOver.classList.add("game-over");
    gameOver.innerHTML = "<img src='/img/go.png' alt='game over' />";
    document.body.appendChild(gameOver);

    const dr = document.createElement("div");

    dr.classList.add("dr");
    dr.innerHTML = "<img src='/img/go_dr.png' alt='dr' />";
    document.body.appendChild(dr);

    this.virusContainer.classList.add("virus-container--stage-cleared");

    const hand = document.getElementById("hand");
    if (hand) {
      hand.classList.add("hand--game-over");
    }

    this.nextBlock.remove();
  }

  public createViruses = () => {
    const viruses = Game.viruses;

    for (const virus of viruses) {
      const color =
        virus.color === 0 ? "yellow" : virus.color === 1 ? "blue" : "brown";

      const virusDiv = document.createElement("div");
      virusDiv.setAttribute("id", virus.ID);
      virusDiv.classList.add("virus", color);

      this.virusContainer.appendChild(virusDiv);
    }

    this.virusContainer.classList.add("virus-container");

    document.body.appendChild(this.virusContainer);
  };

  public updateViruses(ID: string) {
    document.getElementById(ID)?.remove();
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
    document.body.appendChild(this.score);
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
    document.body.appendChild(this.highScore);
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
    document.body.appendChild(stageCleared);

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

    //   const top = (1 - y) * 80 + 20;
    //   const left = 502 + (795 - 502) * ((i + 1 - Math.PI / 2) / Math.PI);
    //   arr.push({ left: `${Math.round(left)}px`, top: `${Math.round(top)}px` });
    // }

    // arr.reverse();

    // console.log(JSON.stringify(arr));

    const arr = [];
    for (let i = 1; i <= 20; i++) {
      arr.push({ left: "502px", top: `${100 + i * 2}px` });
    }

    console.log(JSON.stringify(arr));

    // console.log(JSON.stringify(arr));
    this.nextBlock.animate(
      [
        { left: "742px", top: "100px" },
        { left: "741px", top: "99px" },
        { left: "740px", top: "98px" },
        { left: "739px", top: "98px" },
        { left: "738px", top: "97px" },
        { left: "737px", top: "96px" },
        { left: "736px", top: "95px" },
        { left: "735px", top: "94px" },
        { left: "734px", top: "94px" },
        { left: "733px", top: "93px" },
        { left: "732px", top: "92px" },
        { left: "731px", top: "91px" },
        { left: "730px", top: "90px" },
        { left: "730px", top: "90px" },
        { left: "729px", top: "89px" },
        { left: "728px", top: "88px" },
        { left: "727px", top: "87px" },
        { left: "726px", top: "86px" },
        { left: "725px", top: "86px" },
        { left: "724px", top: "85px" },
        { left: "723px", top: "84px" },
        { left: "722px", top: "83px" },
        { left: "721px", top: "82px" },
        { left: "720px", top: "82px" },
        { left: "719px", top: "81px" },
        { left: "718px", top: "80px" },
        { left: "717px", top: "79px" },
        { left: "717px", top: "79px" },
        { left: "716px", top: "78px" },
        { left: "715px", top: "77px" },
        { left: "714px", top: "76px" },
        { left: "713px", top: "76px" },
        { left: "712px", top: "75px" },
        { left: "711px", top: "74px" },
        { left: "710px", top: "73px" },
        { left: "709px", top: "73px" },
        { left: "708px", top: "72px" },
        { left: "707px", top: "71px" },
        { left: "706px", top: "70px" },
        { left: "705px", top: "70px" },
        { left: "704px", top: "69px" },
        { left: "703px", top: "68px" },
        { left: "703px", top: "67px" },
        { left: "702px", top: "67px" },
        { left: "701px", top: "66px" },
        { left: "700px", top: "65px" },
        { left: "699px", top: "64px" },
        { left: "698px", top: "64px" },
        { left: "697px", top: "63px" },
        { left: "696px", top: "62px" },
        { left: "695px", top: "62px" },
        { left: "694px", top: "61px" },
        { left: "693px", top: "60px" },
        { left: "692px", top: "60px" },
        { left: "691px", top: "59px" },
        { left: "690px", top: "58px" },
        { left: "689px", top: "57px" },
        { left: "689px", top: "57px" },
        { left: "688px", top: "56px" },
        { left: "687px", top: "55px" },
        { left: "686px", top: "55px" },
        { left: "685px", top: "54px" },
        { left: "684px", top: "53px" },
        { left: "683px", top: "53px" },
        { left: "682px", top: "52px" },
        { left: "681px", top: "52px" },
        { left: "680px", top: "51px" },
        { left: "679px", top: "50px" },
        { left: "678px", top: "50px" },
        { left: "677px", top: "49px" },
        { left: "676px", top: "48px" },
        { left: "675px", top: "48px" },
        { left: "675px", top: "47px" },
        { left: "674px", top: "47px" },
        { left: "673px", top: "46px" },
        { left: "672px", top: "45px" },
        { left: "671px", top: "45px" },
        { left: "670px", top: "44px" },
        { left: "669px", top: "44px" },
        { left: "668px", top: "43px" },
        { left: "667px", top: "43px" },
        { left: "666px", top: "42px" },
        { left: "665px", top: "41px" },
        { left: "664px", top: "41px" },
        { left: "663px", top: "40px" },
        { left: "662px", top: "40px" },
        { left: "661px", top: "39px" },
        { left: "661px", top: "39px" },
        { left: "660px", top: "38px" },
        { left: "659px", top: "38px" },
        { left: "658px", top: "37px" },
        { left: "657px", top: "37px" },
        { left: "656px", top: "36px" },
        { left: "655px", top: "36px" },
        { left: "654px", top: "35px" },
        { left: "653px", top: "35px" },
        { left: "652px", top: "34px" },
        { left: "651px", top: "34px" },
        { left: "650px", top: "34px" },
        { left: "649px", top: "33px" },
        { left: "648px", top: "33px" },
        { left: "647px", top: "32px" },
        { left: "647px", top: "32px" },
        { left: "646px", top: "31px" },
        { left: "645px", top: "31px" },
        { left: "644px", top: "31px" },
        { left: "643px", top: "30px" },
        { left: "642px", top: "30px" },
        { left: "641px", top: "29px" },
        { left: "640px", top: "29px" },
        { left: "639px", top: "29px" },
        { left: "638px", top: "28px" },
        { left: "637px", top: "28px" },
        { left: "636px", top: "28px" },
        { left: "635px", top: "27px" },
        { left: "634px", top: "27px" },
        { left: "634px", top: "27px" },
        { left: "633px", top: "26px" },
        { left: "632px", top: "26px" },
        { left: "631px", top: "26px" },
        { left: "630px", top: "25px" },
        { left: "629px", top: "25px" },
        { left: "628px", top: "25px" },
        { left: "627px", top: "25px" },
        { left: "626px", top: "24px" },
        { left: "625px", top: "24px" },
        { left: "624px", top: "24px" },
        { left: "623px", top: "24px" },
        { left: "622px", top: "23px" },
        { left: "621px", top: "23px" },
        { left: "620px", top: "23px" },
        { left: "620px", top: "23px" },
        { left: "619px", top: "22px" },
        { left: "618px", top: "22px" },
        { left: "617px", top: "22px" },
        { left: "616px", top: "22px" },
        { left: "615px", top: "22px" },
        { left: "614px", top: "22px" },
        { left: "613px", top: "21px" },
        { left: "612px", top: "21px" },
        { left: "611px", top: "21px" },
        { left: "610px", top: "21px" },
        { left: "609px", top: "21px" },
        { left: "608px", top: "21px" },
        { left: "607px", top: "21px" },
        { left: "606px", top: "21px" },
        { left: "606px", top: "20px" },
        { left: "605px", top: "20px" },
        { left: "604px", top: "20px" },
        { left: "603px", top: "20px" },
        { left: "602px", top: "20px" },
        { left: "601px", top: "20px" },
        { left: "600px", top: "20px" },
        { left: "599px", top: "20px" },
        { left: "598px", top: "20px" },
        { left: "597px", top: "20px" },
        { left: "596px", top: "20px" },
        { left: "595px", top: "20px" },
        { left: "594px", top: "20px" },
        { left: "593px", top: "20px" },
        { left: "592px", top: "20px" },
        { left: "592px", top: "20px" },
        { left: "591px", top: "20px" },
        { left: "590px", top: "20px" },
        { left: "589px", top: "20px" },
        { left: "588px", top: "21px" },
        { left: "587px", top: "21px" },
        { left: "586px", top: "21px" },
        { left: "585px", top: "21px" },
        { left: "584px", top: "21px" },
        { left: "583px", top: "21px" },
        { left: "582px", top: "22px" },
        { left: "581px", top: "22px" },
        { left: "580px", top: "22px" },
        { left: "579px", top: "22px" },
        { left: "578px", top: "23px" },
        { left: "578px", top: "23px" },
        { left: "577px", top: "23px" },
        { left: "576px", top: "24px" },
        { left: "575px", top: "24px" },
        { left: "574px", top: "24px" },
        { left: "573px", top: "25px" },
        { left: "572px", top: "25px" },
        { left: "571px", top: "25px" },
        { left: "570px", top: "26px" },
        { left: "569px", top: "26px" },
        { left: "568px", top: "27px" },
        { left: "567px", top: "27px" },
        { left: "566px", top: "28px" },
        { left: "565px", top: "28px" },
        { left: "564px", top: "29px" },
        { left: "564px", top: "29px" },
        { left: "563px", top: "30px" },
        { left: "562px", top: "30px" },
        { left: "561px", top: "31px" },
        { left: "560px", top: "32px" },
        { left: "559px", top: "32px" },
        { left: "558px", top: "33px" },
        { left: "557px", top: "33px" },
        { left: "556px", top: "34px" },
        { left: "555px", top: "35px" },
        { left: "554px", top: "35px" },
        { left: "553px", top: "36px" },
        { left: "552px", top: "37px" },
        { left: "551px", top: "38px" },
        { left: "550px", top: "38px" },
        { left: "550px", top: "39px" },
        { left: "549px", top: "40px" },
        { left: "548px", top: "41px" },
        { left: "547px", top: "42px" },
        { left: "546px", top: "42px" },
        { left: "545px", top: "43px" },
        { left: "544px", top: "44px" },
        { left: "543px", top: "45px" },
        { left: "542px", top: "46px" },
        { left: "541px", top: "47px" },
        { left: "540px", top: "48px" },
        { left: "539px", top: "49px" },
        { left: "538px", top: "50px" },
        { left: "537px", top: "51px" },
        { left: "537px", top: "52px" },
        { left: "536px", top: "53px" },
        { left: "535px", top: "54px" },
        { left: "534px", top: "55px" },
        { left: "533px", top: "56px" },
        { left: "532px", top: "57px" },
        { left: "531px", top: "58px" },
        { left: "530px", top: "59px" },
        { left: "529px", top: "60px" },
        { left: "528px", top: "61px" },
        { left: "527px", top: "63px" },
        { left: "526px", top: "64px" },
        { left: "525px", top: "65px" },
        { left: "524px", top: "66px" },
        { left: "523px", top: "67px" },
        { left: "523px", top: "69px" },
        { left: "522px", top: "70px" },
        { left: "521px", top: "71px" },
        { left: "520px", top: "72px" },
        { left: "519px", top: "74px" },
        { left: "518px", top: "75px" },
        { left: "517px", top: "76px" },
        { left: "516px", top: "78px" },
        { left: "515px", top: "79px" },
        { left: "514px", top: "81px" },
        { left: "513px", top: "82px" },
        { left: "512px", top: "83px" },
        { left: "511px", top: "85px" },
        { left: "510px", top: "86px" },
        { left: "509px", top: "88px" },
        { left: "509px", top: "89px" },
        { left: "508px", top: "91px" },
        { left: "507px", top: "92px" },
        { left: "506px", top: "94px" },
        { left: "505px", top: "95px" },
        { left: "504px", top: "97px" },
        { left: "503px", top: "98px" },
        { left: "502px", top: "100px" },
        { left: "502px", top: "102px" },
        { left: "502px", top: "104px" },
        { left: "502px", top: "106px" },
        { left: "502px", top: "108px" },
        { left: "502px", top: "110px" },
        { left: "502px", top: "112px" },
        { left: "502px", top: "114px" },
        { left: "502px", top: "116px" },
        { left: "502px", top: "118px" },
        { left: "502px", top: "120px" },
        { left: "502px", top: "122px" },
        { left: "502px", top: "124px" },
        { left: "502px", top: "126px" },
        { left: "502px", top: "128px" },
        { left: "502px", top: "130px" },
        { left: "502px", top: "132px" },
        { left: "502px", top: "134px" },
        { left: "502px", top: "136px" },
        { left: "502px", top: "138px" },
        { left: "502px", top: "140px" },
      ],
      {
        duration: 500,
      }
    );

    setTimeout(() => {
      this.animateHand();
    }, 500 - 200);
  }

  public animateHand() {
    const hand = document.getElementById("hand");
    if (!hand) return;

    hand.style.left = "935px";
    hand.style.top = "185px";
    hand.classList.add("hand--animate");
    hand.innerHTML = `
    <img src="/img/hands/down_1.png" />
    <img src="/img/hands/down_2.png" />
    `;

    setTimeout(() => {
      hand.style.left = "912px";
      hand.style.top = "162px";
      hand.innerHTML = `
      <div style="display: flex;">
        <img src="/img/hands/middle11.png" />
        <img src="/img/hands/middle12.png" />
      </div>
      <div style="display: flex;">
        <img src="/img/hands/middle21.png" />
        <img src="/img/hands/middle22.png" />
      </div>
      
      
      `;
    }, 100);

    setTimeout(() => {
      hand.style.left = "935px";
      hand.style.top = "138px";
      hand.innerHTML = `
      <img src="/img/hands/up_1.png" />
      <img src="/img/hands/up_2.png" />
      <img src="/img/hands/up_3.png" />
      `;
    }, 200);

    // setTimeout(() => {
    //   hand.innerHTML = `
    //   <div style="display: flex;">
    //     <img src="/img/hands/middle11.png" />
    //     <img src="/img/hands/middle12.png" />
    //   </div>
    //   <div style="display: flex;">
    //     <img src="/img/hands/middle21.png" />
    //     <img src="/img/hands/middle22.png" />
    //   </div>

    //   `;
    // }, 500);

    // setTimeout(() => {
    //   hand.innerHTML = `
    //   <img src="/img/hands/down_1.png" />
    //   <img src="/img/hands/down_2.png" />
    //   `;
    // }, 1000);

    // setTimeout(() => {
    //   hand.classList.remove("hand--animate");
    // }, 1000);
  }

  public showBlock(block: ActiveBlock) {
    this.nextBlock.innerHTML = "";
    this.nextBlock.append(block.blocks[1].element, block.blocks[2].element);
    // console.log(block.blocks);
  }
}

export default new UI();
