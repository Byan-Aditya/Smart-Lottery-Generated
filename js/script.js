// === VIEW PAGER FLIP ===
  const btn = document.getElementById("flipBtn");
  const page1 = document.getElementById("page1");
  const page2 = document.getElementById("page2");
  const iconNext = document.getElementById("iconNext");
  const iconBack = document.getElementById("iconBack");
  let showingPage1 = true;
  const myPassword = "adit123"; // ganti password sesuai kebutuhanmu

  // cek sessionStorage
  let passwordVerified = sessionStorage.getItem("verified") === "true";

  btn.addEventListener("click", () => {
    if (showingPage1) {
      // kalau belum verifikasi → minta password
      if (!passwordVerified) {
        Swal.fire({
          imageUrl: 'images/password.gif',
          imageWidth: 150,
          imageHeight: 150,
          title: 'Masukkan Password',
          input: 'password',
          inputPlaceholder: 'Password...',
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'Batal',
          allowOutsideClick: false,
          customClass: {
            title: 'swal-title-center',
            input: 'swal-input-center'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value === myPassword) {
              sessionStorage.setItem("verified", "true");
              passwordVerified = true;
              flipToPage2();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Password salah!',
                text: 'Coba lagi.'
              });
            }
          }
        });
      } else {
        // sudah verifikasi → langsung ke page2
        flipToPage2();
      }
    } else {
      // Balik ke page1 tanpa password
      flipToPage1();
    }
  });

  function flipToPage2() {
    page1.classList.remove("active");
    page1.classList.add("inactive");
    page2.classList.remove("inactive");
    page2.classList.add("active");

    iconNext.classList.remove("visible");
    iconNext.classList.add("hidden");
    iconBack.classList.remove("hidden");
    iconBack.classList.add("visible");

    showingPage1 = false;
  }

  function flipToPage1() {
    page2.classList.remove("active");
    page2.classList.add("inactive");
    page1.classList.remove("inactive");
    page1.classList.add("active");

    iconBack.classList.remove("visible");
    iconBack.classList.add("hidden");
    iconNext.classList.remove("hidden");
    iconNext.classList.add("visible");

    showingPage1 = true;
  }
