# NovaQuiz

NovaQuiz est une application web de quiz et de cours destinée à la création, la gestion et la passation de questionnaires pédagogiques. Le projet permet à un utilisateur de :

- créer des cours,
- associer un quiz à un cours,
- ajouter des questions à un quiz,
- répondre aux questions,
- consulter son historique de résultats,
- gérer son profil et sa progression.

Le projet est divisé en deux parties principales :

- un backend API en Node.js / Express / Sequelize,
- un frontend en React / Vite.

La base de données utilisée est MySQL et l'ensemble du projet peut être lancé via Docker Compose.

## 1. Fonctionnement global

L'application suit un flux simple :

1. L'utilisateur s'inscrit ou se connecte.
2. Il crée un cours via le module de cours.
3. Il crée un quiz associé à ce cours.
4. Il ajoute des questions avec leurs réponses et la bonne réponse.
5. Il passe le quiz depuis le frontend.
6. Le backend valide chaque réponse, calcule le score et enregistre le résultat.
7. Le profil utilisateur affiche l'historique des résultats.

Le système utilise un JWT pour sécuriser les routes backend. Chaque action sensible est protégée par un middleware d'authentification.

## 2. Objectif du projet

Le projet a un esprit de plateforme d'apprentissage légère, orientée module par module.

## 3. Stack technique

### Frontend

- React 19
- Vite
- React Router
- Axios
- CSS personnalisé (pas de Tailwind dans cette version)

### Backend

- Node.js
- Express
- Sequelize ORM
- MySQL
- JWT pour l'authentification
- bcrypt pour le hashage des mots de passe
- Helmet et CORS pour la sécurité

### Infrastructure

- Docker
- Docker Compose

## 4. Architecture du projet

Voici la structure du projet :

```text
Novaquiz/
├─ backend/
│  ├─ config/
│  │  └─ database.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ lessonController.js
│  │  ├─ questionController.js
│  │  ├─ quizController.js
│  │  └─ resultController.js
│  ├─ middlewares/
│  │  └─ authMiddleware.js
│  ├─ models/
│  │  ├─ index.js
│  │  ├─ lessonModel.js
│  │  ├─ questionModel.js
│  │  ├─ quizModel.js
│  │  ├─ resultModel.js
│  │  └─ userModel.js
│  ├─ routes/
│  │  ├─ authRoute.js
│  │  ├─ lessonRoute.js
│  │  ├─ questionRoute.js
│  │  ├─ quizRoute.js
│  │  └─ resultRoute.js
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ lessonService.js
│  │  ├─ questionService.js
│  │  ├─ quizService.js
│  │  └─ resultService.js
│  ├─ test/
│  │  ├─ auth.test.js
│  │  ├─ quiz.test.js
│  │  ├─ result.test.js
│  │  └─ setup.js
│  ├─ server.js
│  ├─ package.json
│  └─ Dockerfile
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ index.html
│  └─ Dockerfile
├─ docker-compose.yml
├─ README.md
└─ ...
```

### 4.1 Backend

Le backend est une API Express qui centralise la logique métier dans des contrôleurs et des services.

Principales entités :

- User : utilisateur authentifié
- Lesson : un cours / une leçon
- Quiz : un questionnaire lié à un cours
- Question : une question du quiz
- Result : résultat enregistré pour un quiz et un utilisateur

Relations principales :

- Un utilisateur a plusieurs cours
- Un utilisateur a plusieurs quiz
- Un cours possède un quiz (relation 1:1)
- Un quiz contient plusieurs questions
- Un utilisateur a plusieurs résultats
- Un quiz est associé à plusieurs résultats

### 4.2 Frontend

Le frontend est une application React qui contient plusieurs pages :

- authentification (login / inscription),
- accueil,
- liste des cours,
- création / modification d'un cours,
- liste des quiz,
- passage d'un quiz,
- gestion des questions,
- profil utilisateur et historique des résultats.

Le router gère les pages protégées et redirige vers la page de connexion si l'utilisateur n'est pas authentifié.

## 5. Comment ça fonctionne côté application

### Authentification

Le backend expose les routes suivantes :

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Le mot de passe est hashé avec bcrypt. Un JWT est créé à la connexion et envoyé au frontend, qui le stocke dans le `localStorage`.

### Gestion des cours

Routes principales :

- `GET /api/lesson`
- `POST /api/lesson`
- `PATCH /api/lesson/:id`
- `DELETE /api/lesson/:id`

Un cours est lié à un utilisateur (`user_id`). Un cours ne peut être modifié ou supprimé que par son propriétaire.

### Gestion des quiz

Routes principales :

- `GET /api/quiz`
- `POST /api/quiz`
- `GET /api/quiz/lesson/:lessonId`
- `GET /api/quiz/:id/questions`
- `POST /api/quiz/:id/questions`
- `POST /api/quiz/:id/answer`
- `DELETE /api/quiz/:id`

Le quiz est associé à une leçon. Le frontend construit le parcours d'un quiz à partir des questions liées à ce quiz.

### Gestion des résultats

Routes principales :

- `POST /api/result`
- `GET /api/result`
- `GET /api/result/user/:userId`
- `GET /api/result/quiz/:quizId/user/:userId`

L'utilisateur passe un quiz, le backend valide ses réponses et enregistre le score associé.

## 6. Modèle de données

### User

- `id`
- `lastName`
- `firstName`
- `email`
- `password`

### Lesson

- `id`
- `name`
- `content`
- `user_id`

### Quiz

- `id`
- `name`
- `user_id`
- `lesson_id`

### Question

- `id`
- `question`
- `answer_a`
- `answer_b`
- `answer_c`
- `answer_d`
- `correct_answer`
- `quiz_id`

### Result

- `id`
- `results`
- `user_id`
- `quiz_id`

## 7. Installation et lancement

### Prérequis

- Docker
- Docker Compose
- Node.js 20+ (si vous voulez lancer le projet sans Docker)
- npm

### Option A : lancer le projet avec Docker (recommandé)

À la racine du projet :

```bash
docker compose up --build
```

Cela va démarrer les services suivants :

- MySQL sur le port `3306`
- Backend API sur le port `3001`
- Frontend Vite sur le port `5173`

Ensuite ouvrez l'application dans le navigateur :

```text
http://localhost:5173
```

Le backend est disponible ici :

```text
http://localhost:3001
```

### Option B : lancer la partie backend localement

Déplacer le projet dans le dossier htdocs de xampp

Dans `backend/` :

```bash
npm install
```

Créer un fichier `.env` dans le dossier `backend` avec par exemple :

```env
PORT=3001
DB_NAME=novaquiz
DB_USER=root
DB_PASS=
DB_HOST=localhost
JWT_SECRET=pfe2026ecehanifaali
```

Puis lancer :

```bash
npm run dev
```

### Option C : lancer le frontend localement

Dans `frontend/` :

```bash
npm install
npm run dev
```

Le frontend sera alors disponible sur :

```text
http://localhost:5173
```

## 8. Variables d'environnement

Le backend attend des variables d'environnement pour se connecter à MySQL et signer les JWT.

Exemple minimal :

```env
PORT=3001
DB_NAME=novaquiz
DB_USER=novaquiz
DB_PASS=novaquizpass
DB_HOST=localhost
JWT_SECRET=changeme
```

Avec Docker Compose, ces variables sont déjà définies dans `docker-compose.yml`.

## 9. Tests

Le backend contient des tests Jest dans `backend/test`.

Pour lancer les tests :

```bash
cd backend
npm test
```

## 10. Points d'entrée de l'API

API principale :

- `http://localhost:3001/api/auth/...`
- `http://localhost:3001/api/lesson/...`
- `http://localhost:3001/api/quiz/...`
- `http://localhost:3001/api/question/...`
- `http://localhost:3001/api/result/...`

## 11. Bonnes pratiques / remarques

- Le projet est pensé autour d'un utilisateur connecté.
- Chaque route critique est protégée par `authMiddleware`.
- Les données sont stockées via Sequelize en base MySQL.
- La synchronisation automatique des modèles est activée avec `sequelize.sync({ alter: true })` lors du démarrage du backend, ce qui permet une prise en main rapide en environnement de développement.


## 12. Résumé

NovaQuiz est une petite plateforme d'apprentissage qui permet à un utilisateur de :

- créer des cours,
- créer des quiz,
- gérer des questions,
- répondre à des questionnaires,
- conserver un historique de ses résultats.

Le projet montre une architecture simple et cohérente en JavaScript full-stack, avec backend API + frontend React + base MySQL, et une mise en route facile via Docker.

## 13. Commandes utiles

Démarrer tout le projet :

```bash
docker compose up --build
```

Arrêter le projet :

```bash
docker compose down
```

Lancer les tests backend :

```bash
cd backend
npm test
```

Démarrer le backend sans Docker :

```bash
cd backend
npm run dev
```

Démarrer le frontend sans Docker :

```bash
cd frontend
npm run dev
```
