exports.getDate = (language) => {

  let today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  return today.toLocaleDateString(language, options);
  
}

exports.getDay = (language) => {

  let today = new Date();

  const options = {
    weekday: "long"
  }

  return today.toLocaleDateString(language, options);

}

