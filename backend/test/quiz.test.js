const request = require("supertest");
const { randomUUID } = require("crypto");
const app = require("../server");
const db = require("../models/index");

describe("Quiz API", () => {

  let token;
  let lessonId;
  let quizId;

  beforeAll(async () => {

    await db.sequelize.sync({ force: true });

    const userId = randomUUID();

    await request(app).post("/api/auth/register").send({
      lastName: "User",
      firstName: "up",
      email: "user1@mail.com",
      password: "123456000"
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "user1@mail.com",
      password: "123456000"
    });

    token = login.body.jwt;

    const user = await db.User.findOne({ where: { email: "user1@mail.com" } });
    const lessonUUID = randomUUID();
    const secondLessonUUID = randomUUID();

    const lesson = await db.Lesson.create({
      id: lessonUUID,
      name: "Test Lesson",
      content: "Lesson content",
      user_id: user.id
    });

    const secondLesson = await db.Lesson.create({
      id: secondLessonUUID,
      name: "Second Lesson",
      content: "Lesson content for quiz",
      user_id: user.id
    });

    lessonId = secondLesson.id;

    const quizUUID = randomUUID();
    const quiz = await db.Quiz.create({
      id: quizUUID,
      name: "Quiz 1",
      lesson_id: lesson.id,
      user_id: user.id
    });

    quizId = quiz.id;
  });

  it("create quiz", async () => {

    const res = await request(app)
      .post("/api/quiz")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Quiz 2",
        lessonId: lessonId
      });

    expect(res.statusCode).toBe(201);
  });

  it("add question", async () => {
    const createdQuiz = await db.Quiz.findOne({ where: { name: "Quiz 2" } });

    expect(createdQuiz).not.toBeNull();

    const res = await request(app)
      .post(`/api/quiz/${createdQuiz.id}/questions`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "2+2 ?",
        answer_a: "3",
        answer_b: "4",
        answer_c: "5",
        answer_d: "6",
        correct_answer: "B"
      });

    expect(res.statusCode).toBe(200);
  });

});