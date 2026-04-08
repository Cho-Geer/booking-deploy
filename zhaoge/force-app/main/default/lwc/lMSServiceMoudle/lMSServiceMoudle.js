import { ShowToastEvent } from "lightning/platformShowToastEvent";


  const showInfoEvent = (that,title, message, variant) => {
    that.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }

export { showInfoEvent };