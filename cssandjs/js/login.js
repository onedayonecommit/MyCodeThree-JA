function login() {
  console.log("click");
  let id = $("#id").val();
  let pw = $("#pw").val();
  $.ajax({
    url: "/login",
    type: "post",
    data: {
      id: id,
      pw: pw,
    },
    success: (data) => {
      if (data == "suc") {
        alert("로그인 성공");
        window.location = "/";
      } else if (data == "fail") {
        alert("pw 확인 부탁드립니다.");
        id = "";
        pw = "";
      } else if (data == "noneid") {
        alert("없는 id 입니다.");
      }
    },
  });
}
