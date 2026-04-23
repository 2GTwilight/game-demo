document.addEventListener("DOMContentLoaded", () => {

    const startScreen = document.getElementById("start-screen");
    const createScreen = document.getElementById("create-screen");
    const awakeningScreen = document.getElementById("awakening-screen");

    const startBtn = document.getElementById("start-btn");
    const confirmBtn = document.getElementById("confirm-create");

    function switchScene(from, to) {
        from.classList.remove("active");
        to.classList.add("active");
    }

    startBtn.onclick = () => {
        switchScene(startScreen, createScreen);
    };

    /* ===== LINH CĂN ===== */
    const spiritRoots = [
        { type: "Kim", rate: 30 },
        { type: "Mộc", rate: 30 },
        { type: "Thủy", rate: 20 },
        { type: "Hỏa", rate: 15 },
        { type: "Thổ", rate: 5 }
    ];

    function randomSpiritRoot() {
        const total = spiritRoots.reduce((s, r) => s + r.rate, 0);
        let roll = Math.random() * total;
        for (let r of spiritRoots) {
            if (roll < r.rate) return r.type;
            roll -= r.rate;
        }
    }

    /* ===== STATS ===== */
    const statsBase = {
        canCot: 0,
        boPhap: 0,
        chanNguyen: 0,
        khiHuyet: 0,
        coDuyen: 0,
        tuLinh: 0,
        ngoTinh: 0
    };

    function randomStats() {
        let points = 35;
        const s = { ...statsBase };
        const keys = Object.keys(s);

        while (points > 0) {
            const k = keys[Math.floor(Math.random() * keys.length)];
            if (s[k] < 10) {
                s[k]++;
                points--;
            }
        }
        return s;
    }

    /* ===== ORIGIN ===== */
    const origins = {
        "Thiếu niên chi tinh": { canCot: 5, boPhap: 5, chanNguyen: 5, khiHuyet: 5, coDuyen: 5, tuLinh: 5, ngoTinh: 5 },
        "Cô nhi vong mệnh": { canCot: 4, boPhap: 4, chanNguyen: 3, khiHuyet: 4, coDuyen: 7, tuLinh: 10, ngoTinh: 3 },
        "Quy Canh Nông": { canCot: 8, boPhap: 6, chanNguyen: 3, khiHuyet: 8, coDuyen: 3, tuLinh: 5, ngoTinh: 0 },
        "Thợ săn núi sâu": { canCot: 6, boPhap: 7, chanNguyen: 1, khiHuyet: 7, coDuyen: 4, tuLinh: 8, ngoTinh: 2 },
        "Thanh niên thư sinh": { canCot: 4, boPhap: 4, chanNguyen: 6, khiHuyet: 2, coDuyen: 10, tuLinh: 3, ngoTinh: 6 }
    };

    confirmBtn.onclick = () => {
        const name = document.getElementById("char-name").value || "Vô Danh Tu Sĩ";
        const origin = document.getElementById("origin").value;

        let stats = randomStats();
        Object.keys(origins[origin]).forEach(k => stats[k] += origins[origin][k]);

        const player = {
            name,
            origin,
            spiritRoot: randomSpiritRoot(),
            realm: "Luyện Khí Tầng 1",
            stats
        };

        localStorage.setItem("player", JSON.stringify(player));

        document.getElementById("awakening-result").innerHTML = `
            <h2>${player.name}</h2>
            <p>🔮 Linh căn: <b>${player.spiritRoot}</b></p>
            <p>📜 Xuất thân: ${player.origin}</p>
            <p>⚔️ Cảnh giới: ${player.realm}</p>
            <button id="enter-world">Bước vào Tu Tiên Giới</button>
        `;

        switchScene(createScreen, awakeningScreen);


        document.getElementById("enter-world").onclick = () => {
            alert("🚧 Giai đoạn 2: Tu luyện đang được mở!");
        switchScene(awakeningScreen, cultivateScreen);
        showCultivate();
        };


    };
    /* ================= GIAI ĐOẠN 2 – TU LUYỆN ================= */

let player = JSON.parse(localStorage.getItem("player"));

const cultivateScreen = document.getElementById("cultivate-screen");
const qiBar = document.getElementById("qi-bar");
const qiText = document.getElementById("qi-text");

const cultivateBtn = document.getElementById("cultivate-btn");
const breakBtn = document.getElementById("break-btn");

function showCultivate() {
    document.getElementById("p-name").textContent = player.name;
    document.getElementById("p-root").textContent = player.spiritRoot;
    document.getElementById("p-realm").textContent = player.realm;

    updateQiUI();
}

function updateQiUI() {
    const percent = (player.qi / player.maxQi) * 100;
    qiBar.style.width = percent + "%";
    qiText.textContent = `${player.qi} / ${player.maxQi} Linh Khí`;

    breakBtn.disabled = player.qi < player.maxQi;
}

/* ===== TỤ LINH ===== */
cultivateBtn.onclick = () => {
    const gain = 5 + Math.floor(Math.random() * 6); // 5–10
    player.qi += gain;

    if (player.qi > player.maxQi) player.qi = player.maxQi;

    savePlayer();
    updateQiUI();
};

/* ===== ĐỘT PHÁ ===== */
breakBtn.onclick = () => {
    player.qi = 0;
    player.maxQi += 50;

    const realmLevel = parseInt(player.realm.match(/\d+/)[0]) + 1;
    player.realm = `Luyện Khí Tầng ${realmLevel}`;

    alert(`⚡ Đột phá thành công!\nCảnh giới mới: ${player.realm}`);

    savePlayer();
    updateQiUI();
};

/* ===== SAVE ===== */
function savePlayer() {
    localStorage.setItem("player", JSON.stringify(player));
}

});
