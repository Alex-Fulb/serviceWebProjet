function popup(id) {
    console.log(id + ' is under modifications');
    var popwindow = document.getElementById("tablebrain");
    if (popwindow.style.display === "none") {
        document.getElementById("namebot").innerHTML = "Cerveaux" + id;
        popwindow.style.display = "block";
        document.getElementById("tablebrain").scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    } else {
        popwindow.style.display = "none";
    }
};

function checkedbox() {

    /*
    TODO (facultatif)
    brains doit récupérer la liste des brains disponibles
    TODO
    à la fin de la fonction on doit faire un update du bot sur la bdd
    */
    const newbrains = ['./brain.rive'];
    brains = ['Normal', 'Dungeon', 'Crazy'];
    brains.forEach(element => {
        if (document.getElementById("checkbox" + element).checked == true) {
            newbrains.push('./' + element + '.rive');
        }
    })
    //newbrains est un array de string conteneant les nouveaux cerveaux
    console.log(newbrains);
}