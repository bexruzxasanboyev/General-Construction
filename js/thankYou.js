const API_URL = "https://script.google.com/macros/s/AKfycbyK9CB_Hxsfn53C1QffBlg5HwalDJhwtYPs-wHd2Uj3Il5azQo1hWbvZVj7sHCgJpeDYg/exec";

async function sendLeadData() {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) return;

  const formDataObj = JSON.parse(formDataRaw);

  const formData = new FormData();
  formData.append("sheetName", "Lead");
  formData.append("Ism", formDataObj.Ism);
  formData.append("Telefon raqam", formDataObj.TelefonRaqam);
  formData.append("Royhatdan o'tgan vaqti", formDataObj.SanaSoat);

  try {
    const response = await fetch(API_URL, { method: "POST", body: formData });
    if (response.ok) {
      localStorage.removeItem("formData");
    } else {
      throw new Error("API response was not ok");
    }
  } catch (error) {
    console.error("Error submitting Lead form:", error);
    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "block";
  }
}

async function sendLead2Data() {
  const applyRaw = localStorage.getItem("applyFormData");
  if (!applyRaw) return;

  const applyObj = JSON.parse(applyRaw);

  const formData = new FormData();
  formData.append("sheetName", "Lead 2");
  formData.append("Ism", applyObj.Ism);
  formData.append("Telefon raqam", applyObj.TelefonRaqam);
  formData.append("Royhatdan o'tgan vaqti", applyObj.SanaSoat);
  formData.append("Qanday xonadon qidiryapsiz", applyObj.XonadonTuri);
  formData.append("Necha xonalik bo'lsin", applyObj.XonalarSoni);
  formData.append("Xozirgi yashash manzilingiz", applyObj.Manzil);

  try {
    const response = await fetch(API_URL, { method: "POST", body: formData });
    if (response.ok) {
      localStorage.removeItem("applyFormData");
    } else {
      throw new Error("API response was not ok");
    }
  } catch (error) {
    console.error("Error submitting Lead 2 form:", error);
    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "block";
  }
}

window.onload = function () {
  sendLeadData();
  sendLead2Data();
};