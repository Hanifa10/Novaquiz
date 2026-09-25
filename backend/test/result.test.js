const request = require("supertest");
const { randomUUID } = require("crypto");
const app = require("../server");
const db = require("../models/index");

describe("Result API", () => {

  let token;
  let quizId;
  let userId;
  let questionId;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    const userUUID = randomUUID();
    const lessonUUID = randomUUID();
    const quizUUID = randomUUID();
    const questionUUID = randomUUID();

    await request(app).post("/api/auth/register").send({
      lastName: "last",
      firstName: "User2",
      email: "user2@mail.com",
      password: "123456000"
    });

    const login = await request(app).post("/api/auth/login").send({
      email: "user2@mail.com",
      password: "123456000"
    });

    token = login.body.jwt;

    const user = await db.User.findOne({ where: { email: "user2@mail.com" } });
    userId = user.id;

    const lesson = await db.Lesson.create({
      id: lessonUUID,
      name: "Test Lesson",
      content: "Lesson content",
      user_id: userId
    });

    const quiz = await db.Quiz.create({
      id: quizUUID,
      name: "Quiz 1",
      lesson_id: lesson.id,
      user_id: userId
    });
    quizId = quiz.id;

    const question = await db.Question.create({
      id: questionUUID,
      quiz_id: quizId,
      question: "Capital France ?",
      answer_a: "Paris",
      answer_b: "Lyon",
      answer_c: "Marseille",
      answer_d: "Nice",
      correct_answer: "A"
    });
    questionId = question.id;
  });

  it("submit quiz result", async () => {

    const res = await request(app)
      .post("/api/result")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quizId: quizId,
        userId: userId,
        results: [
          {
            question: questionId,
            userAnswer: "A"
          }
        ]
      });

    expect(res.statusCode).toBe(200);
  });

  it("submit quiz result multiple times creates a new row each time", async () => {

    const firstRes = await request(app)
      .post("/api/result")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quizId: quizId,
        userId: userId,
        results: [
          {
            question: questionId,
            userAnswer: "A"
          }
        ]
      });

    const secondRes = await request(app)
      .post("/api/result")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quizId: quizId,
        userId: userId,
        results: [
          {
            question: questionId,
            userAnswer: "B"
          }
        ]
      });

    expect(firstRes.statusCode).toBe(200);
    expect(secondRes.statusCode).toBe(200);

    const profileRes = await request(app)
      .get("/api/result")
      .set("Authorization", `Bearer ${token}`);

    expect(profileRes.statusCode).toBe(200);
    expect(Array.isArray(profileRes.body)).toBe(true);
    expect(profileRes.body.length).toBeGreaterThanOrEqual(2);
  });

});