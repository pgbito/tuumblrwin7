setTimeout((_) => {
  document.getElementById("hint-pfp").style.display = "";
  setTimeout(
    (_) => (document.getElementById("hint-pfp").style.display = "none")
  );
}, 3000);
