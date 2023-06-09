import axios from "axios";
import Message from "@/utils/Message";
//自定义Loading组件
import { load } from "@/utils/Loading";

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";

const instance = axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      load.show("加载中");
    }
    return config;
  },
  (error) => {
    if (error.config.showLoading) {
      load.hide();
    }
    Message.error("请求发送失败");
    return Promise.reject(new Error("请求发送失败"));
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { showLoading, errorCallback } = response.config;
    if (showLoading) {
      load.hide();
    }
    const responseData = response.data;
    if (responseData.code === 200) {
      return responseData;
    } else if (responseData.code === 901) {
      userStore.updateShowLogin(true);
      userStore.updateLoginUserInfo(null);
      return Promise.reject({ showError: false, msg: "登录超时" });
    } else {
      if (errorCallback) {
        errorCallback(responseData);
      }
      return Promise.reject({
        showError: response.config.showError,
        msg: responseData.info,
      });
    }
  },
  (error) => {
    if (error.config.showLoading) {
      load.hide();
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);

const request = (config) => {
  const {
    url,
    params,
    dataType,
    errorCallback,
    showLoading = true,
    showError = true,
  } = config;
  let contentType = contentTypeForm;
  let formData = new FormData();
  for (let key in params) {
    formData.append(key, params[key] === undefined ? "" : params[key]);
  }
  if (dataType === "json") {
    contentType = contentTypeJson;
  }
  let headers = {
    "Content-Type": contentType,
    "X-Requested-With": "XMLHttpRequest",
  };
  return instance
    .post(url, formData, {
      headers: headers,
      showLoading: showLoading,
      errorCallback: errorCallback,
      showError: showError,
    })
    .catch((error) => {
      if (error.showError) {
        Message.error(error.msg);
      }
      return null;
    });
};

export default request;
