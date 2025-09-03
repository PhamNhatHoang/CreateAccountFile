document.addEventListener("DOMContentLoaded", () => {
  // Hàm hiển thị toast
  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      // remove only the "show" class, giữ lại type để css vẫn đúng
      toast.classList.remove("show");
    }, 3000);
  }

  // Elements
  const introScreen = document.getElementById("intro-screen");
  const createAccountListBtn = document.getElementById("createAccountListBtn");
  const createPasswordChangeFileBtn = document.getElementById(
    "createPasswordChangeFileBtn"
  );

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

  const backButtons = document.querySelectorAll(".back-btn");

  // Hiển thị / ẩn màn hình
  function showScreen(screenToShow) {
    const screens = [introScreen, accountListScreen, passwordChangeScreen];
    screens.forEach((screen) => {
      screen.classList.toggle("hidden", screen !== screenToShow);
    });
  }

  createAccountListBtn.addEventListener("click", () =>
    showScreen(accountListScreen)
  );
  createPasswordChangeFileBtn.addEventListener("click", () =>
    showScreen(passwordChangeScreen)
  );

  backButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetScreen = document.getElementById(event.target.dataset.target);
      showScreen(targetScreen);
    });
  });

  // Toggle trạng thái nút copy dựa trên nội dung textarea
  function updateCopyButtonState(textarea, button) {
    const hasContent =
      textarea && textarea.value && textarea.value.trim().length > 0;
    button.disabled = !hasContent;
  }

  // Hàm copy robust
  async function copyToClipboard(text) {
    if (!text || !text.trim()) {
      showToast("Không có nội dung để sao chép!", "error");
      return false;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback: tạo textarea tạm thời để copy
        const tmp = document.createElement("textarea");
        tmp.value = text;
        tmp.setAttribute("readonly", "");
        tmp.style.position = "absolute";
        tmp.style.left = "-9999px";
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
      }
      showToast("Đã sao chép!", "success");
      return true;
    } catch (err) {
      console.error("Copy failed:", err);
      showToast(
        "Không thể sao chép — kiểm tra quyền clipboard hoặc thử thủ công.",
        "error"
      );
      return false;
    }
  }

  // Init trạng thái nút copy
  updateCopyButtonState(outputTextarea, copyBtn);
  updateCopyButtonState(changeOutputTextarea, copyChangeFileBtn);

  // Bắt sự kiện input trên textarea để update trạng thái nút copy khi user sửa/xoá
  outputTextarea.addEventListener("input", () =>
    updateCopyButtonState(outputTextarea, copyBtn)
  );
  changeOutputTextarea.addEventListener("input", () =>
    updateCopyButtonState(changeOutputTextarea, copyChangeFileBtn)
  );

  // Tạo file TaiKhoan|MatKhau|Server
  generateBtn.addEventListener("click", () => {
    const prefix = prefixInput.value;
    const suffix = suffixInput.value;
    const startNum = parseInt(startNumInput.value);
    const endNum = parseInt(endNumInput.value);
    const password = passwordInput.value;
    const server = serverInput.value;

    if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
      showToast('Vui lòng nhập số "Từ" và "Đến" hợp lệ!', "error");
      return;
    }

    const accountList = [];
    for (let i = startNum; i <= endNum; i++) {
      accountList.push(`${prefix}${i}${suffix}|${password}|${server}`);
    }

    outputTextarea.value = accountList.join("\n");
    updateCopyButtonState(outputTextarea, copyBtn);
    showToast("Danh sách tài khoản đã được tạo!", "success");
  });

  // Copy TaiKhoan|MatKhau|Server
  copyBtn.addEventListener("click", async () => {
    await copyToClipboard(outputTextarea.value);
  });

  // Tạo file TaiKhoan|MatKhauCu|MatKhauMoi
  generateChangeFileBtn.addEventListener("click", () => {
    const prefix = changePrefixInput.value;
    const suffix = changeSuffixInput.value;
    const startNum = parseInt(changeStartNumInput.value);
    const endNum = parseInt(changeEndNumInput.value);
    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;

    if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
      showToast('Vui lòng nhập số "Từ" và "Đến" hợp lệ!', "error");
      return;
    }

    const changeList = [];
    for (let i = startNum; i <= endNum; i++) {
      changeList.push(`${prefix}${i}${suffix}|${oldPassword}|${newPassword}`);
    }

    changeOutputTextarea.value = changeList.join("\n");
    updateCopyButtonState(changeOutputTextarea, copyChangeFileBtn);
    showToast("File đổi mật khẩu đã được tạo!", "success");
  });

  // Copy file TaiKhoan|MatKhauCu|MatKhauMoi
  copyChangeFileBtn.addEventListener("click", async () => {
    await copyToClipboard(changeOutputTextarea.value);
  });
});
