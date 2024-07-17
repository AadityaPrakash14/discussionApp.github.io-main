// console.log("Discussion App");

// let showAddQuestion = true;

let questionContainer = document.getElementById("questionContainer");
let rightPane = document.getElementById("rightPane");
let addQuesBtn = document.getElementById("addQuesBtn");
let searchQuestion = document.getElementById("searchQuestion");
// localStorage.removeItem("discussionQuestions");
let questions = localStorage.getItem("discussionQuestions");
let allQuestions;

addQuesBtn.addEventListener("click", displayAddQuestions);
searchQuestion.addEventListener("input", searchQues);

if (!questions) {
  allQuestions = [];
} else {
  allQuestions = JSON.parse(questions);
}

function searchQues() {
  let html = ``;
  let searchVal = searchQuestion.value.toLowerCase();
  // console.log(searchVal);

  let foundQues = allQuestions.filter((ques) =>
    ques.description.toLowerCase().includes(searchVal)
  );

  if (foundQues.length) {
    foundQues.forEach((question, index) => {
      html += `<div class="question" id=${
        question.id
      } onclick="displayResponse(${question.id})">
    <h2>${question.title}</h2>
                    <div>${question.description}</div>
                    ${question.upVote}
                    <i class="fa fa-thumbs-up" style="font-size:20px; margin:0 15px 8px 4px;"
                    onclick="upVote(${index + 1})"></i>
                    ${question.downVote}
                    <i class="fa fa-thumbs-down" style="font-size:20px;margin:0 0 8px 4px;"
                    onclick="downVote(${index + 1})"></i>
                    <hr></div>`;
    });
  } else {
    html = `<p class="notFound">NO match found</p>`;
  }
  questionContainer.innerHTML = html;
}

function displayAddQuestions() {
  let html = `<div class="createQuestionContainer" id="showAddQuestion">
  <h1 class="rightPaneHeading">Welcome to Discussion App</h1>
  <h4 class="rightPaneDesc">
    Enter a Subject and question to get started
  </h4>
  <input class="input" id="inputTopic" placeholder="Enter Topic" />
  <textarea
    rows="10"
    id="inputQuestion"
    class="input"
    placeholder="Enter Question"
  ></textarea>
  <button class="button" id="submitQuestion" onclick="addQuestion()">Submit</button>
  <div id="alert"></div>
  </div>`;

  rightPane.innerHTML = html;
}

function upVote(id) {
  allQuestions[id - 1].upVote++;
  // console.log(allQuestions[id - 1].upVote);

  localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
  displayQuestions();
}

function downVote(id) {
  allQuestions[id - 1].downVote++;
  localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
  displayQuestions();
}

function sortQuesByUpVote(allQuestions) {
  let byUpVote = allQuestions.slice(0);

  byUpVote.sort(function (a, b) {
    return b.upVote - a.upVote;
  });

  let adjustId = byUpVote.map((ques, index) => {
    return { ...ques, id: index + 1 };
  });
  return adjustId;
}

function displayQuestions() {
  let html = ``;
  // console.log(allQuestions);

  allQuestions = sortQuesByUpVote(allQuestions);
  localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));

  allQuestions.forEach((question, index) => {
    html += `<div class="question" id=${question.id} onclick="displayResponse(${
      question.id
    })">
    <h2>${question.title}</h2>
                    <div>${question.description}</div>
                    ${question.upVote}
                    <i class="fa fa-thumbs-up" style="font-size:20px; margin:0 15px 8px 4px;"
                    onclick="upVote(${index + 1})"></i>
                    ${question.downVote}
                    <i class="fa fa-thumbs-down" style="font-size:20px;margin:0 0 8px 4px;"
                    onclick="downVote(${index + 1})"></i>
                    <hr></div>`;
  });

  questionContainer.innerHTML = html;
}

displayAddQuestions();
displayQuestions();

function validateInput(title, desc) {
  // Validating Title
  let lst = title.split(" ");
  let arr = lst.filter((word) => word.length !== 0);
  if (arr.length === 0) return false;

  // Validating Desc
  lst = desc.split(" ");
  arr = lst.filter((word) => word.length !== 0);

  if (arr.length === 0) return false;

  lst = desc.split("\n");
  arr = lst.filter((word) => word.length !== 0);
  if (arr.length === 0) return false;

  return true;
}

function addResponse(id) {
  let responder = document.getElementById("responder");
  let responseAns = document.getElementById("responseAns");
  if (validateInput(responder.value, responseAns.value)) {
    let obj = allQuestions[id - 1];
    let resArr = obj.answer;
    let ansObj = {
      id: resArr.length + 1,
      name: responder.value,
      responseText: responseAns.value,
      upVote: 0,
      downVote: 0,
    };
    resArr.push(ansObj);
    obj.answer = resArr;
    allQuestions[id - 1] = obj;
    // console.log(obj);

    localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
    displayResponse(id);
  } else {
    let alert = document.getElementById("alert");
    setTimeout(() => {
      alert.innerText = "";
    }, 2000);
    alert.innerText = "Every Field is Compulsory";
  }
}

function resolveQuestion(id) {
  allQuestions.splice(id - 1, 1);
  let temp = allQuestions.map((ques, index) => {
    return { ...ques, id: index + 1 };
  });
  allQuestions = temp;
  localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
  displayAddQuestions();
  displayQuestions();
}

function upVoteResponse(questionId, id) {
  allQuestions[questionId - 1].answer[id - 1].upVote++;
  localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
  displayResponse(questionId);
}

function downVoteResponse(questionId, id) {
  allQuestions[questionId - 1].answer[id - 1].downVote++;
  localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
  displayResponse(questionId);
}

function sortResByUpVote(resArr) {
  let byUpVote = resArr.slice(0);

  byUpVote.sort(function (a, b) {
    return b.upVote - a.upVote;
  });
  return byUpVote;
}

function displayResponse(id) {
  // console.log(id);
  let obj = allQuestions[id - 1];
  let resArr = obj.answer;
  // console.log(resArr);

  let ansStr = ``;
  if (resArr.length >= 1) {
    resArr = sortResByUpVote(resArr);
    allQuestions[id - 1].answer = resArr;
    localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
    resArr.forEach((res, index) => {
      ansStr += `<div class="response">
      <div class="name">${res.name}</div>
      <div class="responseText">${res.responseText}</div>
      ${res.upVote}
      <i class="fa fa-thumbs-up" style="font-size:20px; margin:0 15px 8px 4px;cursor: pointer;"
      onclick="upVoteResponse(${id},${index + 1})"></i>
      ${res.downVote}
      <i class="fa fa-thumbs-down" style="font-size:20px;margin:0 0 8px 4px;cursor: pointer;"
      onclick="downVoteResponse(${id},${index + 1})"></i>
      <hr />
    </div>`;
    });
  }

  let html = `<div class="responseContainer" id="responseContainer">
  <div class="resHeading">Question</div>
  <div class="questionInfo">
    <div class="questionTopic">${obj.title}</div>
    <div class="questionDesc">${obj.description}</div>
  </div>
  <button class="button" onclick="resolveQuestion(${id})">Resolve</button>
  <div class="resHeading">Response</div>
  <div class="allResponse">
    ${ansStr}
  </div>
  <div class="resHeading">Add Response</div>
  <div class="addResponse">
    <input type="text" id="responder" class="input" placeholder="Enter Name" />
    <textarea
      placeholder="Enter Comment"
      id="responseAns"
      cols="30"
      rows="10"
      class="input"
    ></textarea>
  </div>
  <button class="button" onclick="addResponse(${id})">Submit</button>
  <div id="alert"></div>
</div>`;

  rightPane.innerHTML = html;
}

function addQuestion() {
  let inputTopic = document.getElementById("inputTopic");
  let inputQuestion = document.getElementById("inputQuestion");
  let obj = {
    id: allQuestions.length + 1,
    title: `${inputTopic.value}`,
    description: `${inputQuestion.value}`,
    answer: [],
    isResolved: false,
    upVote: 0,
    downVote: 0,
  };
  // console.log(obj);

  if (validateInput(obj.title, obj.description)) {
    allQuestions.push(obj);
    displayQuestions();
    localStorage.setItem("discussionQuestions", JSON.stringify(allQuestions));
  } else {
    let alert = document.getElementById("alert");
    setTimeout(() => {
      alert.innerText = "";
    }, 2000);
    alert.innerText = "Every Field is Compulsory";
  }
  inputTopic.value = "";
  inputQuestion.value = "";
  //   console.log(obj);
}
