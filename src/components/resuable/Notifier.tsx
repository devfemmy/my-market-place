import {Notifier, NotifierComponents} from 'react-native-notifier';


export const Notification = (title : string) => {
    
    Notifier.showNotification({
        title: title,
        // description: "tghdddfdfd",
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'success',
        },
     });
        
};