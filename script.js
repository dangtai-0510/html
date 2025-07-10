function toggleImage() {
    const img = document.getElementById("avatar");
    img.style.display = img.style.display === "none" ? "block" : "none";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}


window.onload = function () {
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();
    let message = "Xin chào!";

    if (hour < 12) message = "Chào buổi sáng!";
    else if (hour < 18) message = "Chào buổi chiều!";
    else message = "Chào buổi tối!";

    greeting.innerHTML = `${message} Tôi tên là <strong>Đặng Đức Tài</strong>.`;
}
