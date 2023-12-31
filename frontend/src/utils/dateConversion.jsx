export const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// function to format the date into YYYY-MM-DDTHH-MM 
export const formatDateToYYYYMMDDTHHMM = (date) => {
  const inputDate = new Date(date);

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");
  const seconds = String(inputDate.getSeconds()).padStart(2, "0");

  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  return formattedDate;
};

export const formatYYYYMMDDTHHMMToIndianStandardTime = (date) => {
  const inputDate = new Date(date);
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  const formattedDate = inputDate.toLocaleString("en-US", options);

  return formattedDate;
};


export const formatIsoToIst = (date)=>{
  const utcTime = new Date(date);
  const istTime = new Date(utcTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return istTime;
}