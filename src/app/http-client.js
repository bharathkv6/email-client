class HttpClient {
  fetchEmailList = async () => {
    try {
      const data = await fetch('https://flipkart-email-mock.vercel.app/');
      const response = await data.json();
      return response;
    } catch (err) {
      return {
        list: [],
        total: 0
      };
    }
  };

  fetchEmailBody = async id => {
    try {
      const data = await fetch(
        `https://flipkart-email-mock.vercel.app/?id=${id}`
      );
      const response = await data.json();
      return response;
    } catch (err) {
      return {
        id: '',
        body: ''
      };
    }
  };
}

export default HttpClient;