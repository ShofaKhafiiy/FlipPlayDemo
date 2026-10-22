const menuToggle = document.getElementById("menu-toggle")
const menuICon = document.getElementById("menu-icon")
const menuMobile = document.getElementById("mobile-menu")

function  closeMenu() {
    menuMobile.classList.add("hidden");
     menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");

           menuICon.innerHTML = `
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
        `;

}

menuToggle.addEventListener("click", () =>{
    const isOpen = 
    menuToggle.getAttribute("aria-expanded") === "true"

    if (isOpen){
        closeMenu()
    }
    else{
        menuMobile.classList.remove("hidden")

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Tutup menu navigasi");


            menuICon.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            `;
    }

    menuMobile.querySelector("a").forEach(function(link){
        link.addEventListener("click", closeMenu)
    })

       // Tutup menu jika pengguna beralih ke layar desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth >= 640) {
            closeMenu();
        }
    });
}


)