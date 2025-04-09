// 날짜를 비교용 ISO 날짜 문자열로 포맷
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

// 사용자에게 보여줄 날짜 포맷 (예: 2025년 4월 10일 (목))
export const formatDisplay = (d) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const day = days[d.getDay()];
  return `${year}년 ${month}월 ${date}일 (${day})`;
};

// 시간까지 포함된 포맷 (예: 2025년 4월 10일 (목) 오후 2:05)
export const formatMonth = (d) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const day = days[d.getDay()];

  const hour = d.getHours();
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 || 12;

  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${year}년 ${month}월 ${date}일 (${day}) ${period} ${hour12}:${minute}`;
};