import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

export const createNotification = (type, title="aaa", message="aaa") => {
    //console.log("creating notification");
    //console.log(type);
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: true
        }
      });
};
