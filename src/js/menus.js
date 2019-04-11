// Top-level menu containers
const menuMainNode = $('.menu--main');
const menuPauseNode = $('.menu--pause');
const menuScoreNode = $('.menu--score');

// Buttons from various menus
// Main Menu
const playNormalBtnNode = $('.play-normal-btn');
const playCasualBtnNode = $('.play-casual-btn');
// Pause Menu
const resumeBtnNode = $('.resume-btn');
const mainMenuBtnNode = $('.menu-btn');
// Score Menu


function showMenu(node) {
	node.classList.add('active');
}

function hideMenu(node) {
	node.classList.remove('active');
}

function renderMenus() {
	hideMenu(menuMainNode);
	hideMenu(menuPauseNode);
	hideMenu(menuScoreNode);

	switch (state.menus.active) {
		case MENU_MAIN:
			showMenu(menuMainNode);
			break;
		case MENU_PAUSE:
			showMenu(menuPauseNode);
			break;
		case MENU_SCORE:
			showMenu(menuScoreNode);
			break;
	}

	if (state.menus.active) {
		hideHud();
	} else {
		showHud();
	}
}

renderMenus();



playNormalBtnNode.addEventListener('click', () => {
	resetGame();
	setActiveMenu(null);
});

mainMenuBtnNode.addEventListener('click', () => {
	setActiveMenu(MENU_MAIN);
});
