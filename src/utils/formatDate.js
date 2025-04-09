export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

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
