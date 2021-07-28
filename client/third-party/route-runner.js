import request from 'postman-request';

const postRequest = async (url, data = {}) =>
  new Promise((resolve, reject) => {
    request.post(url, data, (error, response) => {
      if (error) reject(error);

      resolve(response);
    });
  });

export const getLocations = async (keyword) => {
  const url = 'https://www.routerunnersautotransport.com/zip-search-gm.php';
  const data = { form: { keyword } };
  const response = await postRequest(url, data);
  const { body } = response;

  return body;
};

export const getMake = async (year) => {
  const url = 'https://www.routerunnersautotransport.com/make-checker-gm.php';
  const data = { form: { a: year, is_ajax: 1 } };
  const response = await postRequest(url, data);
  const { body } = response;

  return body;
};

export const getModel = async (year, make) => {
  const url = 'https://www.routerunnersautotransport.com/model-checker-gm.php';
  const data = { form: { a: year, b: make, is_ajax: 1 } };
  const response = await postRequest(url, data);
  const { body } = response;

  return body;
};
