class Util {
  setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  getLocalStorage = key => {
    return localStorage.getItem(key);
  };

  formatDate = timestamp => {
    const dateObj = new Date(timestamp);
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    let hour = dateObj.getHours();
    const minute = dateObj.getMinutes();

    let meridian = 'am';
    if (hour === 0) {
      hour = 12;
      meridian = 'am';
    } else if (hour > 12) {
      hour -= 12;
      meridian = 'pm';
    } else if (hour === 12) {
      meridian = 'pm';
    }

    return `${date}/${month}/${year} ${hour}:${minute}${meridian}`;
  };
}

export default Util;
