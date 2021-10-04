function doGet() {
	var template = HtmlService.createTemplateFromFile('site');
	return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
	try{
	return HtmlService.createHtmlOutputFromFile('site').setSandboxMode(
	HtmlService.SandboxMode.IFRAME);
	}
	catch(e){
	return HtmlService.createHtmlOutputFromFile('error').setSandboxMode(
	HtmlService.SandboxMode.IFRAME);
	}
}

function AppVisitor(time, ip, version, agent){
	var sheet = SpreadsheetApp.openById("1-cSxcOxcqK75apsSQFLphkprbXHk9XP0_Y-WIKKbLHE").getSheets()[4];
	sheet.appendRow([ time, ip, version, agent]);
}

function signUp(time, ip, information, version, agent){
	try{
	
	// Get Information such as User Name, Email, and Password
	
	var info = JSON.parse(information)
	var Name = info.userName
	var Email = info.email
	var Pass = info.password
	
	// Create Folder as Email under Student Folder
	
	var stuFolder = DriveApp.getFolderById("1CJK1aH5IBCqqYL3Tsoc-XUhI8eWxFHBK").createFolder(Email)
	
	// Create Sheet as Email and append a row with prametar's data. At last get Sheet Id
	
	var stuSheet = SpreadsheetApp.create(Email);
	stuSheet1 = stuSheet.getSheets()[0].setName('Profile')
	stuSheet.insertSheet().setName('Exam')
	stuSheet1.appendRow([ time, ip, information, version, agent]);
	stuId = stuSheet.getId()
	
	// Publish The sheet after enable drive api.l
	
	var fileId = stuId;
	var revisions = Drive.Revisions.list(fileId); 
	var items = revisions.items; 
	var revisionId =items[items.length-1].id; 
	var resource = Drive.Revisions.get(fileId, revisionId); 
	resource.published = true;
	resource.publishAuto = true;
	resource.publishedOutsideDomain = true;
	Drive.Revisions.update(resource, fileId, revisionId);
	DriveApp.getFileById(stuId).moveTo(stuFolder)
	
	// Append data such as Time, IP Address, Name, Email, Folder Id, Sheet Id in Information Sheet
	
	var infoSheet = SpreadsheetApp.openById("1p0tXfx0no8cLkdWoRUAf76lFwOYyCpXJHvT6tgjiScA").getSheets()[0];
	infoSheet.appendRow([ time, ip, Name, Email, stuFolder.getId(), stuId]);
	
	// Append data in login data sheet
	
	var loginSheet = SpreadsheetApp.openById("18t7M6WODlRi9G37lnz1B6CkKf86G2L3Y7TiYP0gnlKc").getSheets()[0];
	loginSheet.appendRow([ Email, Pass, stuId]);
	
	// Success
	
	return {
	'status' : 'success'
	}
	}
	catch(e){
	return {
	'status' : e
	}
	}
}

function SendCode(email, name, code){
  try{
  	var massageBody = "<div style='font: 600 15px Monospace;color:#333;'>Dear <b>"+name+"</b>,<br>Your varification code for Sign Up on Trimer is, <br><br><div style='font: 700 30px Monospace;text-align:center;color:#666;margin-top:50px'>"+code+"</div></div>"
    MailApp.sendEmail({
    to: email,
    subject: 'Verification Code',
    htmlBody: massageBody  });
    return {
    'massage': 'sended',
    }
  }
  catch(e){
    return {
      'massage': e,
     }
    }
  }