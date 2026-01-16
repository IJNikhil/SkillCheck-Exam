// Google Apps Script Code
// Deploy this as a Web App: Execute as 'Me', Access: 'Anyone'

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getStudents') {
    return getStudents();
  } else if (action === 'getQuestions') {
    return getQuestions();
  } else {
    return ContentService.createTextOutput("Invalid Action").setMimeType(ContentService.MimeType.TEXT);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'addStudent') {
      return addStudent(data);
    } else if (action === 'submitResult') {
      return submitResult(data);
    } else {
      return responseJSON({ error: "Invalid Action" });
    }
  } catch (error) {
    return responseJSON({ error: error.toString() });
  }
}

// --- Helper Functions ---

function getStudents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove headers
  
  const students = data.map(row => {
    return {
      id: row[0],
      name: row[1],
      phone: row[2].toString(),
      batch: row[3],
      status: row[4]
    };
  });
  
  return responseJSON(students);
}

function getQuestions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Questions");
  // Assuming simpler structure: Column A = Type (MCQ/Typing), B = JSON Content
  // Ideally, use separate tabs, but for simplicity let's stick to the plan:
  // Tab 'MCQ': ID, Module, Question, OptA, OptB, OptC, OptD, Ans
  // Tab 'Typing': Level, Text
  
  const mcqSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MCQ");
  const mcqData = mcqSheet ? mcqSheet.getDataRange().getValues() : [];
  mcqData.shift(); // Remove headers
  
  const mcqs = mcqData.map(row => ({
    id: row[0],
    module: row[1],
    q: row[2],
    options: [row[3], row[4], row[5], row[6]],
    ans: row[7]
  }));
  
  const typingSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Typing");
  const typingData = typingSheet ? typingSheet.getDataRange().getValues() : [];
  typingData.shift();
  
  // Group typing by level
  const typing = {
    beginner: typingData.filter(r => r[0].toLowerCase() === 'beginner').map(r => r[1]),
    intermediate: typingData.filter(r => r[0].toLowerCase() === 'intermediate').map(r => r[1]),
    advanced: typingData.filter(r => r[0].toLowerCase() === 'advanced').map(r => r[1])
  };
  
  return responseJSON({ mcq: mcqs, typing: typing });
}

function addStudent(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");
  // ID, Name, Phone, Batch, Status
  const newId = "STU" + (sheet.getLastRow() + 1).toString().padStart(3, '0');
  sheet.appendRow([newId, data.name, data.phone, "Batch A", "pending"]);
  return responseJSON({ success: true, id: newId });
}

function submitResult(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Results");
  // Name, Phone, MCQ Score, WPM, Accuracy, Date
  sheet.appendRow([data.name, data.phone, data.mcq_score, data.wpm, data.accuracy, new Date()]);
  return responseJSON({ success: true });
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  // Run this once to create tabs if they don't exist
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("Students")) ss.insertSheet("Students").appendRow(["ID", "Name", "Phone", "Batch", "Status"]);
  if (!ss.getSheetByName("MCQ")) ss.insertSheet("MCQ").appendRow(["ID", "Module", "Question", "OptionA", "OptionB", "OptionC", "OptionD", "Answer"]);
  if (!ss.getSheetByName("Typing")) ss.insertSheet("Typing").appendRow(["Level", "Content"]);
  if (!ss.getSheetByName("Results")) ss.insertSheet("Results").appendRow(["Name", "Phone", "MCQ Score", "WPM", "Accuracy", "Date"]);
}
