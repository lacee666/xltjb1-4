const steps = [
    {
        text: "Ahol először megláttál…",
        password: "2025081803",
        successText: "De legalább megittunk egy finom limonádét",
        photoText: "Készíts egy fotót az emlékről!"
    },
    {
        text: "Ahol először éreztél valamit…",
        password: "202508221540",
        successText: "Még mindig tetszik a kockás inged.",
        photoText: "Készíts egy fotót az emlékről!"
    },
    {
        text: "Ahol az első közös képünk készült…",
        password: "202508311712",
        successText: "Jó volt :)",
        photoText: "Készíts egy fotót az emlékről!"
    },
    {
        text: "Ezt inkább hagyjuk…",
        password: "",
        successText: "Rám se néztél…",
        photoText: "Készíts egy fotót az emlékről!"
    },
    {
        text: "Ahol minden elkezdődött…",
        password: "202509102220",
        successText: "A többi már csak történelem",
        photoText: "Készíts egy fotót az emlékről!"
    }
];

const textView = document.getElementById("textView");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const error = document.getElementById("error");

const successView = document.getElementById("successView");

const photoView = document.getElementById("photoView");
const photoText = document.getElementById("photoText");
const photoInput = document.getElementById("photoInput");

const photoPreview = document.getElementById("photoPreview");
const previewImage = document.getElementById("previewImage");

const progressBar = document.getElementById("progressBar");

let currentStep = 0;
let previousObjectUrl = null;
let flowBusy = false;

function resetAnimation(element) {
    element.classList.remove("fadeIn");
    element.classList.remove("fadeOut");
    element.classList.remove("shake");

    void element.offsetWidth;
}

function animateOut(element) {
    return new Promise(resolve => {
        resetAnimation(element);

        element.classList.add("fadeOut");

        setTimeout(resolve, 400);
    });
}

function updateProgress() {
    const progress =
        ((currentStep + 1) / steps.length) * 100;

    progressBar.style.width = `${progress}%`;
}

function showStep() {
    const step = steps[currentStep];

    flowBusy = false;

    resetAnimation(textView);
    resetAnimation(passwordForm);

    textView.style.display = "block";
    passwordForm.style.display = "block";

    successView.style.display = "none";
    photoView.style.display = "none";
    photoPreview.style.display = "none";

    textView.textContent = step.text;

    passwordInput.value = "";
    error.textContent = "";

    updateProgress();

    textView.classList.add("fadeIn");
    passwordForm.classList.add("fadeIn");

    setTimeout(() => {
        passwordInput.focus();
    }, 400);
}

async function showSuccess() {
    const step = steps[currentStep];

    await Promise.all([
        animateOut(textView),
        animateOut(passwordForm)
    ]);

    textView.style.display = "none";
    passwordForm.style.display = "none";

    successView.textContent = step.successText;
    successView.style.display = "block";

    resetAnimation(successView);
    successView.classList.add("fadeIn");

    await new Promise(resolve => {
        const handler = () => {
            successView.removeEventListener("click", handler);
            resolve();
        };

        successView.addEventListener("click", handler);
    });

    await animateOut(successView);

    successView.style.display = "none";

    photoText.textContent = step.photoText;

    photoView.style.display = "block";

    resetAnimation(photoView);
    photoView.classList.add("fadeIn");
}

passwordForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (flowBusy) {
        return;
    }

    const step = steps[currentStep];
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword !== step.password) {
        error.textContent = "Ez nem a megfelelő kód.";

        passwordForm.classList.remove("shake");

        void passwordForm.offsetWidth;

        passwordForm.classList.add("shake");

        return;
    }

    flowBusy = true;

    passwordInput.blur();

    await showSuccess();

    flowBusy = false;
});

photoInput.addEventListener("change", event => {
    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    if (previousObjectUrl) {
        URL.revokeObjectURL(previousObjectUrl);
    }

    previousObjectUrl = URL.createObjectURL(file);

    previewImage.onload = () => {
        photoView.style.display = "none";

        photoPreview.style.display = "block";

        resetAnimation(photoPreview);

        photoPreview.classList.add("fadeIn");
    };

    previewImage.src = previousObjectUrl;
});

photoPreview.addEventListener("click", async () => {
    if (flowBusy) {
        return;
    }

    flowBusy = true;

    await animateOut(photoPreview);

    photoPreview.style.display = "none";

    currentStep++;

    if (currentStep >= steps.length) {
        finish();
        return;
    }

    photoInput.value = "";

    showStep();
});

function finish() {
    successView.textContent = "Minden emlék megvan. ❤️";

    successView.style.display = "block";

    resetAnimation(successView);

    successView.classList.add("fadeIn");

    progressBar.style.width = "100%";

    flowBusy = false;
}

showStep();