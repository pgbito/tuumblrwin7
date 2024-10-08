import { ErrorWindow, Window, Html as e, getcenter } from "./windower.js";
const doc = document.getElementById("screen");
class SoundBoard {
  preload_audio(url) {
    // diay una forma bastante primitiva de precargar los hijueputas audios
    let _ = new Audio(url);
    _.preload = "auto";
    _.volume = 1e-6;
    _.play()
      .catch((e) => {})
      .finally((_) => {
        this.loginaudio.volume = 1;
      });
    return _;
  }
  constructor() {
    this.loginaudio = this.preload_audio(
      //"https://ia600100.us.archive.org/3/items/MicrosoftWindows7StartupSound/Microsoft%20Windows%207%20Startup%20Sound.mp3"
      "/js/startup7.mp3"
    );
   
  }
}
const sb = new SoundBoard();

window.byid = document.getElementById;
window.displayPfpMenu = function () {
  var imgselector = document.getElementById("imgselect");
  let file;
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (e) => {
    file = e.target.files[0];

    // Crear un FileReader para leer el archivo
    const reader = new FileReader();
    const img = new Image();
    reader.onload = function (event) {
      img.onload = function () {
        // Crear un canvas para recortar la imagen
        const canvas = document.createElement("canvas");

        // Definir el tamaño cuadrado (el lado más corto de la imagen)
        const side = Math.min(img.width, img.height);
        canvas.width = side;
        canvas.height = side;

        const ctx = canvas.getContext("2d");

        // Dibujar la imagen recortada en el canvas
        ctx.drawImage(
          img,
          (img.width - side) / 2, // Centrar la imagen en el eje X
          (img.height - side) / 2, // Centrar la imagen en el eje Y
          side, // Ancho a recortar
          side, // Alto a recortar
          0, // Coordenada X del canvas
          0, // Coordenada Y del canvas
          side, // Ancho del canvas
          side // Alto del canvas
        );

        // Convertir el canvas a blob y crear un nuevo File
        canvas.toBlob(function (blob) {
          const croppedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          imgselector.src = URL.createObjectURL(croppedFile);
          // Aquí puedes hacer lo que quieras con el nuevo File (croppedFile)
          console.log(croppedFile); // Mostramos el archivo recortado
        }, file.type);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  input.click();
};
const progress_bar = new e("div")
  .class("animate")
  .attr({ role: "progressbar" })
  .append(new e("div").id("progress_holder").style({ width: "0%" }));
window.onregister = function () {
  var usrname = document.getElementById("correo-register");
  var passwd = document.getElementById("password-register");
  superagent
    .post("/register")
    .send({ email: usrname.value, password: passwd.value }) // sends a JSON post body

    .set("accept", "json")
    .end(function (err, res) {
      if (res.status == 200) {
        alert("Has sido registrado!");

        window.registerwin.close();
      } else {
        alert("Error al registrarte, " + res.body);
      }
    });
};
window.login_window = function () {
  window.loginwindow = new Window(
    doc,
    "inicia sesión >. <",
    getcenter(),
    900,
    0,
    [
      new e("div")
        .class("unselectable")
        .style({ position: "relative" })
        .appendMany(
          new e("img")
            .attr({
              draggable: "false",
              src: "/js/frame.png",
            })
            .class("unselectable")
            .style({
              position: "relative",
              height: "200px",
              width: "200px",
              "z-index": 1,
            }),
          new e("img")
            .attr({
              draggable: "false",
              src: "/js/default.png",
            })
            .style({
              position: "absolute",
              height: "135px",
              width: "135px",

              top: "28px",
              left: "36px",

              "z-index": 2,
            })
        ),

      new e("div").style({ "flex-direction": "column" }).appendMany(
        new e("p").text(
          "hola, bienvenido a mi página web, por favor inicia sesión."
        ),
        new e("input")
          .id("correo-login")
          .attr({ type: "email", placeholder: "pon tu correo :)" }),
        new e("br"),
        new e("input")
          .id("password-login")
          .attr({ type: "password", placeholder: "tu contraseña" }),
        new e("br"),

        new e("a")
          .attr({ href: "http://github.com/pgbito" })
          .text("olvidaste tu contraseña?"),
        new e("a")
          .attr({
            onclick: "window.registerwindow()",
          })
          .text("registrate"),
        new e("br"),
        new e("button")
          .id("login")
          .attr({ onclick: "window.onlogin()" })
          .text("iniciar sesión 😓")
      ),
    ]
  );
};
window.errorbox = function (etitle, ...args) {
  return new ErrorWindow(
    doc,
    `❌ ${etitle}`,
    getcenter(),
    600,
    0,

    [
      new e("img").attr({
        src: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f342609c-7612-4fa2-94f3-84e06e03c28c/d2mwn6u-209c69dd-29c4-4524-8c5e-ecc3b71acf21.jpg/v1/fill/w_256,h_256,q_75,strp/windows_vista_error_icon_by_rukiaxichigo15_d2mwn6u-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjU2IiwicGF0aCI6IlwvZlwvZjM0MjYwOWMtNzYxMi00ZmEyLTk0ZjMtODRlMDZlMDNjMjhjXC9kMm13bjZ1LTIwOWM2OWRkLTI5YzQtNDUyNC04YzVlLWVjYzNiNzFhY2YyMS5qcGciLCJ3aWR0aCI6Ijw9MjU2In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.sKzomEZLECV2DMorjcLQQOE8mzuutJwtQv1JJVg-1H8",
        width: "35px",
        height: "35px",
      }),
      ...args.map((arg) => new e("p").text(arg).append(new e("br"))),
    ]
  );
};
window.onlogin = function () {
  var usrname = document.getElementById("correo-login");
  var passwd = document.getElementById("password-login");
  superagent
    .post("/login")
    .send({ email: usrname.value, password: passwd.value }) // sends a JSON post body

    .set("accept", "json")
    .end(function (err, res) {
      if (res.status == 200) {
        window.loginwindow.close();
        sb.loginaudio.play().catch((e) => {
          console.log(e);
        });
        setTimeout((_) => {
          new Window(doc, "página principal", getcenter(), 900, 0, [
            new e("h1").text("holi"),
          ]);
        }, 1500);
      } else {
        alert("Error iniciando sesión:", res.body);
      }
    });
};
window.registerwindow = function () {
  window.registerwin = new Window(doc, "registrate :p", getcenter(), 900, 0, [
    new e("div")
      .class("unselectable")
      .style({ position: "relative" })
      .appendMany(
        new e("img")
          .attr({
            draggable: "false",
            src: "/js/frame.png",
          })
          .class("unselectable")
          .style({
            position: "relative",
            height: "200px",
            width: "200px",
            "z-index": 1,
          }),
        new e("img")
          .attr({
            draggable: "false",
            src: "/js/default.png",
            onclick: "window.displayPfpMenu()",
          })
          .id("imgselect")
          .style({
            position: "absolute",
            height: "135px",
            width: "135px",

            top: "28px",
            left: "36px",

            "z-index": 2,
          }),
        new e("div")
          .id("hint-pfp")
          .attr({ role: "tooltip" })
          .text("acá podés subir tu pfp 💕🙊")
          .style({ "padding-left": "20px", display: "none" })
          .append(
            new e("script").text(`
            
            setTimeout((_) => {
  document.getElementById("hint-pfp").style.display = "";
  setTimeout(
    (_) => (document.getElementById("hint-pfp").style.display = "none")
  ,9000);
}, 3000);

            `)
          )
      ),

    new e("div").style({ "flex-direction": "column" }).appendMany(
      new e("h3").text(
        "hola, bienvenido a mi página web, por favor registrate."
      ),
      new e("input")
        .id("correo-register")
        .attr({ type: "email", placeholder: "pon tu correo :)" }),
      new e("br"),
      new e("input")
        .id("password-register")
        .attr({ type: "password", placeholder: "tu contraseña" }),
      new e("br"),

      new e("br"),
      new e("button")
        .id("register")
        .text("registrame!")
        .attr({ onclick: "window.onregister()" })
    ),
  ]);
};

var progress = 0;
var progress_holder = document.getElementById("progress_holder");

if (progress_holder) {
  let int = setInterval((_) => {
    progress += 0.1;
    if (progress >= 100) {
      clearInterval(int);
    }
    progress_holder.style.width = `${progress}%`;
  }, 10);
}
window.login_window();

/* var mousePosition;
     var offset = [0, 0];
    var div;
    var isDown = false;
     div = document.getElementById("draggableheader");

    Array.from(document.getElementsByClassName("draggable")).forEach(dragElement);

    function dragElement(elmnt) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (document.getElementById("draggableheader")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("draggableheader").onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    } */
