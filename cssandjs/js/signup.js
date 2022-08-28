function idcheck() {
  $.ajax({
    url: "/idcheck",
    type: "post",
    data: {
      id: $("#id").val(),
    },
    success: (data) => {
      switch (data) {
        case "suc":
          alert("사용 가능합니다.");
          break;
        case "fail":
          alert("현재 사용 중인 아이디 입니다.");
          break;
        default:
          alert("비 정상적인 행동이 감지되었습니다. 재 접속 부탁드립니다.");
          window.location = "/";
          break;
      }
    },
  });
}
function signupclick() {
  $.ajax({
    url: "/signup",
    type: "post",
    data: {
      id: $("#id").val(),
      pw: $("#pw").val(),
      email: $("#email").val(),
      authnumber: $("#authnumber").val(),
    },
    success: (data) => {
      switch (data) {
        case "suc":
          alert("내 코 석 회원이 되신걸 환영합니다.");
          window.location = "/deletesession";
          break;
        case "fail":
          alert(
            "인증받은 이메일 또는 인증번호, id중 변경한 이력이 확인되었습니다. 재 인증 및 중복 검사 바랍니다."
          );
        default:
          break;
      }
    },
  });
}
function emailauth() {
  $.ajax({
    url: "/authcheck",
    type: "post",
    data: {
      authnumber: $("#authnumber").val(),
    },
    success: (data) => {
      switch (data) {
        case "suc":
          alert("인증 완료되었습니다.");
          break;
        case "fail":
          alert(
            "인증번호가 다릅니다. 인증번호 확인 또는 재 인증 부탁드립니다."
          );
          break;
        case "timeover":
          alert("시간 초과 재 인증 바랍니다.");
          break;
        default:
          alert("예기치 못한 오류 발생 재 시도 부탁드립니다.");
          window.location = "/";
          break;
      }
    },
  });
}
function email() {
  $.ajax({
    url: "/email",
    type: "post",
    data: {
      email: $("#email").val(),
    },
    success: (data) => {
      switch (data) {
        case "suc":
          alert(
            "인증번호 발송 완료 5분 이내로 입력하세요. 메일이 도착하지 않은 경우 스펨메일함 또는 고객센터 문의 부탁드립니다."
          );
          break;
        case "fail":
          alert("이미 중복된 이메일 입니다. 다른 이메일 사용 부탁드립니다.");
          break;
        case "failed":
          alert("오류 발생 재 인증 부탁드립니다.");
          break;
        default:
          break;
      }
    },
  });
}
