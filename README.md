# FullStack Ruay

<div>
  <h1>Step 1: </h1>
  <h3>Install Programs (Necessary)</h3>

  *[IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/?section=windows)*  *เลื่อนไปข้างล่างหน่อยเด้อ*

  *[POSTMAN](https://www.postman.com/downloads/)* *ตัวทดสอบ API*

  ถ้ามี <strong>XAMPP</strong> แล้วไม่จำเป็นต้องติดตั้ง

  *[Laragon](https://laragon.org/download/)*  (**recommend**)
  
  *[Xampp](https://www.apachefriends.org/download.html)*
  
</div>

<hr/>

<div>
  <h1>Step : 2</h1>
  <h3>Install NodeJS And Java JDK 17 (For this project only)</h3>

  *[Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)*
  
  *[NodeJS](https://nodejs.org/en)*
</div>

<hr/>

<h1>ตอนนีั้ Step 3 ยังไม่จำเป็น <strong>อย่าเพิ่งทำ</strong> </h1>
<div>
  <h1>Step : 3</h1>
  <h3>ดาวน์โหลด Modules ให้ ReactJS เพื่อที่จะให้ทำงานตรงกัน</h3>
<p>เข้าไปยัง Folder <strong><i>ruay3</i></strong> แล้วใช้คำสั่งด้านล่างนี้</p>

  ```nodejs
    npm i
  ```
หรือ
```nodejs
    npm install
  ```
  <p>อันไหนก็ได้ ความหมายเดียวกัน</p>
  รันโปรเจค
  ```nodejs
    npm run dev
  ```
</div>

<div>
  <h2>## Ruay = Spring Boot: Backend</h2>
  <h2>## ruay3 = ReactJS: Frontend</h2>
</div>
<hr />

<h3>AUTH API ROUTE</h3>

| Method | URI              | Description   | Request Body                          | Response Body |
|--------|------------------|---------------|---------------------------------------|---------------|
| POST   | /api/auth/login  | Login  User   | usernameOrEmail, Password                      | OK            |
| POST   | /api/auth/signup | Register User | name, username, email, password, role | [{ Data }]     |

