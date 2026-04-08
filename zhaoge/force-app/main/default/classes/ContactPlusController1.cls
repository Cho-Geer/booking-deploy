global with sharing class ContactPlusController1{
	public List<ContactBean> contactList{
		get{
			List<ContactBean> contactTmpList = new List<ContactBean>();
			for (Contact con : ContactDAO.getContactList()){
				ContactBean bean = new ContactBean();
				bean.Id = con.id;
				bean.lastName = con.LastName;
				bean.firstName = con.FirstName;
				bean.phone = con.Phone;
				bean.mail = con.Email;
				contactTmpList.add(bean);
			}
			return contactTmpList;
		}
	}

	webservice static void handleValueAdd(){
		Integer n = 0;
		String str = 'Taozixi';
		String numr = '1112222333';
		String mail = 'zhaogeyinzuo@outlook';
		List<ContactBean> contactList = new List<ContactBean>();
		List<Contact> conts = new List<Contact>();
		for (Contact con : ContactDAO.getContactList()){
			ContactBean bean = new ContactBean();
			bean.Id = con.Id;
			bean.lastName = con.LastName;
			if(String.isNotBlank(con.FirstName))bean.firstName = con.FirstName;
			else {
				con.FirstName = str + n;
				bean.firstName = con.FirstName;
			}
			if(String.isNotBlank(con.Phone))bean.phone = con.Phone;
			else {
				con.Phone = numr  + n;
				bean.phone = con.Phone;
			}
			if(String.isNotBlank(con.Email))bean.mail = con.Email;
			else {
				con.Email = mail + n + '.com';
				bean.mail = con.Email;
			}
			contactList.add(bean);
			conts.add(con);
			n++;
		}
		update conts;
        system.debug(conts);
	}
}