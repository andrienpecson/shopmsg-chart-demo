import { notification } from "antd";

export const openNotification = ({ type, title, description }) => {
    notification[type]({
        message: title,
        description,
    });
};