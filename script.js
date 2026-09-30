(() => {
  const THRESHOLD = 200;   // növeld, ha téves riasztást kapsz
  let locked = false;

  const lock = () => {
    if (locked) return;
    locked = true;
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"></head><body style="margin:0;background:#000"></body>';
  };

  const sizeCheck = () => {
    if (window.outerWidth - window.innerWidth > THRESHOLD ||
        window.outerHeight - window.innerHeight > THRESHOLD) lock();
  };

  const debuggerCheck = () => {
    const t = performance.now();
    debugger;
    if (performance.now() - t > 100) lock();
  };

  setInterval(() => { sizeCheck(); debuggerCheck(); }, 1000);
  window.addEventListener('resize', sizeCheck);

  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(k)) ||
        (e.ctrlKey && k === 'u')) e.preventDefault();
  });
  document.addEventListener('contextmenu', e => e.preventDefault());
})();