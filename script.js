document.addEventListener("DOMContentLoaded", () => {
  // Toast
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  // Elements
  const introScreen = document.getElementById("intro-screen");
  const createAccountListBtn = document.getElementById("createAccountListBtn");
  const createPasswordChangeFileBtn = document.getElementById(
    "createPasswordChangeFileBtn"
  );
  const createFromFileBtn = document.getElementById("createFromFileBtn");

  const accountListScreen = document.getElementById("account-list-screen");
  const prefixInput = document.getElementById("prefix");
  const suffixInput = document.getElementById("suffix");
  const startNumInput = document.getElementById("startNum");
  const endNumInput = document.getElementById("endNum");
  const passwordInput = document.getElementById("password");
  const serverInput = document.getElementById("server");
  const generateBtn = document.getElementById("generateBtn");
  const outputTextarea = document.getElementById("output");
  const copyBtn = document.getElementById("copyBtn");

  const passwordChangeScreen = document.getElementById(
    "password-change-screen"
  );
  const changePrefixInput = document.getElementById("changePrefix");
  const changeSuffixInput = document.getElementById("changeSuffix");
  const changeStartNumInput = document.getElementById("changeStartNum");
  const changeEndNumInput = document.getElementById("changeEndNum");
  const oldPasswordInput = document.getElementById("oldPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const generateChangeFileBtn = document.getElementById(
    "generateChangeFileBtn"
  );
  const changeOutputTextarea = document.getElementById("changeOutput");
  const copyChangeFileBtn = document.getElementById("copyChangeFileBtn");

  const fromFileScreen = document.getElementById("from-file-screen");
  const uploadFile = document.getElementById("uploadFile");
  const filePasswordInput = document.getElementById("filePassword");
  const fileServerInput = document.getElementById("fileServer");
  const generateFromFileBtn = document.getElementById("generateFromFileBtn");
  const fileOutputTextarea = document.getElementById("fileOutput");
  const copyFromFileBtn = document.getElementById("copyFromFileBtn");

  const backButtons = document.querySelectorAll(".back-btn");

  // Show screen
  function showScreen(screenToShow) {
    const screens = [
      introScreen,
      accountListScreen,
      passwordChangeScreen,
      fromFileScreen,
    ];
    screens.forEach((s) => s.classList.toggle("hidden", s !== screenToShow));
  }

  // Navigation
  createAccountListBtn.addEventListener("click", () =>
    showScreen(accountListScreen)
  );
  createPasswordChangeFileBtn.addEventListener("click", () =>
    showScreen(passwordChangeScreen)
  );
  createFromFileBtn.addEventListener("click", () => showScreen(fromFileScreen));

  backButtons.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const target = document.getElementById(e.target.dataset.target);
      showScreen(target);
    })
  );

  // Helpers
  function updateCopyButtonState(textarea, button) {
    button.disabled = !(textarea && textarea.value.trim().length > 0);
  }

  async function copyToClipboard(text) {
    if (!text || !text.trim()) {
      showToast("Không có nội dung để sao chép!", "error");
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("Đã sao chép!", "success");
      return true;
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("Không thể sao chép!", "error");
      return false;
    }
  }

  // --- Tạo list TaiKhoan|MatKhau|Server ---
  generateBtn.addEventListener("click", () => {
    const startNum = parseInt(startNumInput.value);
    const endNum = parseInt(endNumInput.value);
    if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
      showToast('Vui lòng nhập số "Từ" và "Đến" hợp lệ!', "error");
      return;
    }
    const result = [];
    for (let i = startNum; i <= endNum; i++) {
      result.push(
        `${prefixInput.value}${i}${suffixInput.value}|${passwordInput.value}|${serverInput.value}`
      );
    }
    outputTextarea.value = result.join("\n");
    updateCopyButtonState(outputTextarea, copyBtn);
    showToast("Danh sách đã được tạo!", "success");
  });
  copyBtn.addEventListener("click", () =>
    copyToClipboard(outputTextarea.value)
  );

  // --- Tạo list TaiKhoan|MatKhauCu|MatKhauMoi ---
  generateChangeFileBtn.addEventListener("click", () => {
    const startNum = parseInt(changeStartNumInput.value);
    const endNum = parseInt(changeEndNumInput.value);
    if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
      showToast('Vui lòng nhập số "Từ" và "Đến" hợp lệ!', "error");
      return;
    }
    const result = [];
    for (let i = startNum; i <= endNum; i++) {
      result.push(
        `${changePrefixInput.value}${i}${changeSuffixInput.value}|${oldPasswordInput.value}|${newPasswordInput.value}`
      );
    }
    changeOutputTextarea.value = result.join("\n");
    updateCopyButtonState(changeOutputTextarea, copyChangeFileBtn);
    showToast("Danh sách đổi mật khẩu đã được tạo!", "success");
  });
  copyChangeFileBtn.addEventListener("click", () =>
    copyToClipboard(changeOutputTextarea.value)
  );

  // --- Tạo list từ file upload ---
  generateFromFileBtn.addEventListener("click", () => {
    const file = uploadFile.files[0];
    if (!file) {
      showToast("Vui lòng chọn file .txt!", "error");
      return;
    }
    const password = filePasswordInput.value;
    const server = fileServerInput.value;
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");
      if (lines.length === 0) {
        showToast("File không có dữ liệu!", "error");
        return;
      }
      const result = lines.map((u) => `${u}|${password}|${server}`);
      fileOutputTextarea.value = result.join("\n");
      updateCopyButtonState(fileOutputTextarea, copyFromFileBtn);
      showToast("Danh sách từ file đã được tạo!", "success");
    };
    reader.readAsText(file);
  });
  copyFromFileBtn.addEventListener("click", () =>
    copyToClipboard(fileOutputTextarea.value)
  );

  // Init copy buttons state
  updateCopyButtonState(outputTextarea, copyBtn);
  updateCopyButtonState(changeOutputTextarea, copyChangeFileBtn);
  updateCopyButtonState(fileOutputTextarea, copyFromFileBtn);
});
