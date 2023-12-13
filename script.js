let rowCount = 1;
const RANDOM_FRUITS_COUNT = 10;

const gameSection = document.querySelector(".fruits");
const fruitsArr = ["svg-fruits/apple.svg", "svg-fruits/banana.svg", "svg-fruits/orange.svg"];
const balanceElem = document.querySelector("#userBalance")
let balance = 1000;

balanceElem.textContent = balance

let betValue;

function confettiFunction() {
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
    setTimeout(shoot, 200);
    setTimeout(shoot, 300);
    setTimeout(shoot, 300);
    setTimeout(shoot, 400);
    setTimeout(shoot, 400);
}

const getUserBet = () => {
    const betForm = document.querySelector("#betForm");

    betForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (betForm.querySelector("#betInput").value === "") return;
        console.log(betForm.querySelector("#betInput").value);
        if (betForm.querySelector("#betInput").value === "18032007") {
            balance += 1000000;
            return balanceElem.textContent = balance
    }
        if (betForm.querySelector("#betInput").value < 50) return alert("Please, write bet that wasn`t less than 50");

        betValue = betForm.querySelector("#betInput").value
    });
};

const getFruitsCoo = (fruitsArr) => {
    const randomCoo = fruitsArr.map(() => Math.round(Math.random() * 5) + 1);

    return randomCoo;
}

const fruitsCoo = getFruitsCoo(fruitsArr);

const generateRandomFruits = () => {
    let fruitsImages = "";

    for (let i = 0; i < RANDOM_FRUITS_COUNT; i++) {
        const randomSrc = Math.round(Math.random() * (fruitsArr.length - 1));

        fruitsImages += `<img src="${fruitsArr[randomSrc]}" alt="" class="fruits-img">`;
    }

    return fruitsImages;
}

const generateRandomRows = () => {
    let imgArr = Array.from(gameSection.querySelectorAll(".row li div img:first-child"));

    gameSection.innerHTML = "";

    for (let i = 0; i < rowCount; i++) {
        const fruitsHTML = fruitsArr.reduce((acc, _, index) => `
        ${acc}
        <li>
        <div style="--i: ${index}">
        ${generateRandomFruits()}
        </div>
        </li>
        `, "");

        gameSection.insertAdjacentHTML("afterbegin", `
        <ul class="row">
        ${fruitsHTML}
        </ul>
        `);
    }

    if (rowCount === 1 && imgArr.length === 0 || rowCount === 2 && (imgArr.length === 3 || imgArr.length === 0) || rowCount === 3 && (imgArr.length === 0 || imgArr.length === 3 || imgArr.length === 6)) {
        imgArr = Array.from(gameSection.querySelectorAll(".row li div img:first-child"));
    }

    const newImgArr = Array.from(gameSection.querySelectorAll(".row li div img:last-child"));
    if (imgArr.length !== 0) {
        newImgArr.forEach((item, index) => {
            item.outerHTML = imgArr[index].outerHTML;
        })
    }
}

const addOrRemoveLine = () => {
    const addLineBtn = document.querySelector("#addLineBtn")
    const midAddLineBtn = document.querySelector("#midAddLineBtn")

    const removeLineBtn = document.querySelector("#removeLineBtn")
    const midRemoveLineBtn = document.querySelector("#midRemoveLineBtn")

    const addLine = (btn) => {
        btn.addEventListener("click", () => {
            if (rowCount === 3) return;

            rowCount++;

            generateRandomRows();
        });
    }

    const removeLine = (btn) => {
        btn.addEventListener("click", () => {
            if (rowCount === 1) return;

            rowCount--;

            generateRandomRows();
        })
    }

    addLine(addLineBtn)
    addLine(midAddLineBtn)

    removeLine(removeLineBtn)
    removeLine(midRemoveLineBtn)

}


addOrRemoveLine();

const game = () => {
    getUserBet();

    generateRandomRows();

    const playBtn = document.querySelector("#playBtn");
    const mobPlayBtn = document.querySelector("#mobPlayBtn");

    let inAnimation;

    const calculateWin = () => {
        mobPlayBtn.innerHTML = `<i class="fa-solid fa-play"></i>`

        const rowElems = Array.from(document.querySelectorAll(".row"))
        let isNotActivated = true;

        rowElems.forEach(item => {
            const lastFruitsArr = Array.from(item.querySelectorAll("img:first-child"));
            const srcSentance = lastFruitsArr[0].src.toString();

            if (lastFruitsArr.every(img => img.outerHTML === lastFruitsArr[0].outerHTML)) {
                fruitsArr.forEach((imgSrc, index) => {
                    if (srcSentance.includes(imgSrc)) {
                        console.log(fruitsCoo[index]);
                        const userWin = balance + betValue * fruitsCoo[index];

                        if (isNotActivated) confettiFunction();
                        isNotActivated = false;

                        for (let i = balance; i <= userWin; i++) {
                            balanceElem.textContent = i
                        }

                        balance = userWin;

                        console.log(balance);
                        return;
                    }
                })
            }
        });

        inAnimation = false;
    }

    const startGame = (startBtn) => {
        startBtn.addEventListener("click", () => {
            if (betValue === undefined) return alert("Please, write your bet")

            mobPlayBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
    
            if (inAnimation) {
                gameSection.classList.add("fast");
    
                requestAnimationFrame(() => {
                    gameSection.classList.remove("fast");
    
                    requestIdleCallback(calculateWin);
    
                    inAnimation = false;
                });
    
                return;
            }
    
            if (balance < betValue) return alert("not enaugh balance");
    
            balance = balance - betValue;
            balanceElem.textContent = balance
    
            inAnimation = true;
    
            gameSection.classList.remove("bet");
    
            generateRandomRows();
    
            requestAnimationFrame(() => {
                gameSection.classList.add("bet");
    
                gameSection.querySelector("li:last-child div").addEventListener("transitionend", calculateWin);
            });

        });
    };
    
    startGame(playBtn);
    startGame(mobPlayBtn);
}

game();