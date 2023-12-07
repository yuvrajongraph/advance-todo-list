// function to handle the comparision between two date and time
export const compareIst = (date1, date2) => {
  const istTimeZone = "Asia/Kolkata";
  const date1IST = new Date(
    new Date(date1).toLocaleString("en-US", {
      timeZone: istTimeZone,
    })
  );
  const date2IST = new Date(
    date2.toLocaleString("en-US", { timeZone: istTimeZone })
  );
  return {date1IST, date2IST};
};


