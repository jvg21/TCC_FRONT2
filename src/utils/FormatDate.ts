export function FormatDate(dateString:string, format = "yyyy-dd-MM") {
  const date = new Date(dateString);

  const map: { [key: string]: string } = {
    yyyy: String(date.getFullYear()),
    dd: String(date.getDate()).padStart(2, '0'),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };

  return format.replace(/yyyy|dd|MM|HH|mm|ss/g, matched => map[matched]);
}
