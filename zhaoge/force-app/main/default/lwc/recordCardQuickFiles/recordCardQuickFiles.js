import { LightningElement, api } from "lwc";
import LightningConfirm from 'lightning/confirm';
export default
class recordCardQuickFiles extends LightningElement {
 @api
 recordId;
 async onDeleteAllFilesButtonClick() {
  const confirmation = await LightningConfirm.open({
    message: "Are you sure you want to delete all files?",
    variant: "headerless",
    label: "Are you sure you want to delete all files?",
  });
   if (confirmation) {
      //... proceed with
     //... Apex Logic to delete Files.
    //... We will not check this comment.
    }
  }
}