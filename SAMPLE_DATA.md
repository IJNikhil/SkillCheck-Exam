# Sample Data for SkillCheck

Since the API currently only supports adding *Students* and *Results*, you must manually add the **Questions** to your Google Sheet.

## 1. Tab: `MCQ`
Copy and paste these rows (excluding header if already present) into the `MCQ` sheet.
Columns: `ID | Module | Question | OptionA | OptionB | OptionC | OptionD | Answer`

```csv
1	Fundamentals	What is the shortcut for Copy?	Ctrl+C	Ctrl+V	Ctrl+X	Alt+F4	Ctrl+C
2	Fundamentals	Which device is an output device?	Mouse	Keyboard	Monitor	Scanner	Monitor
3	Excel	What symbol starts a formula?	+	=	-	@	=
4	Excel	Which function sums numbers?	ADD()	SUM()	TOTAL()	PLUS()	SUM()
5	Word	What is the shortcut for Bold?	Ctrl+B	Ctrl+I	Ctrl+U	Ctrl+P	Ctrl+B
6	Internet	What does HTML stand for?	Hyperlink	Hyper Text Markup Language	High Tool	None	Hyper Text Markup Language
7	Hardware	CPU stands for?	Central Process Unit	Central Processing Unit	Computer Unit	None	Central Processing Unit
8	Software	Which is an OS?	Windows	Word	Chrome	Mouse	Windows
9	Coding	React is a...	Language	Library	Database	Server	Library
10	Coding	Which is not a JS framework?	Angular	Vue	Laravel	React	Laravel
```
*(Repeat or add more rows to reach 40 for a full test, or the app will just shuffle what is available)*

## 2. Tab: `Typing`
Copy these rows into the `Typing` sheet.
Columns: `Level | Content`

```csv
Beginner	cat dog fish bird code java html css react node js api web app net
Beginner	The sun rises in the east and sets in the west everyday.
Intermediate	The quick brown fox jumps over the lazy dog repeatedly to test the typewriter.
Intermediate	Programming is the art of telling another human what one wants the computer to do.
Advanced	React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies.
Advanced	Serverless computing is a cloud computing execution model in which the cloud provider allocates machine resources on demand, taking care of the servers on behalf of their customers.
```
