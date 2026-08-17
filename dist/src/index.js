"use strict";
const SAVE_KEY = "winter-library-save-v1";
const initialState = () => ({ day: 1, food: 8, firewood: 7, energy: 3, warmth: 68, houseLevel: 1, shelves: 1, books: [{ id: "ember-tale", title: "재 속의 아이", emotion: "희망", description: "꺼진 화로 곁에서도 끝내 아침을 기다린 아이의 기록.", energy: 2, risk: 1, contained: true }] });
let state = null;
const app = document.querySelector("#app");
function saveGame() { if (state)
    localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function loadGame() { const raw = localStorage.getItem(SAVE_KEY); if (!raw)
    return null; try {
    return JSON.parse(raw);
}
catch (_a) {
    localStorage.removeItem(SAVE_KEY);
    return null;
} }
function svg(name) { const paths = { book: '<path d="M5 4.5A3.5 3.5 0 0 1 8.5 1H19v18H8.5A3.5 3.5 0 0 0 5 22.5z"/><path d="M5 4.5A3.5 3.5 0 0 0 1.5 1H1v18h.5A3.5 3.5 0 0 1 5 22.5"/>', fire: '<path d="M13 22c4-1 7-4 7-8 0-3-2-6-5-8 0 3-1 5-3 6 0-5-2-8-5-11 0 5-4 8-4 13 0 4 3 7 7 8-2-2-2-5 1-7 0 3 3 4 2 7z"/>', food: '<path d="M4 11h16c0 6-3 10-8 10s-8-4-8-10z"/><path d="M7 7c0-2 1-3 2-4m4 4c0-2 1-3 2-4"/>', home: '<path d="m2 11 10-9 10 9"/><path d="M5 9v12h14V9M9 21v-7h6v7"/>', snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 3 3-3M9 20l3-3 3 3"/>' }; return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`; }
function toast(message) { const el = document.createElement("div"); el.className = "toast"; el.textContent = message; document.body.append(el); window.setTimeout(() => el.remove(), 2200); }
function renderMenu() {
    var _a, _b, _c;
    const hasSave = Boolean(loadGame());
    app.innerHTML = `<main class="menu-screen"><div class="snow-layer"></div><section class="title-block"><p class="eyebrow">THE LAST SHELTER ARCHIVE</p><h1>겨울의<br><span>도서관</span></h1><p class="subtitle">이야기가 사라지면, 온기도 사라진다.</p></section><nav class="menu-panel"><button class="primary" data-action="new">새 게임 <span>처음부터 이야기를 시작합니다</span></button><button data-action="continue" ${hasSave ? "" : "disabled"}>이어서 플레이 <span>${hasSave ? "마지막으로 머문 밤부터" : "저장된 기록이 없습니다"}</span></button><button data-action="reset" ${hasSave ? "" : "disabled"}>데이터 초기화 <span>모든 기록을 지웁니다</span></button></nav><p class="menu-foot">얼어붙은 세계의 작은 피난처</p></main>`;
    (_a = app.querySelector('[data-action="new"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => { if (hasSave && !confirm("기존 기록을 덮어쓰고 새 게임을 시작할까요?"))
        return; state = initialState(); saveGame(); renderHouse(); });
    (_b = app.querySelector('[data-action="continue"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { state = loadGame(); if (state)
        renderHouse(); });
    (_c = app.querySelector('[data-action="reset"]')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => { if (!confirm("저장된 모든 기록을 지울까요?"))
        return; localStorage.removeItem(SAVE_KEY); renderMenu(); });
}
function renderHouse() {
    if (!state)
        return renderMenu();
    const capacity = state.shelves * 4;
    const production = state.books.filter(b => b.contained).reduce((n, b) => n + b.energy, 0);
    const houseName = state.houseLevel === 1 ? "작은 겨울집" : state.houseLevel === 2 ? "확장된 서고" : "이야기의 도서관";
    app.innerHTML = `<main class="game-screen"><header class="topbar"><button class="brand" data-action="menu">${svg("book")}<span>겨울의 도서관<small>WINTER LIBRARY</small></span></button><div class="day"><span>생존 기록</span><strong>제 ${state.day}일</strong></div><div class="weather">${svg("snow")}<span>폭설<small>외부 기온 -31°C</small></span></div></header><section class="resource-bar"><div>${svg("food")}<span>식량<small>하루 1 소모</small></span><strong>${state.food}</strong></div><div>${svg("fire")}<span>땔감<small>오늘 밤 2 필요</small></span><strong>${state.firewood}</strong></div><div>${svg("book")}<span>감정 에너지<small>하루 +${production} 생산</small></span><strong>${state.energy}</strong></div><div class="warmth"><span>실내 온기</span><strong>${state.warmth}%</strong><i><b style="width:${state.warmth}%"></b></i></div></section><section class="house-view"><div class="house-copy"><p class="eyebrow">당신의 피난처 · 규모 ${state.houseLevel}</p><h2>${houseName}</h2><p>바깥에서는 눈보라가 벽을 긁고 있습니다.<br>화로의 불빛만이 아직 이곳을 살아 있게 합니다.</p></div><div class="room"><div class="window"><span></span><span></span><span></span><span></span></div><div class="shelf shelf-one"><i></i><i></i><i></i><i></i></div>${state.shelves > 1 ? '<div class="shelf shelf-two"><i></i><i></i><i></i></div>' : ""}${state.shelves > 2 ? '<div class="shelf shelf-three"><i></i><i></i><i></i></div>' : ""}<div class="fireplace"><div class="flame"></div></div><div class="desk"><span></span></div></div></section><section class="action-grid"><button data-action="books"><span class="action-icon">${svg("book")}</span><span><strong>책 관리</strong><small>${state.books.length}권 보관 중 · 수용량 ${state.books.length}/${capacity}</small></span><em>열기</em></button><button data-action="shelf"><span class="action-icon">${svg("book")}</span><span><strong>책장 추가</strong><small>책 4권을 더 보관할 수 있습니다</small></span><em>땔감 ${3 + state.shelves}</em></button><button data-action="expand"><span class="action-icon">${svg("home")}</span><span><strong>집 증축</strong><small>새 공간과 책장 한 칸을 확보합니다</small></span><em>땔감 ${7 + state.houseLevel * 3}</em></button><button class="disabled-feature" disabled><span class="action-icon">${svg("snow")}</span><span><strong>탐사 준비</strong><small>눈보라 너머의 기록을 찾습니다</small></span><em>준비 중</em></button></section><footer class="day-footer"><p><strong>오늘 밤</strong> 식량 1과 땔감 2가 필요합니다.</p><button data-action="next">하루를 마친다 <span>→</span></button></footer></main>`;
    bindHouseActions();
}
function bindHouseActions() {
    var _a, _b, _c, _d, _e;
    (_a = app.querySelector('[data-action="menu"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderMenu);
    (_b = app.querySelector('[data-action="books"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", renderBooks);
    (_c = app.querySelector('[data-action="shelf"]')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => { if (!state)
        return; const cost = 3 + state.shelves; if (state.firewood < cost)
        return toast(`땔감이 ${cost - state.firewood}만큼 부족합니다.`); state.firewood -= cost; state.shelves++; saveGame(); renderHouse(); toast("새 책장을 완성했습니다."); });
    (_d = app.querySelector('[data-action="expand"]')) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => { if (!state)
        return; const cost = 7 + state.houseLevel * 3; if (state.firewood < cost)
        return toast(`땔감이 ${cost - state.firewood}만큼 부족합니다.`); state.firewood -= cost; state.houseLevel++; state.shelves++; saveGame(); renderHouse(); toast("집이 한층 넓어졌습니다."); });
    (_e = app.querySelector('[data-action="next"]')) === null || _e === void 0 ? void 0 : _e.addEventListener("click", endDay);
}
function endDay() { if (!state)
    return; state.day++; state.food = Math.max(0, state.food - 1); const wood = Math.min(2, state.firewood); state.firewood -= wood; const gain = state.books.filter(b => b.contained).reduce((n, b) => n + b.energy, 0); state.energy += gain; state.warmth = Math.max(10, Math.min(100, state.warmth + wood * 14 - 20)); if (!state.food)
    state.warmth = Math.max(10, state.warmth - 8); saveGame(); renderHouse(); toast(`제 ${state.day}일. 감정 에너지 ${gain}을 얻었습니다.`); }
function renderBooks() {
    var _a;
    if (!state)
        return;
    const gain = state.books.filter(b => b.contained).reduce((n, b) => n + b.energy, 0);
    app.innerHTML = `<main class="game-screen books-screen"><header class="section-header"><button class="back" data-action="back">← 집으로</button><div><p class="eyebrow">ARCHIVE MANAGEMENT</p><h2>책 관리</h2></div><p>${state.books.length} / ${state.shelves * 4}권</p></header><section class="book-intro"><div><h3>이야기는 온기를 남깁니다.</h3><p>안정화한 책은 매일 감정 에너지를 생산합니다. 격리하면 생산이 중단되지만 이상 현상을 억제할 수 있습니다.</p></div><span>일일 생산량<strong>+${gain}</strong></span></section><section class="book-list">${state.books.map(book => `<article class="book-card ${book.contained ? "active" : ""}"><div class="book-cover"><span>Ⅰ</span><strong>${book.title}</strong><small>WINTER ARCHIVE</small></div><div class="book-info"><p class="emotion">${book.emotion}의 기록</p><h3>${book.title}</h3><p>${book.description}</p><dl><div><dt>출력</dt><dd>+${book.energy} / 일</dd></div><div><dt>위험도</dt><dd>${"◆".repeat(book.risk)}${"◇".repeat(3 - book.risk)}</dd></div></dl></div><button data-book="${book.id}">${book.contained ? "책 격리" : "책 안정화"}<small>${book.contained ? "에너지 생산 중" : "현재 격리됨"}</small></button></article>`).join("")}</section><aside class="coming-note"><span>다음 기록</span><p>탐사 시스템이 열리면 새로운 책과 그 안에 남은 감정을 발견할 수 있습니다.</p></aside></main>`;
    (_a = app.querySelector('[data-action="back"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderHouse);
    app.querySelectorAll("[data-book]").forEach(button => button.addEventListener("click", () => { if (!state)
        return; const book = state.books.find(b => b.id === button.dataset.book); if (!book)
        return; book.contained = !book.contained; saveGame(); renderBooks(); }));
}
renderMenu();
