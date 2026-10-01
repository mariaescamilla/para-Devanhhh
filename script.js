const screens =
    document.querySelectorAll(".screen");


const heartButton =
    document.getElementById("heartButton");


const finalTitle =
    document.getElementById("finalTitle");


const restartButton =
    document.getElementById("restartButton");


let currentScreen = "screen1";


/* =========================================
   CAMBIAR DE PANTALLA
========================================= */

function showScreen(id) {

    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    const next =
        document.getElementById(id);


    if (!next) return;


    next.classList.add("active");


    currentScreen = id;


    /* Reiniciar animación del sticker */

    if (id === "screen4") {

        const sticker =
            document.querySelector(".sticker");


        sticker.style.animation = "none";


        void sticker.offsetWidth;


        sticker.style.animation =
            "stickerIn .8s cubic-bezier(.17,.89,.32,1.28)";
    }


    /* Iniciar corazón */

    if (id === "screen6") {

        startHeart();
    }
}


/* =========================================
   BOTONES
========================================= */

document
    .querySelectorAll("[data-next]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showScreen(
                    button.dataset.next
                );

            }
        );

    });


/* BOTÓN QUE LLEVA AL CORAZÓN */

heartButton.addEventListener(
    "click",
    () => {

        showScreen("screen6");

    }
);


/* VOLVER A VER */

restartButton.addEventListener(
    "click",
    () => {

        finalTitle.classList.remove("show");

        restartButton.classList.remove("show");

        showScreen("screen1");

    }
);



/* =========================================
   CORAZÓN DE PARTÍCULAS
========================================= */

const canvas =
    document.getElementById("heartCanvas");


const ctx =
    canvas.getContext("2d");


let particles = [];

let animationId;

let heartStarted = false;

let startTime = 0;



/* TAMAÑO DEL CANVAS */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.floor(
            window.innerWidth * dpr
        );


    canvas.height =
        Math.floor(
            window.innerHeight * dpr
        );


    canvas.style.width =
        window.innerWidth + "px";


    canvas.style.height =
        window.innerHeight + "px";


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    () => {

        resizeCanvas();

        if (currentScreen === "screen6") {

            createParticles();

        }

    }
);


resizeCanvas();



/* =========================================
   FORMA DEL CORAZÓN
========================================= */

function heartPoint(t, scale) {

    const x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );


    const y =

        13 *
        Math.cos(t)

        -

        5 *
        Math.cos(2 * t)

        -

        2 *
        Math.cos(3 * t)

        -

        Math.cos(4 * t);


    return {

        x: x * scale,

        y: -y * scale

    };
}



/* =========================================
   CREAR PARTÍCULAS
========================================= */

function createParticles() {

    particles = [];


    const mobile =
        window.innerWidth < 600;


    const count =
        mobile ? 2400 : 3600;


    const scale =
        Math.min(
            window.innerWidth,
            window.innerHeight
        ) *
        (
            mobile
                ? 0.0205
                : 0.0225
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI *
            2;


        const target =
            heartPoint(
                t,
                scale
            );


        const thickness =
    Math.random() < .500

        ? (
            Math.random() - .20
        ) * 10

        : (
            Math.random() - .30
        ) * 20;


        const angle =
            Math.atan2(
                target.y,
                target.x
            );


        const tx =
            target.x +
            Math.cos(angle) *
            thickness;


        const ty =
            target.y +
            Math.sin(angle) *
            thickness;


        particles.push({

            x:
                (
                    Math.random() - .5
                ) *
                window.innerWidth *
                1.8,


            y:
                (
                    Math.random() - .5
                ) *
                window.innerHeight *
                1.8,


            tx:
                tx +
                window.innerWidth / 2,


            ty:
                ty +
                window.innerHeight / 2,


            size:
                Math.random() *
                1.7 +
                .35,


            alpha:
                Math.random() *
                .75 +
                .25,


            pink:
                Math.random(),


            delay:
                Math.random() *
                850,


            drift:
                Math.random() *
                Math.PI *
                2

        });

    }
}



/* =========================================
   FONDO
========================================= */

function drawBackground() {

    ctx.fillStyle = "#000";

    ctx.fillRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    const gradient =
        ctx.createRadialGradient(

            window.innerWidth / 2,

            window.innerHeight / 2,

            0,

            window.innerWidth / 2,

            window.innerHeight / 2,

            Math.min(
                window.innerWidth,
                window.innerHeight
            ) * .48

        );


    gradient.addColorStop(
        0,
        "rgba(255, 20, 150, .055)"
    );


    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );
}



/* =========================================
   ANIMACIÓN
========================================= */

function animateParticles(timestamp) {

    if (!heartStarted)
        return;


    const elapsed =
        timestamp -
        startTime;


    drawBackground();


    particles.forEach(p => {

        const progress =

            Math.max(
                0,
                Math.min(
                    1,
                    (
                        elapsed -
                        p.delay
                    ) / 1700
                )
            );


        const ease =

            1 -
            Math.pow(
                1 - progress,
                3
            );


        const wobbleX =

            Math.sin(
                timestamp *
                .0015 +
                p.drift
            ) *

            (1 - ease) *

            8;


        const wobbleY =

            Math.cos(
                timestamp *
                .0012 +
                p.drift
            ) *

            (1 - ease) *

            8;


        const x =

            p.x +
            (
                p.tx -
                p.x
            ) *
            ease +
            wobbleX;


        const y =

            p.y +
            (
                p.ty -
                p.y
            ) *
            ease +
            wobbleY;


        const glow =
            p.pink > .18
                ? 1
                : .75;


        const r = 255;


        const g =
            p.pink > .18
                ? 45
                : 220;


        const b =
            p.pink > .18
                ? 170
                : 245;


        ctx.beginPath();


        ctx.fillStyle =
            `rgba(
                ${r},
                ${g},
                ${b},
                ${p.alpha * glow}
            )`;


        ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
        );


        ctx.fill();

    });


    /* APARECE ME ENCANTAS */

    if (elapsed > 3500) {

        finalTitle.classList.add(
            "show"
        );

    }


    /* APARECE BOTÓN */

    if (elapsed > 4500) {

        restartButton.classList.add(
            "show"
        );

    }


    animationId =
        requestAnimationFrame(
            animateParticles
        );
}



/* =========================================
   INICIAR CORAZÓN
========================================= */

function startHeart() {

    cancelAnimationFrame(
        animationId
    );


    heartStarted = true;


    startTime =
        performance.now();


    finalTitle.classList.remove(
        "show"
    );


    restartButton.classList.remove(
        "show"
    );


    createParticles();


    animationId =
        requestAnimationFrame(
            animateParticles
        );
}


/* CREAR MUCHAS PARTICULAS AL CARGAR */

createParticles();