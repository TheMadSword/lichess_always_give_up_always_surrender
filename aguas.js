main = function() {

if (!window.location.toString().includes("lichess.org/")) {
  console.log("Not Lichess ?");
  return;
}

if (!document.querySelector("body.playing")) {
  console.log("Not playing ?");
  return;
}

let questionParent = document.querySelector(".rcontrols");
if (!questionParent) {
  console.log("Not in game ?");
  return;
}

const CFG_OBSERVE = { attributes: false, childList: true, subtree: true }; //always the same

let resignConfirmTimer = undefined;
function setConfirmResign(s) {
  let resignA = document.querySelector(".rcontrols .question .aguas:not(.confirm)")
  let resignConfirm = document.querySelector(".rcontrols .question .aguas.confirm")

  if (!resignA || !resignConfirm) return;

  resignA.hidden = s;
  resignConfirm.hidden = !s;

  if (resignConfirmTimer) {
    clearTimeout(resignConfirmTimer);
  }
  resignConfirmTimer = undefined;

  if (s) {
    resignConfirmTimer = setTimeout(() => setConfirmResign(false), 3000);
  }
}

function addStuff() {
  let resignA = document.createElement("a");
  resignA.classList.add("aguas");
  resignA.setAttribute("data-icon", "");
  resignA.onclick = () => setConfirmResign(true);
  let resignConfirm = document.createElement("a");
  resignConfirm.classList.add("aguas");
  resignConfirm.classList.add("confirm");
  resignConfirm.setAttribute("data-icon", "");
  resignConfirm.hidden = true;
  resignConfirm.onclick = () =>  window.lichess.socket.send("resign");
  let sep = document.createElement("div");
  sep.style.flex = '0.5'

  let question = document.querySelector(".rcontrols .question");
  question.prepend(sep);
  question.prepend(resignA);
  question.prepend(resignConfirm);
}

function observeElementForSubModif(callbackSubModif, elem) {
  const callback = (mutationList, observer) => {
    let hasChildlist = false;
    for (let i = 0; i < mutationList.length; i++) {
      if (mutationList[i].type === "childList") {
        hasChildlist = true;
        break;
      }
    }
    if (hasChildlist) {
      callbackSubModif();
    }
  };

  new MutationObserver(callback).observe(elem, CFG_OBSERVE);
}

function doLogic() {
  if (document.querySelector(".rcontrols .question") &&
      !document.querySelector(".aguas")) {
    addStuff();
  }
}

observeElementForSubModif(() => {
  doLogic();
}, questionParent);

doLogic();

} //--


if (document.readyState === 'complete') {
  main();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete") {
      main();
    }
  };
}
