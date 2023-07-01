const colorPickerBtn = document.querySelector(".color-picker"),
clearAll = document.querySelector(".clear-all"), 
colorList = document.querySelector(".all-colors"),
pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

// copy the color code to the clipboard and update the element text
const copyColor = function(elem) {
    elem.innerText = "Copied!";
    navigator.clipboard.writeText(elem.dataset.color);
    setTimeout(() => elem.innerText = elem.dataset.color, 1000);
}

const showColor = function() {
    if(!pickedColors.length) {
        return; 
    }//returning (exit) if there is no picked colors

    colorList.innerHTML = pickedColors.map(color => 
        `<li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#cccccc": color}"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>`).join(""); // Generating li for the picked color and adding it to the colorList
    document.querySelector(".picked-colors").classList.remove("hide");

    // add click event listener to each color element to copy the color code
    document.querySelectorAll(".color").forEach(function(li) {
        li.addEventListener("click", function(e) {
            copyColor(e.currentTarget.lastElementChild);
        });
    });
}
showColor();

const activateEyeDropper = function() {
    document.body.style.display = "none";
    setTimeout(async function() {
        try {
            // to open the color picker (eye dropper) and get the selected color
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);

            // add the color to the list if it doesn't already exist
            if(!pickedColors.includes(sRGBHex)){
                pickedColors.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                showColor();
            }
        } catch(error) {
            alert("failed to copy the color code!");
        }
        document.body.style.display = "block";
    }, 10);
}

// clearing all picked colors, update local storage, and hide the colorList element
const clearAllColors = function() {
    pickedColors.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");
}

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);