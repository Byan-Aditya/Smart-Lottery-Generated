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

// === DATA ===
let rowCount = 0;
const maxRows = 1000;

// Load data lama
window.onload = function() {
  const saved = localStorage.getItem("tabelData");
  if (saved) {
    let data = JSON.parse(saved);
    data.forEach(row => addRow(row.Data));
  } else {
    addRow();
  }
};

// Tambah baris
function addRow(value = "") {
  if (rowCount >= maxRows) { alert("Baris sudah mencapai batas maksimum (1000)!"); return;}
  rowCount++;
  const tbody = document.getElementById("tableBody");
  let tr = document.createElement("tr");
  let tdNo = document.createElement("td"); tdNo.innerText = rowCount; tr.appendChild(tdNo);
  let tdInput = document.createElement("td");
  tdInput.innerHTML = `<input type='text' value='${value}' oninput='autoSave()'/>`;
  tr.appendChild(tdInput);
  tbody.appendChild(tr);
}

// Generate beberapa baris baru di bawah data lama
function generateRows() {
  let jumlah = parseInt(document.getElementById("jumlahBaris").value);
  if (isNaN(jumlah) || jumlah < 1) { alert("Masukkan jumlah baris yang valid!"); return; }
  if (rowCount + jumlah > maxRows) jumlah = maxRows - rowCount;
  for (let i=0;i<jumlah;i++) addRow();
  autoSave();
  let kode = document.getElementById("kodeInput").value.trim();
  if (kode !== "") showPopup(kode);
}

// Hapus tabel dari bawah
function hapusBarisBawah(jumlah) {
  const tbody = document.getElementById("tableBody");
  for (let i = 0; i < jumlah; i++) {
    if (tbody.lastChild) {
      tbody.removeChild(tbody.lastChild);
      rowCount--;
    } else break;
  }
  autoSave();
}

// Hapus baris bawah dengan konfirmasi password
function hapusBarisBawahPrompt() {
  Swal.fire({
    title: 'Hapus Baris dari Bawah',
    text: 'Masukkan password untuk konfirmasi',
    input: 'password',
    inputPlaceholder: 'Password',
    showCancelButton: true,
    confirmButtonText: 'Lanjut Hapus',
    cancelButtonText: 'Batal',
    customClass: {
      title: 'swal-title-center',
      input: 'swal-input-center'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (result.value === 'adit123') { // ganti password sesuai kebutuhan
        // Minta jumlah baris yang ingin dihapus
        Swal.fire({
          title: 'Masukkan jumlah baris',
          input: 'number',
          inputAttributes: { min: 1 },
          showCancelButton: true,
          confirmButtonText: 'Hapus',
          cancelButtonText: 'Batal',
          customClass: {
            title: 'swal-title-center',
            input: 'swal-input-center'
          }
        }).then((res) => {
          if (res.isConfirmed) {
            let jumlah = parseInt(res.value);
            if (!isNaN(jumlah) && jumlah > 0) {
              hapusBarisBawah(jumlah);
              Swal.fire('Berhasil!', `${jumlah} baris telah dihapus dari bawah.`, 'success');
            }
          }
        });
      } else {
        Swal.fire('Error', 'Password salah!', 'error');
      }
    }
  });
}

// Save & autoSave
function saveTable() {
  let data = [];
  document.querySelectorAll("#tableBody tr").forEach(row => {
    let nomor = row.querySelector("td:first-child").innerText;
    let isi = row.querySelector("td input").value;
    data.push({ No: nomor, Data: isi });
  });
  localStorage.setItem("tabelData", JSON.stringify(data));
}
function autoSave() { saveTable(); }

// Hapus semua data
function clearTable() {
  Swal.fire({
    imageUrl: 'images/password.gif',
    imageWidth: 150,
    imageHeight: 150,
    title: 'Hapus Semua Data',
    text: 'Tindakan ini akan menghapus semua data!',
    input: 'password',
    inputPlaceholder: 'Password',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    customClass: {
      title: 'swal-title-center',
      input: 'swal-input-center'
    }
  }).then((result)=>{
    if(result.isConfirmed){
      if(result.value==='adit123'){
        localStorage.removeItem("tabelData");
        document.getElementById("tableBody").innerHTML="";
        rowCount=0;
        addRow();
        document.getElementById("popupBox").style.display="none";
        Swal.fire('Berhasil!', 'Semua data telah dihapus.', 'success');
      } else Swal.fire('Error','Password salah!','error');
    }
  });
}

// Cek kode
function cekKode() {
  const kode = document.getElementById("kodeInput").value.trim();
  const kodeHasil = document.getElementById("kodeHasil");
  const barisHasil = document.getElementById("barisHasil");
  const ikonHasil = document.getElementById("ikonHasil");
  if (kode==="") { kodeHasil.innerText="-"; barisHasil.innerText="-"; ikonHasil.innerText="🔍"; document.getElementById("popupBox").style.display="none"; return;}
  const rows = document.querySelectorAll("#tableBody tr");
  let foundAt=[];
  rows.forEach(row=>{
    let no=row.querySelector("td:first-child").innerText;
    let isi=row.querySelector("td input").value.trim();
    if(isi===kode) foundAt.push(no);
  });
  kodeHasil.innerText=kode;
  if(foundAt.length>0){ barisHasil.innerText=foundAt.join(", "); ikonHasil.innerText="✅"; }
  else{ barisHasil.innerText="Tidak ditemukan"; ikonHasil.innerText="❌"; }
  clearInput();
  showPopup(kode);
}

function clearInput(){ document.getElementById("kodeInput").value=""; }

// Popup
function showPopup(kode){
  const rows=document.querySelectorAll("#tableBody tr");
  let foundAt=[];
  rows.forEach(row=>{
    let no=row.querySelector("td:first-child").innerText;
    let isi=row.querySelector("td input").value.trim();
    if(isi===kode) foundAt.push(no);
  });
  const popup=document.getElementById("popupBox");
  const popupText=document.getElementById("popupText");
  const popupIcon=document.getElementById("popupIcon");
  const popupDetail=document.getElementById("popupDetail");
  if(foundAt.length>0){
    popupText.innerText="Selamat, data ditemukan!";
    popup.style.borderColor="green";
    popupIcon.innerHTML=`<img src="images/selamat.gif" alt="Selamat"/>`;
    let nomorHTML=foundAt.map(n=>`<span class="circle" style="background-color:green;">${n}</span>`).join(" ");
    let kodeHTML=`<span class="box" style="background-color:green;">${kode}</span>`;
    popupDetail.innerHTML=`${nomorHTML} ${kodeHTML}`;
  } else{
    popupText.innerText="Maaf, data tidak ditemukan!";
    popup.style.borderColor="red";
    popupIcon.innerHTML=`<img src="images/maaf.gif" alt="Maaf"/>`;
    let nomorHTML=`<span class="circle" style="background-color:red;">-</span>`;
    let kodeHTML=`<span class="box" style="background-color:red;">${kode}</span>`;
    popupDetail.innerHTML=`${nomorHTML} ${kodeHTML}`;
  }
  popup.style.display="block";
}