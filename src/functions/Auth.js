import Firebase from "../firebasehelper";
const axios = require("axios");
var md5 = require("md5");
var getMonth = month => {
  switch (month) {
    case "01":
      return "January";
    case "02":
      return "February";
    case "03":
      return "March";
    case "04":
      return "April";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "August";
    case "09":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";
    default:
      return "January";
  }
};

export const doSMS = async (phoneNumber, pin, brand) => {
  console.log("brand", brand);

  try {
    let url = "";
    url = `https://apricot-mole-2227.twil.io/sms?phoneNumber=${phoneNumber}&pin=${pin}&brand=${brand}`;
    let response = await fetch(url, {
      method: "GET"
    });
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};
export const ticket_create_SMS = async (
  phoneNumber,
  username,
  ticket_name,
  brand_name
) => {
  try {
    let url = "";
    url = `https://apricot-mole-2227.twil.io/ticket_create?phoneNumber=${phoneNumber}&username=${username}&ticket_name=${ticket_name}&brand_name=${brand_name}`;
    let response = await fetch(url, {
      method: "GET"
    });
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};
export const clearZero = function(str) {
  if (str.charAt(0) === "0") str = str.replace("0", "");
  return str;
};
export function isDateValidate(date) {
  if (
    date &&
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
      date
    )
  )
    return true;
  else return false;
}

export async function getTicketNumber(name) {
  console.log("name", name);
  let category_id = await Firebase.getCategoryIDbyTitle(name);
  console.log("category_id", category_id);
  return category_id;
}
export const getStringfromSeconds = function(time) {
  var t = new Date(parseInt(time));
  var dd = String(t.getDate()).padStart(2, "0");
  var mm = String(t.getMonth() + 1).padStart(2, "0"); //January is 0!
  var month = getMonth(mm);
  t = dd + "th " + month;
  return t;
};
export const loadScript = function(
  company_name,
  company_logo,
  company_privacy,
  onload
) {
  const script = document.createElement("script");
  script.src = "https://resources.fidel.uk/sdk/js/v2/fidel.js";
  script.async = true;
  script.onload = onload;
  script.type = "text/javascript";
  script.class = "fidel-form";
  script.setAttribute("data-company-name", company_name);
  script.setAttribute(
    "data-key",
    "pk_test_2aec8c1f-f4e9-4384-9f02-6644fb5b1a13"
  );
  script.setAttribute(
    "data-program-id",
    "532b2a8a-9306-4be4-b317-ed42439701f8"
  );
  script.setAttribute("data-callback", "fidelCallback");
  script.setAttribute("data-country-code", "GBR");
  script.setAttribute("data-metadata", "metadata");
  script.setAttribute("data-auto-open", "false");
  script.setAttribute("data-auto-close", "false");
  script.setAttribute("data-background-color", "#ffffff");
  script.setAttribute("data-button-color", "4dadea");
  script.setAttribute("data-button-title", "Link Card");
  script.setAttribute("data-button-title-color", "#ffffff");
  script.setAttribute("data-lang", "en");
  script.setAttribute("data-logo", company_logo);
  script.setAttribute(
    "data-subtitle",
    "Earn 1 point for every £1 spent online or in-store"
  );
  script.setAttribute("data-subtitle-color", "#000000");
  script.setAttribute("data-privacy-url", company_privacy);
  script.setAttribute(
    "data-delete-instructions",
    "tapping remove in your settings page."
  );
  script.setAttribute("data-terms-color", "#000000");
  script.setAttribute("data-title", "Link Card");
  script.setAttribute("data-title-color", "#000000");
  document.body.appendChild(script);
};
export const add_NimdaUser = async (dob, firstname, phonenumber) => {
  let phone = phonenumber.replace("+", "");
  let acc = md5(firstname + phone + "19kjhys");
  console.log("dob", dob);
  console.log("firstname", firstname);
  console.log("phonenumber", phonenumber);
  console.log("secret_code", acc);
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/nimda_addUser",
      {
        dob: dob,
        firstname: firstname,
        phonenumber: phonenumber,
        secret_code: acc
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw new Error(err.response.data);
  }
};

export const add_NimdaCard = async (nimda_id, fidel_id) => {
  let acc = md5(nimda_id + "19kjhys");
  console.log("nimda_id", nimda_id);
  console.log("fidel_id", fidel_id);
  console.log("secret_code", acc);
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/nimda_addCard",
      {
        nimda_id: nimda_id,
        fidel_id: fidel_id,
        secret_code: acc
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw new Error(err.response.data);
  }
};
