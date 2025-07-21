# Partner Portal Prototype – Mochadocs

This is a prototype system designed to support the management of Mochadocs' partner ecosystem. It demonstrates role-based access control (RBAC), hierarchical data visibility, and key workflows such as partner creation, client reassignment, and user management.

## 🗂 Project Structure

- `client/`: Frontend application developed using **Angular**
- `server/`: Backend application built with **Symfony**, integrated with:
    - **API Platform** for RESTful API development
    - **Doctrine ORM** for data modeling and persistence
- `server/src/DataFixtures/`: Contains **mock data** used for testing and development

## 🚀 Getting Started

Make sure you have Node.js, PHP, Composer, and Symfony CLI installed.

### Frontend (`client/`)
```bash
cd client
npm install
ng serve
```

### Backend (`server/`)
```bash
cd server
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
symfony server:start
```

## Test Accounts

Use the following credentials to log in with different roles:

| Role                   | Email       | Password     |
|------------------------|-------------|--------------|
| Super Admin            | admin@user  | testpassword |
| Growth Partner Admin   | gp@user     | testpassword |
| Solution Partner Admin | spa@user    | testpassword |

## Technologies Used
**Frontend:**
- Angular
- ng-zorro
- ng-openapi-gen
- Tailwind CSS

**Backend:**
- Symfony
- API Platform (RESTful APIs)
- Doctrine ORM (Database modeling)

**Authentication:**
- JWT (JSON Web Token) for stateless session control

**Data & Testing:**
- DataFixtures for mock data generation
- PHPUnit for backend testing