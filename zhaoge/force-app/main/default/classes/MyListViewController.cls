public with sharing class MyListViewController{
	String tet;
	Transient Contact c;

	public String getText(){
		return tet;
	}

	public void setText(String s){
		this.tet = s;
	}

	public Contact getcon(){
		return this.c;
	}

	public Pagereference deleteConList(){
		try{
			List<Contact> delCons = [select Id
			                         from Contact
			                         where FirstName like 'VisualforceLst%'];
            delete delCons;
            return null;
		} catch (Exception e){
			ApexPages.Message message = new ApexPages.Message(ApexPages.severity.ERROR, e.getMessage());
            ApexPages.addMessage(message);
            return null;
		}
	}

	public void createConList(){
		try{
			List<Contact> conList = new List<Contact>();
			for (Integer i = 0; i < 1000; i++){
				Contact con = new Contact(FirstName = 'VisualforceLst', LastName = String.valueOf(i), Phone = '1000 0000 ' + i);
				conList.add(con);
			}
			insert conList;
		} catch (Exception e){
			ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.ERROR, e.getMessage());
			ApexPages.addMessage(message);
		}
	}

	public List<Contact> getConList(){
		try{
			List<Contact> contacts = [select FirstName, LastName, Phone
			                          from Contact
			                          where FirstName like 'VisualforceLst%'];
			return contacts;
		} catch (Exception e){
			ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.ERROR, e.getMessage());
			ApexPages.addMessage(message);
			return null;
		}
	}

	public Pagereference docon(){
		List<Contact> cons = new List<Contact>();
		// List<Contact> cons = (List<Contact>)[Find :tet In All Fields Returning Contact(FirstName,LastName,Phone where LastName = '99')][0];
		// List<Contact> cons = [select FirstName,LastName,Phone from Contact where FirstName Like 'VisualforceLst%' And LastName = '99'];
		try{
			cons = (List<Contact>)[Find : tet In All Fields Returning Contact(FirstName, LastName, Phone where LastName = '99')][0];
			if (cons.size() > 0){
				this.c = cons[0];
			} else{
				this.c = new Contact();
			}
			return null;
		} catch (Exception e){
			ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.ERROR, e.getMessage());
			ApexPages.addMessage(message);
			return null;
		}
	}
}